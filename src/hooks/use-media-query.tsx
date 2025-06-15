
import { useState, useEffect } from "react";

/**
 * React hook to check if a media query matches.
 * @param query string, e.g. '(max-width: 768px)'
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const updateMatch = () => setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener("change", updateMatch);

    // Initial check
    setMatches(mediaQueryList.matches);

    return () => mediaQueryList.removeEventListener("change", updateMatch);
  }, [query]);

  return matches;
}
