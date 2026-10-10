import { createAnalytics, whenIdle, MAX_QUEUE, POSTHOG_CONFIG, POSTHOG_TOKEN } from './analytics'

const flush = () => new Promise((r) => setTimeout(r, 0))
const context = () => ({
  url: new URL('https://the-ashterisk.github.io/toolkit/?utm_source=youtube'),
  referrer: '',
  userAgent: 'Mozilla/5.0',
})

function setup(overrides: Partial<Parameters<typeof createAnalytics>[0]> = {}) {
  const ph = { init: vi.fn(), register: vi.fn(), capture: vi.fn() }
  let idle = () => {}
  const load = vi.fn(() => Promise.resolve(ph))
  const analytics = createAnalytics({
    enabled: true,
    load,
    whenIdle: (cb) => {
      idle = cb
    },
    context,
    ...overrides,
  })
  return { analytics, ph, load, runIdle: () => idle() }
}

test('does nothing when disabled (dev, tests, CI)', async () => {
  const { analytics, load, runIdle } = setup({ enabled: false })
  analytics.init()
  analytics.track('toolkit_copied', { slug: 'claude-md' })
  runIdle()
  await flush()
  expect(load).not.toHaveBeenCalled()
})

test('waits for idle before loading PostHog, and loads it once', async () => {
  const { analytics, load, runIdle } = setup()
  analytics.init()
  analytics.init()
  expect(load).not.toHaveBeenCalled()
  runIdle()
  await flush()
  expect(load).toHaveBeenCalledTimes(1)
})

test('initialises cookieless, registers the source, then sends the pageview', async () => {
  const { analytics, ph, runIdle } = setup()
  analytics.init()
  runIdle()
  await flush()
  expect(ph.init).toHaveBeenCalledWith(POSTHOG_TOKEN, POSTHOG_CONFIG)
  expect(ph.register).toHaveBeenCalledWith({ traffic_source: 'youtube', in_app_browser: false })
  expect(ph.capture).toHaveBeenCalledWith('$pageview')
  expect(ph.register.mock.invocationCallOrder[0]).toBeLessThan(ph.capture.mock.invocationCallOrder[0])
})

test('config stays lean and cookieless', () => {
  expect(POSTHOG_CONFIG).toMatchObject({
    cookieless_mode: 'always',
    capture_pageview: false,
    capture_pageleave: false,
    autocapture: false,
    disable_session_recording: true,
    disable_surveys: true,
    enable_heatmaps: false,
    capture_dead_clicks: false,
    capture_performance: false,
    advanced_disable_flags: true,
    disable_external_dependency_loading: true,
  })
})

test('events tracked before PostHog is ready are sent in order after the pageview', async () => {
  const { analytics, ph, runIdle } = setup()
  analytics.init()
  analytics.track('toolkit_copied', { slug: 'a', success: true })
  analytics.track('toolkit_downloaded', { slug: 'b' }, { beacon: true })
  runIdle()
  await flush()
  expect(ph.capture.mock.calls).toEqual([
    ['$pageview'],
    ['toolkit_copied', { slug: 'a', success: true }, undefined],
    ['toolkit_downloaded', { slug: 'b' }, { transport: 'sendBeacon' }],
  ])
})

test('once ready, events go straight through', async () => {
  const { analytics, ph, runIdle } = setup()
  analytics.init()
  runIdle()
  await flush()
  analytics.track('toolkit_downloaded', { slug: 'x' }, { beacon: true })
  expect(ph.capture).toHaveBeenLastCalledWith('toolkit_downloaded', { slug: 'x' }, { transport: 'sendBeacon' })
})

test('the queue is capped so a slow or blocked PostHog cannot grow memory', async () => {
  const { analytics, ph, runIdle } = setup()
  analytics.init()
  for (let i = 0; i < MAX_QUEUE + 10; i++) analytics.track('toolkit_copied', { i })
  runIdle()
  await flush()
  expect(ph.capture).toHaveBeenCalledTimes(1 + MAX_QUEUE)
})

test('a blocked PostHog is swallowed and later tracking is a silent no-op', async () => {
  const { analytics, runIdle } = setup({ load: () => Promise.reject(new Error('blocked by an ad blocker')) })
  analytics.init()
  analytics.track('toolkit_copied')
  runIdle()
  await flush()
  expect(() => analytics.track('toolkit_copied')).not.toThrow()
})

test('a throwing capture never reaches the caller', async () => {
  const { analytics, ph, runIdle } = setup()
  analytics.init()
  runIdle()
  await flush()
  ph.capture.mockImplementation(() => {
    throw new Error('boom')
  })
  expect(() => analytics.track('toolkit_copied')).not.toThrow()
})

describe('whenIdle', () => {
  const fakeWindow = (readyState: string, withIdleCallback: boolean) => {
    let onLoad = () => {}
    const win = {
      document: { readyState },
      setTimeout: vi.fn((cb: () => void) => cb()),
      addEventListener: vi.fn((_type: string, cb: () => void) => {
        onLoad = cb
      }),
      ...(withIdleCallback ? { requestIdleCallback: vi.fn((cb: () => void) => cb()) } : {}),
    }
    return { win: win as unknown as Window, raw: win, fireLoad: () => onLoad() }
  }

  test('waits for the load event when the page is still loading', () => {
    const cb = vi.fn()
    const { win, raw, fireLoad } = fakeWindow('loading', true)
    whenIdle(cb, win)
    expect(cb).not.toHaveBeenCalled()
    expect(raw.addEventListener).toHaveBeenCalledWith('load', expect.any(Function), { once: true })
    fireLoad()
    expect(cb).toHaveBeenCalledTimes(1)
  })

  test('uses requestIdleCallback when the browser has it', () => {
    const cb = vi.fn()
    const { win, raw } = fakeWindow('complete', true)
    whenIdle(cb, win)
    expect(raw.requestIdleCallback).toHaveBeenCalled()
    expect(cb).toHaveBeenCalledTimes(1)
  })

  test('falls back to setTimeout (Safari, older webviews)', () => {
    const cb = vi.fn()
    const { win, raw } = fakeWindow('complete', false)
    whenIdle(cb, win)
    expect(raw.setTimeout).toHaveBeenCalled()
    expect(cb).toHaveBeenCalledTimes(1)
  })
})
