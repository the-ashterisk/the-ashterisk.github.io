// Replaces window.matchMedia so that exactly the given queries match.
// setupTests.ts installs a default all-false mock; tests that need a
// matching query call this in beforeEach.
export function mockMatchMedia(matchingQueries: string[]): void {
  window.matchMedia = (query: string) =>
    ({
      matches: matchingQueries.includes(query),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList
}
