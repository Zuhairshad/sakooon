'use client';

import { useAfterPaint } from '@/components/theme/useAfterPaint';

/**
 * Runs a ported section script against the section root once it is in the DOM.
 * The callback receives the root element and an AbortSignal that is aborted on
 * cleanup — pass it as `{ signal }` to addEventListener so listeners never
 * double up (React strict mode runs effects twice in development).
 * It may also return its own cleanup function.
 * Mirrors the theme's `if (!r || r.dataset.on) return; r.dataset.on = 1` guard.
 */
export function useSection(id: string, init: (root: HTMLElement, signal: AbortSignal) => void | (() => void), deps: unknown[] = []) {
  useAfterPaint(() => {
    const r = document.getElementById(id);
    if (!r || r.dataset.on) return;
    r.dataset.on = '1';
    const ac = new AbortController();
    const cleanup = init(r, ac.signal);
    return () => {
      ac.abort();
      delete r.dataset.on;
      if (typeof cleanup === 'function') cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, ...deps]);
}
