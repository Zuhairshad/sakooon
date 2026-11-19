'use client';

import { useEffect, type DependencyList, type EffectCallback } from 'react';

/** Run `fn` after the browser has painted the next frame (rAF → macrotask). */
export function afterPaint(fn: () => void): () => void {
  let t: ReturnType<typeof setTimeout> | undefined;
  const r = requestAnimationFrame(() => {
    t = setTimeout(fn, 0);
  });
  return () => {
    cancelAnimationFrame(r);
    clearTimeout(t);
  };
}

/**
 * useEffect that starts after the next paint. Theme behaviours (reveal,
 * sliders, header measurements…) read layout and add listeners; running them
 * before the first frame delays it, so they wait one frame instead.
 */
export function useAfterPaint(effect: EffectCallback, deps?: DependencyList) {
  useEffect(() => {
    let cleanup: void | (() => void);
    let done = false;
    const cancel = afterPaint(() => {
      if (!done) cleanup = effect();
    });
    return () => {
      done = true;
      cancel();
      if (typeof cleanup === 'function') cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
