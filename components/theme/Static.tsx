'use client';

import { useState, useSyncExternalStore, type ReactNode } from 'react';

const noop = () => () => {};

/**
 * Server-rendered markup that React does not hydrate.
 *
 * The theme's sections are static HTML driven by the DOM runtime
 * (lib/theme/runtime.ts) and small behaviour components — React never needs to
 * own their nodes. Hydrating ~2,700 elements on a phone was the main cost left
 * on first load, so during hydration this renders an element with an empty
 * `dangerouslySetInnerHTML`: React keeps the server HTML and skips the subtree.
 * On client-side navigation (no hydration) the children render normally.
 *
 * Rules: put behaviour/client components NEXT TO a Static block, never inside
 * (they would not mount). Internal links inside get client-side navigation from
 * the global handler in components/theme/ThemeRuntime.tsx.
 */
export default function Static({ children }: { children: ReactNode }) {
  // true only while hydrating (React uses the server snapshot for that render)
  const hydrating = useSyncExternalStore(noop, () => false, () => true);
  const [skip] = useState(hydrating);
  if (typeof window === 'undefined' || !skip) return <div className="sn-static">{children}</div>;
  return <div className="sn-static" dangerouslySetInnerHTML={{ __html: '' }} suppressHydrationWarning />;
}
