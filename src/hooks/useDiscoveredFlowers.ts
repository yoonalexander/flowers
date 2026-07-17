import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'flowers:discovered';

function readStored(): Set<string> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      // Filter to strings defensively in case storage was tampered with.
      return new Set(parsed.filter((v): v is string => typeof v === 'string'));
    }
    return new Set();
  } catch {
    // Bad JSON or unavailable storage — start fresh, never crash.
    return new Set();
  }
}

/**
 * Tracks which flowers have been discovered, persisted to `sessionStorage` so a
 * mid-session refresh restores progress. Each flower id only counts once.
 *
 * Returns the discovered set, helpers to mark/reset, and whether the store has
 * hydrated from storage yet (so the UI can avoid a first-paint flash).
 */
export function useDiscoveredFlowers() {
  const [discovered, setDiscovered] = useState<Set<string>>(() => readStored());
  const [hydrated, setHydrated] = useState(false);

  // Mark hydrated after mount so SSR/first-paint state is settled.
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Persist whenever the set changes (and after hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(discovered)),
      );
    } catch {
      /* storage might be unavailable (private mode) — ignore. */
    }
  }, [discovered, hydrated]);

  const discover = useCallback((id: string) => {
    setDiscovered((prev) => {
      if (prev.has(id)) return prev; // counts only once
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setDiscovered(new Set());
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { discovered, discover, reset, hydrated };
}
