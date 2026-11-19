'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { loadRuntime } from '@/lib/theme/lite';

/** Same-origin page link that the browser would otherwise load with a full navigation. */
function internalHref(e: MouseEvent): string | null {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
  if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download') || a.dataset.noRouter !== undefined) return null;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || /^\/(api|_next|images|theme)\//.test(url.pathname)) return null;
  if (url.pathname === location.pathname && url.search === location.search && url.hash) return null; // in-page anchor
  return url.pathname + url.search + url.hash;
}

/**
 * Installs the theme runtime's global listeners once, and gives plain <a>
 * links (markup inside <Static>, which React does not hydrate) client-side
 * navigation and hover prefetching, like next/link. Pages call <Boot />.
 */
export default function ThemeRuntime() {
  const router = useRouter();
  useEffect(() => {
    // the runtime is code-split; Boot (rendered by each page) also loads it after paint
    const t = setTimeout(() => loadRuntime().then((m) => m.install()), 0);
    const ac = new AbortController();
    // bubble phase: next/link and the runtime's handlers run first and preventDefault
    document.addEventListener(
      'click',
      (e) => {
        const href = internalHref(e);
        if (!href) return;
        e.preventDefault();
        router.push(href);
      },
      { signal: ac.signal },
    );
    const done = new Set<string>();
    const prefetch = (e: Event) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="/"]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank') return;
      const href = a.getAttribute('href')!;
      if (done.has(href) || /^\/(api|_next)\//.test(href)) return;
      done.add(href);
      router.prefetch(href);
    };
    document.addEventListener('pointerover', prefetch, { passive: true, signal: ac.signal });
    document.addEventListener('touchstart', prefetch, { passive: true, signal: ac.signal });
    return () => {
      clearTimeout(t);
      ac.abort();
    };
  }, [router]);
  return null;
}
