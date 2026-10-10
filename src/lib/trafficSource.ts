// Where a visit came from, for the analytics dashboard. Pure so it's easy to test.

export type TrafficSource = 'youtube' | 'instagram' | 'other'

const IN_APP_BROWSER = /Instagram|FBAN|FBAV/i

/** Instagram's (and Facebook's) in-app browser, which often blocks downloads and drops the referrer. */
export function isInAppBrowser(userAgent: string): boolean {
  return IN_APP_BROWSER.test(userAgent)
}

const isHost = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`)

function platformOf(referrer: string): TrafficSource {
  let host: string
  try {
    host = new URL(referrer).hostname
  } catch {
    return 'other'
  }
  if (isHost(host, 'youtube.com') || host === 'youtu.be') return 'youtube'
  if (isHost(host, 'instagram.com')) return 'instagram'
  return 'other'
}

/** First match wins: our own utm tag, then Instagram's webview, then the referrer. */
export function trafficSource(url: URL, referrer: string, userAgent: string): TrafficSource {
  const tagged = url.searchParams.get('utm_source')?.toLowerCase()
  if (tagged === 'youtube' || tagged === 'instagram') return tagged
  if (isInAppBrowser(userAgent)) return 'instagram'
  return platformOf(referrer)
}
