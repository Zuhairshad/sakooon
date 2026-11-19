/**
 * Tiny helpers shared with components that must not pull the full theme
 * runtime (lib/theme/runtime.ts) into the first-load bundle.
 */

/** Run once the page is idle (html.sn-idle, set in app/layout.tsx). */
export function whenIdle(fn: () => void) {
  if (document.documentElement.classList.contains('sn-idle')) fn();
  else document.addEventListener('sn:idle', fn, { once: true });
}

const RK = 'sakooon:recent';
const readLS = (k: string): string[] => {
  try {
    return JSON.parse(localStorage.getItem(k) || '[]') || [];
  } catch {
    return [];
  }
};

/** Recently viewed product handles (localStorage). */
export const recent = {
  get: () => readLS(RK),
  push(h: string) {
    const a = recent.get().filter((x) => x !== h);
    a.unshift(h);
    try {
      localStorage.setItem(RK, JSON.stringify(a.slice(0, 16)));
    } catch {}
  },
};

/** Load the theme runtime on demand (code-split out of the first-load JS). */
export const loadRuntime = () => import('./runtime');
