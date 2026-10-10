import { isInAppBrowser, trafficSource } from './trafficSource'

const CHROME = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile Safari/604.1'
const INSTAGRAM = `${CHROME} Instagram 350.0.0.0`
const url = (q = '') => new URL(`https://the-ashterisk.github.io/toolkit/claude-md/${q}`)

test('isInAppBrowser spots Instagram and Facebook webviews only', () => {
  expect(isInAppBrowser(INSTAGRAM)).toBe(true)
  expect(isInAppBrowser(`${CHROME} [FBAN/FBIOS;FBAV/450.0]`)).toBe(true)
  expect(isInAppBrowser(CHROME)).toBe(false)
})

test('utm_source wins over everything, case-insensitively', () => {
  expect(trafficSource(url('?utm_source=youtube'), 'https://www.instagram.com/', INSTAGRAM)).toBe('youtube')
  expect(trafficSource(url('?utm_source=Instagram'), '', CHROME)).toBe('instagram')
  expect(trafficSource(url('?utm_source=YOUTUBE&utm_medium=shortlink'), '', CHROME)).toBe('youtube')
})

test('an unknown or empty utm_source falls through to the other rules', () => {
  expect(trafficSource(url('?utm_source=newsletter'), '', CHROME)).toBe('other')
  expect(trafficSource(url('?utm_source='), '', INSTAGRAM)).toBe('instagram')
})

test('Instagram in-app browser counts as Instagram without a tag', () => {
  expect(trafficSource(url(), '', INSTAGRAM)).toBe('instagram')
})

test('referrer from YouTube or Instagram hosts is attributed', () => {
  expect(trafficSource(url(), 'https://www.youtube.com/', CHROME)).toBe('youtube')
  expect(trafficSource(url(), 'https://m.youtube.com/shorts/abc', CHROME)).toBe('youtube')
  expect(trafficSource(url(), 'https://youtu.be/abc', CHROME)).toBe('youtube')
  expect(trafficSource(url(), 'https://l.instagram.com/?u=x', CHROME)).toBe('instagram')
  expect(trafficSource(url(), 'https://instagram.com/', CHROME)).toBe('instagram')
})

test('lookalike hosts, other sites, empty and malformed referrers are other', () => {
  expect(trafficSource(url(), 'https://notyoutube.com/', CHROME)).toBe('other')
  expect(trafficSource(url(), 'https://www.google.com/', CHROME)).toBe('other')
  expect(trafficSource(url(), '', CHROME)).toBe('other')
  expect(trafficSource(url(), 'not a url', CHROME)).toBe('other')
})
