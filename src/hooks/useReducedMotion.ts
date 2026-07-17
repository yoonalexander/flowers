import { useEffect, useState } from 'react';

/**
 * Reflects the user's `prefers-reduced-motion` setting and updates live if they
 * change it. CSS also guards animations, but this hook lets components skip
 * JS-driven effects (e.g. a burst of petals) when motion is reduced.
 */
export function useReducedMotion(): boolean {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
