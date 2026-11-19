'use client';

import { loadRuntime } from '@/lib/theme/lite';
import { useAfterPaint } from './useAfterPaint';

/**
 * Render last inside every page. Runs after the page's own subtree has
 * hydrated and the next frame has painted, so the DOM-driven runtime (reveal,
 * rails, feathers, wishlist state) never touches markup React has not claimed
 * and never delays the first paint. The runtime itself is code-split.
 */
export default function Boot() {
  useAfterPaint(() => {
    let live = true;
    loadRuntime().then((m) => {
      if (!live) return;
      m.install();
      m.boot(document);
    });
    return () => {
      live = false;
    };
  }, []);
  return null;
}
