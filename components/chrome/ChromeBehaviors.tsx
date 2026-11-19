'use client';

import { useAfterPaint } from '@/components/theme/useAfterPaint';

const ANN = 'sna-sections--23876059037799__announcement';
const POP = 'snpu-sections--23876059070567__popup';

/** Ported section scripts for the announcement bar, header, footer and popup. */
export default function ChromeBehaviors() {
  useAfterPaint(() => {
    const offs: (() => void)[] = [];
    const on = <K extends keyof WindowEventMap>(t: Window, ev: K, fn: (e: WindowEventMap[K]) => void, o?: AddEventListenerOptions) => {
      t.addEventListener(ev, fn, o);
      offs.push(() => t.removeEventListener(ev, fn, o));
    };

    /* announcement rotator */
    const r = document.getElementById(ANN);
    if (r) {
      const m = r.querySelectorAll('[data-sna-m]');
      if (m.length > 1) {
        let i = 0, hov = false;
        const sec = parseFloat(r.getAttribute('data-speed') || '') || 5;
        r.addEventListener('mouseenter', () => (hov = true));
        r.addEventListener('mouseleave', () => (hov = false));
        const t = setInterval(() => {
          if (hov || document.hidden) return;
          const a = m[i];
          i = (i + 1) % m.length;
          const b = m[i];
          a.classList.remove('is-on'); a.classList.add('is-out'); b.classList.remove('is-out'); b.classList.add('is-on');
          setTimeout(() => a.classList.remove('is-out'), 800);
        }, sec * 1000);
        offs.push(() => clearInterval(t));
      }
    }

    /* header: mega menus, hide-on-scroll */
    const h = document.getElementById('snh');
    if (h) {
      const lis = h.querySelectorAll<HTMLElement>('[data-snh-li].has-mega');
      const beh = h.getAttribute('data-behavior');
      const ann = r?.parentElement || null;
      let t: ReturnType<typeof setTimeout> | undefined;
      const setTop = () => {
        const a = ann ? ann.getBoundingClientRect().height : 0;
        h.style.setProperty('--snh-top', h.classList.contains('snh--clear') ? Math.max(0, a - scrollY) + 'px' : '0px');
        h.style.setProperty('--snh-bottom', h.getBoundingClientRect().bottom + 'px');
      };
      const close = () => {
        lis.forEach((l) => { l.classList.remove('is-open'); l.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false'); });
        h.classList.remove('is-open');
      };
      lis.forEach((li) => {
        const a = li.querySelector<HTMLElement>('.snh__a');
        const open = () => {
          clearTimeout(t);
          t = setTimeout(() => {
            lis.forEach((x) => x.classList.toggle('is-open', x === li));
            h.classList.add('is-open');
            a?.setAttribute('aria-expanded', 'true');
            setTop();
          }, 80);
        };
        li.addEventListener('mouseenter', open);
        li.addEventListener('mouseleave', () => { clearTimeout(t); t = setTimeout(close, 180); });
        li.addEventListener('focusin', open);
        a?.addEventListener('keydown', (e) => { if (e.key === 'Escape') { close(); a.focus(); } });
        // close the mega menu after a click navigates
        li.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) setTimeout(close, 0); });
      });
      h.addEventListener('focusout', (e) => { if (!h.contains(e.relatedTarget as Node)) close(); });
      let lastY = scrollY, ticking = false;
      const onScroll = () => {
        ticking = false;
        const y = scrollY;
        h.classList.toggle('is-scrolled', y > 20);
        if (beh === 'hide' && !h.classList.contains('is-open')) h.classList.toggle('is-hidden', y > lastY && y > 300);
        lastY = y;
        setTop();
      };
      on(window, 'scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
      on(window, 'resize', setTop);
      onScroll();
    }

    /* footer: collapse columns on mobile, draw the wordmark */
    const f = document.getElementById('snf');
    if (f) {
      if (window.innerWidth < 600) f.querySelectorAll('.snf__d').forEach((d) => d.removeAttribute('open'));
      const mark = f.querySelector('[data-snf-mark]'), sh = f.querySelector('.snf__moon-sh'), mo = f.querySelector('.snf__moon');
      const io = new IntersectionObserver(
        (es) => es.forEach((e) => {
          if (!e.isIntersecting) return;
          if (e.target === mark) mark.classList.add('is-drawn');
          else sh?.setAttribute('cx', '150');
          io.unobserve(e.target);
        }),
        { threshold: 0.3 },
      );
      if (mark) io.observe(mark);
      if (mo) io.observe(mo);
      offs.push(() => io.disconnect());
    }

    /* newsletter forms → /api/newsletter */
    const subscribe = async (form: HTMLFormElement, tags: string) => {
      const email = (form.querySelector('input[type=email]') as HTMLInputElement)?.value;
      const btn = form.querySelector('button[type=submit]');
      btn?.classList.add('is-busy');
      try {
        const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, tags }) });
        const d = await res.json().catch(() => ({}));
        return res.ok ? d : Promise.reject(d);
      } finally {
        btn?.classList.remove('is-busy');
      }
    };
    const news = document.getElementById('snf-news') as HTMLFormElement | null;
    if (news) {
      const fn = (e: Event) => {
        e.preventDefault();
        subscribe(news, 'newsletter')
          .then(() => { window.SN?.toast?.('You’re on the list. Sleep well.'); news.reset(); })
          .catch(() => window.SN?.toast?.('Could not subscribe — please try again.', 'close'));
      };
      news.addEventListener('submit', fn);
      offs.push(() => news.removeEventListener('submit', fn));
    }

    /* welcome popup */
    const p = document.getElementById(POP);
    if (p && !p.dataset.on) {
      p.dataset.on = '1';
      const key = p.getAttribute('data-key') || 'sakooon:pop', days = +(p.getAttribute('data-days') || 0);
      const seen = () => { try { const v = +(localStorage.getItem(key) || 0); return !!v && Date.now() - v < days * 864e5; } catch { return false; } };
      const mark = () => { try { localStorage.setItem(key, String(Date.now())); } catch {} };
      const open = () => {
        if (p.classList.contains('is-open')) return;
        p.hidden = false;
        requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('is-open')));
      };
      const close = () => { p.classList.remove('is-open'); mark(); setTimeout(() => (p.hidden = true), 700); };
      p.addEventListener('click', (e) => {
        const t = e.target as HTMLElement;
        if (t.closest('[data-snpu-close]')) { e.preventDefault(); close(); }
        const c = t.closest('[data-snpu-code]');
        if (c) {
          navigator.clipboard?.writeText(c.getAttribute('data-snpu-code') || '');
          const sp = c.querySelector('span');
          if (sp) sp.textContent = 'Copied';
        }
      });
      const form = p.querySelector('form');
      form?.addEventListener('submit', (e) => {
        e.preventDefault();
        subscribe(form, 'newsletter,popup')
          .then((d) => {
            mark();
            const body = form.parentElement!;
            const code = d?.code as string | undefined;
            form.outerHTML = code
              ? `<div class="snpu__ok" data-snpu-success><p class="snpu__text">You're in. Here is your code:</p><button type="button" class="sn-btn sn-btn--gold sn-btn--sm" data-snpu-code="${code}"><span>${code}</span></button></div>`
              : `<div class="snpu__ok" data-snpu-success><p class="snpu__text">You're in — check your inbox for your 10% code.</p></div>`;
            body.querySelector('.snpu__no')?.remove();
          })
          .catch(() => window.SN?.toast?.('Could not subscribe — please try again.', 'close'));
      });
      on(window, 'keydown', (e) => { if (e.key === 'Escape' && p.classList.contains('is-open')) close(); });
      if (!p.hasAttribute('data-off') && !seen()) {
        let fired = false;
        const go = () => { if (!fired) { fired = true; open(); } };
        const t = setTimeout(go, (+(p.getAttribute('data-delay') || 6)) * 1000);
        offs.push(() => clearTimeout(t));
        if (p.getAttribute('data-exit') === 'true') {
          const ex = (e: MouseEvent) => { if (!e.relatedTarget && e.clientY < 10) go(); };
          document.addEventListener('mouseout', ex);
          offs.push(() => document.removeEventListener('mouseout', ex));
        }
      }
    }
    return () => offs.forEach((f) => f());
  }, []);
  return null;
}
