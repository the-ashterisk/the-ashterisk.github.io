// Types from the same slim entry we load, so they match the loaded client.
import type { PostHogConfig } from 'posthog-js/dist/module.slim.no-external'
import { isInAppBrowser, trafficSource } from './trafficSource'

// The only file that knows about PostHog. It loads after the page is idle,
// sends nothing outside production, and never throws into a click handler.

export type AnalyticsEvent = 'toolkit_copied' | 'toolkit_downloaded'
export type EventProps = Record<string, string | number | boolean>
export interface TrackOptions {
  /** Survives the page navigating away (downloads in Instagram's webview). */
  beacon?: boolean
}

// Write-only project token: public by design, so it's fine in this public repo.
export const POSTHOG_TOKEN = 'phc_pKFfBFFKngErS7q2XkuK6XPbdbu2n68RES5m2rT4uiQ3'
const POSTHOG_HOST = 'https://us.i.posthog.com'

export const POSTHOG_CONFIG = {
  api_host: POSTHOG_HOST,
  cookieless_mode: 'always',
  // Sent by hand after register() so the pageview carries traffic_source.
  capture_pageview: false,
  capture_pageleave: false,
  // The project has these on remotely; off here keeps the SDK from loading extra scripts.
  autocapture: false,
  disable_session_recording: true,
  disable_surveys: true,
  enable_heatmaps: false,
  capture_dead_clicks: false,
  capture_performance: false,
  advanced_disable_flags: true,
  disable_external_dependency_loading: true,
} satisfies Partial<PostHogConfig>

export const MAX_QUEUE = 50

interface PostHogClient {
  init(token: string, config: Partial<PostHogConfig>): unknown
  register(props: EventProps): void
  capture(event: string, props?: EventProps, options?: { transport: 'sendBeacon' }): unknown
}

interface Deps {
  enabled: boolean
  load: () => Promise<PostHogClient>
  whenIdle: (cb: () => void) => void
  context: () => { url: URL; referrer: string; userAgent: string }
}

/** Runs `cb` once the page has loaded and the browser is idle. */
export function whenIdle(cb: () => void, win: Window = window): void {
  const schedule = () => {
    // typeof, not `in`: `in` would narrow `win` to never in the else branch.
    if (typeof win.requestIdleCallback === 'function') win.requestIdleCallback(() => cb(), { timeout: 3000 })
    else win.setTimeout(cb, 1)
  }
  if (win.document.readyState === 'complete') schedule()
  else win.addEventListener('load', schedule, { once: true })
}

export function createAnalytics({ enabled, load, whenIdle, context }: Deps) {
  let state: 'idle' | 'loading' | 'ready' | 'off' = enabled ? 'idle' : 'off'
  let client: PostHogClient | null = null
  const queue: [AnalyticsEvent, EventProps | undefined, TrackOptions | undefined][] = []

  const send = (c: PostHogClient, event: AnalyticsEvent, props?: EventProps, options?: TrackOptions) =>
    c.capture(event, props, options?.beacon ? { transport: 'sendBeacon' } : undefined)

  function init(): void {
    if (state !== 'idle') return
    state = 'loading'
    whenIdle(() => {
      load()
        .then((posthog) => {
          posthog.init(POSTHOG_TOKEN, POSTHOG_CONFIG)
          const { url, referrer, userAgent } = context()
          posthog.register({ traffic_source: trafficSource(url, referrer, userAgent), in_app_browser: isInAppBrowser(userAgent) })
          posthog.capture('$pageview')
          for (const [event, props, options] of queue.splice(0)) send(posthog, event, props, options)
          client = posthog
          state = 'ready'
        })
        .catch(() => {
          // Blocked or broken: analytics stays off for this page; the site doesn't care.
          state = 'off'
          queue.length = 0
        })
    })
  }

  function track(event: AnalyticsEvent, props?: EventProps, options?: TrackOptions): void {
    if (state === 'off') return
    if (!client) {
      if (queue.length < MAX_QUEUE) queue.push([event, props, options])
      return
    }
    try {
      send(client, event, props, options)
    } catch {
      // Never let analytics break Copy or Download.
    }
  }

  return { init, track }
}

const analytics = createAnalytics({
  enabled: import.meta.env.PROD,
  load: () => import('posthog-js/dist/module.slim.no-external').then((m) => m.default),
  whenIdle,
  context: () => ({ url: new URL(location.href), referrer: document.referrer, userAgent: navigator.userAgent }),
})

export const initAnalytics = analytics.init
export const track = analytics.track
