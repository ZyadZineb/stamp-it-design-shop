
import { useEffect, useState } from "react";

/**
 * Returns a debounced value after a wait period in ms.
 * Useful for expensive/re-render-heavy operations.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}
