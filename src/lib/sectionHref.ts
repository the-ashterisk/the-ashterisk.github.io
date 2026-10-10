const HOME_PATHS = ['/', '/index.html']

// Section anchors live on the home page. From any other page (e.g. /privacy/)
// the link must navigate home first, so prefix the path.
export function sectionHref(id: string): string {
  return HOME_PATHS.includes(window.location.pathname) ? `#${id}` : `/#${id}`
}
