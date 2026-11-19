'use client';

import { useAfterPaint } from '@/components/theme/useAfterPaint';
import { behaviors, type BehaviorName } from './behaviors';

/** Runs a ported section script on the element with `id` after hydration. */
export default function SectionScript({ id, name }: { id: string; name: BehaviorName }) {
  useAfterPaint(() => {
    const r = document.getElementById(id);
    if (!r || r.dataset.on) return;
    r.dataset.on = '1';
    const offs: (() => void)[] = [];
    const on = (t: EventTarget, ev: string, fn: (e: never) => void, o?: AddEventListenerOptions | boolean) => {
      t.addEventListener(ev, fn as EventListener, o);
      offs.push(() => t.removeEventListener(ev, fn as EventListener, o));
    };
    const cleanup = behaviors[name](r, on);
    return () => {
      delete r.dataset.on;
      offs.forEach((f) => f());
      if (typeof cleanup === 'function') cleanup();
    };
  }, [id, name]);
  return null;
}
