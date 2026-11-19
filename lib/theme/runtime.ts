/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Port of the Sakooon Nocturne theme runtime (sn-core.js).
 * DOM-driven by data attributes, exactly like the Liquid theme, so the
 * ported markup behaves the same. Differences from the original:
 *  - Shopify AJAX endpoints are replaced by /api/* routes + server actions
 *  - click handlers run in the capture phase so they win over <Link>
 *  - boot() is re-run after every client-side navigation
 *  - the WebGL "silk" renderer is gone (CSS only, see theme.css)
 */
import { money as fmtMoney, img as imgUrl } from '@/lib/utils';
import { recent, whenIdle } from './lite';

export { recent, whenIdle };

type El = HTMLElement;
const $ = <T extends Element = El>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = El>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const motion = () => document.body.getAttribute('data-motion') !== 'off' && !reduce();
const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export type SNCart = {
  add: (items: { id: number | string; quantity?: number }[], open?: boolean) => Promise<unknown>;
  change: (lineId: string, qty: number) => Promise<unknown>;
  count: (n: number) => void;
  open: () => void;
};

declare global {
  interface Window {
    SN: any;
  }
}

const I = (d: string) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
export const icons: Record<string, string> = {
  check: I('<path d="m5 12 5 5 9-10"/>'),
  heart: I('<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11Z"/>'),
  close: I('<path d="M6 6l12 12M18 6 6 18"/>'),
  plus: I('<path d="M12 5v14M5 12h14"/>'),
  minus: I('<path d="M5 12h14"/>'),
  bag: I('<path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
  arrow: I('<path d="M4 12h16M14 6l6 6-6 6"/>'),
  search: I('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'),
};

/* ---------------- reveal + split text ---------------- */
function split(el: El) {
  if (el.dataset.snSplitDone) return;
  el.dataset.snSplitDone = '1';
  let i = 0;
  (function walk(node: Node) {
    Array.from(node.childNodes).forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent!.split(/(\s+)/).forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) return void frag.appendChild(document.createTextNode(' '));
          const w = document.createElement('span');
          w.className = 'sn-w';
          const s = document.createElement('span');
          s.style.setProperty('--wi', String(i++));
          s.textContent = p;
          w.appendChild(s);
          frag.appendChild(w);
        });
        n.parentNode!.replaceChild(frag, n);
      } else if (n.nodeType === 1 && !(n as El).classList.contains('sn-w')) walk(n);
    });
  })(el);
}

let io: IntersectionObserver | null = null;
function reveal(scope: ParentNode) {
  if (!io && 'IntersectionObserver' in window)
    io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('is-in'), io!.unobserve(e.target))),
      { rootMargin: '0px 0px -7% 0px', threshold: 0.06 },
    );
  $$('[data-sn-split]', scope).forEach(split);
  const els = $$('[data-r]:not(.is-in), [data-sn-split]:not(.is-in), .sn-sheen:not(.is-in)', scope);
  if (!io || !motion()) return els.forEach((e) => e.classList.add('is-in'));
  els.forEach((e) => io!.observe(e));
}

/* ---------------- rails (horizontal sliders) ---------------- */
function rail(scope: ParentNode) {
  $$('[data-sn-rail]:not([data-sn-rail-on])', scope).forEach((r) => {
    r.setAttribute('data-sn-rail-on', '');
    const wrap = (r.closest('[data-sn-railwrap]') as El) || (r.parentNode as El);
    const bar = $('[data-sn-prog]', wrap);
    const step = () => {
      const c = r.firstElementChild;
      return c ? c.getBoundingClientRect().width + (parseFloat(getComputedStyle(r).columnGap) || 20) : 300;
    };
    const prog = () => {
      if (!bar) return;
      const max = r.scrollWidth - r.clientWidth;
      const w = Math.max(10, (r.clientWidth / Math.max(r.scrollWidth, 1)) * 100);
      bar.style.width = w + '%';
      bar.style.left = (max > 0 ? (r.scrollLeft / max) * (100 - w) : 0) + '%';
    };
    r.addEventListener('scroll', prog, { passive: true });
    window.addEventListener('resize', prog);
    setTimeout(prog, 200);
    $$('[data-sn-prev]', wrap).forEach((b) => b.addEventListener('click', () => r.scrollBy({ left: -step(), behavior: 'smooth' })));
    $$('[data-sn-next]', wrap).forEach((b) => b.addEventListener('click', () => r.scrollBy({ left: step(), behavior: 'smooth' })));
    let down = false, x0 = 0, s0 = 0, moved = false;
    r.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button) return;
      down = true; moved = false; x0 = e.clientX; s0 = r.scrollLeft;
    });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - x0;
      if (Math.abs(dx) > 6) { moved = true; r.classList.add('is-drag'); }
      if (moved) r.scrollLeft = s0 - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!down) return;
      down = false;
      setTimeout(() => r.classList.remove('is-drag'), 30);
    });
    r.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    const auto = parseFloat(r.getAttribute('data-sn-auto') || '') || 0;
    if (auto > 0 && motion()) {
      let hov = false;
      r.addEventListener('mouseenter', () => (hov = true));
      r.addEventListener('mouseleave', () => (hov = false));
      const t = setInterval(() => {
        if (!r.isConnected) return clearInterval(t);
        if (hov || down || document.hidden) return;
        const max = r.scrollWidth - r.clientWidth - 4;
        if (r.scrollLeft >= max) r.scrollTo({ left: 0, behavior: 'smooth' });
        else r.scrollBy({ left: step(), behavior: 'smooth' });
      }, auto * 1e3);
    }
  });
}

/* ---------------- tabs ---------------- */
function pill(tabs: El) {
  const p = $('.sn-tabs__pill', tabs), on = $('.is-on', tabs);
  if (!p || !on) return;
  p.style.left = on.offsetLeft + 'px';
  p.style.width = on.offsetWidth + 'px';
}
function tabs(scope: ParentNode) {
  $$('[data-sn-tabs]:not([data-sn-tabs-on])', scope).forEach((t) => {
    t.setAttribute('data-sn-tabs-on', '');
    const host = (t.closest('[data-sn-tabhost]') as El) || (t.parentNode as El);
    const btns = $$('button[data-tab]', t);
    btns.forEach((b) =>
      b.addEventListener('click', () => {
        btns.forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-selected', String(x === b)); });
        $$('[data-panel]', host).forEach((p) => {
          const on = p.getAttribute('data-panel') === b.getAttribute('data-tab');
          p.hidden = !on;
          if (on) {
            p.classList.remove('is-in');
            reveal(p);
            requestAnimationFrame(() => $$('[data-r]', p).forEach((x) => x.classList.add('is-in')));
          }
        });
        pill(t);
        t.dispatchEvent(new CustomEvent('sn:tab', { bubbles: true, detail: b.getAttribute('data-tab') }));
      }),
    );
    pill(t);
    window.addEventListener('resize', () => pill(t));
    setTimeout(() => pill(t), 400);
  });
}

/* ---------------- overlays ---------------- */
let openOv: El | null = null, lastFocus: El | null = null;
export function open(id: string | El) {
  const ov = typeof id === 'string' ? document.getElementById(id) : id;
  if (!ov) return;
  if (openOv && openOv !== ov) close(openOv, true);
  lastFocus = document.activeElement as El;
  ov.hidden = false;
  ov.removeAttribute('hidden');
  requestAnimationFrame(() => ov.classList.add('is-open'));
  document.documentElement.classList.add('sn-lock');
  openOv = ov;
  const f = ov.querySelector<El>('[autofocus], input:not([type=hidden]), button, a[href]');
  setTimeout(() => f?.focus({ preventScroll: true }), 350);
  ov.dispatchEvent(new CustomEvent('sn:open', { bubbles: true }));
}
export function close(ov?: El | null, keep?: boolean) {
  ov = ov || openOv;
  if (!ov) return;
  ov.classList.remove('is-open');
  if (!keep) document.documentElement.classList.remove('sn-lock');
  if (openOv === ov) openOv = null;
  if (lastFocus?.focus && !keep) lastFocus.focus({ preventScroll: true });
}

/* ---------------- toast ---------------- */
let toastEl: El | null = null, toastT: ReturnType<typeof setTimeout> | undefined;
export function toast(msg: string, icon = 'check') {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'sn-toast';
    toastEl.setAttribute('role', 'status');
    document.body.appendChild(toastEl);
  }
  toastEl.innerHTML = `<i>${icons[icon] || ''}</i><span>${esc(msg)}</span>`;
  requestAnimationFrame(() => toastEl!.classList.add('is-on'));
  clearTimeout(toastT);
  toastT = setTimeout(() => toastEl!.classList.remove('is-on'), 2600);
}

/* ---------------- wishlist + recently viewed (localStorage) ---------------- */
const WK = 'sakooon:wish';
const readLS = (k: string): string[] => { try { return JSON.parse(localStorage.getItem(k) || '[]') || []; } catch { return []; } };
export const wish = {
  get: () => readLS(WK),
  set(a: string[]) {
    try { localStorage.setItem(WK, JSON.stringify(a)); } catch {}
    wish.paint();
    document.dispatchEvent(new CustomEvent('sn:wish'));
  },
  has: (h: string) => wish.get().includes(h),
  toggle(h: string) {
    const a = wish.get(), i = a.indexOf(h);
    if (i > -1) a.splice(i, 1); else a.unshift(h);
    wish.set(a.slice(0, 60));
    return i < 0;
  },
  paint() {
    const a = wish.get();
    $$('[data-sn-wish]').forEach((b) => {
      const on = a.includes(b.getAttribute('data-sn-wish')!);
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    $$('[data-sn-wish-count]').forEach((el) => { el.textContent = String(a.length); el.classList.toggle('is-empty', !a.length); });
  },
};


/* ---------------- product JSON (Shopify product.js shape) ---------------- */
const pcache: Record<string, Promise<any>> = {};
export function product(h: string) {
  return (pcache[h] ||= fetch(`/api/products/${encodeURIComponent(h)}`).then((r) => { if (!r.ok) throw r; return r.json(); }));
}
const money = (c: number) => fmtMoney(c);

/* ---------------- quick view ---------------- */
function quick(handle: string) {
  const ov = document.getElementById('SnQuick');
  if (!ov) { window.location.href = `/products/${handle}`; return; }
  const box = $('[data-sn-quick-body]', ov)!;
  box.innerHTML = '<div class="snq__load"><span></span></div>';
  open(ov);
  product(handle)
    .then((p) => {
      const opts = p.options || [];
      const sel: string[] = (p.variants.find((v: any) => v.available) || p.variants[0]).options.slice();
      const imgs: string[] = (p.images || []).slice(0, 6);
      const variant = () => p.variants.find((v: any) => v.options.every((o: string, i: number) => o === sel[i]));
      let html =
        `<div class="snq__gal"><div class="snq__main sn-media">${imgs[0] ? `<img src="${imgUrl(imgs[0], 900)}" alt="" data-snq-img>` : ''}</div>` +
        (imgs.length > 1
          ? `<div class="snq__thumbs">${imgs.map((s, i) => `<button type="button" class="${i ? '' : 'is-on'}" data-snq-th="${imgUrl(s, 900)}"><img src="${imgUrl(s, 160)}" alt=""></button>`).join('')}</div>`
          : '') +
        `</div><div class="snq__info"><p class="sn-eyebrow">${esc(p.vendor || '')}</p><h2 class="sn-h sn-h--m">${esc(p.title)}</h2><div class="sn-price snq__price" data-snq-price></div>`;
      if (!(opts.length === 1 && p.variants.length === 1))
        opts.forEach((o: any, i: number) => {
          html += `<div class="snq__opt"><p>${esc(o.name)}: <b data-snq-optv="${i}">${esc(sel[i])}</b></p><div>${o.values
            .map((v: string) => `<button type="button" class="sn-chip${v === sel[i] ? ' is-on' : ''}" data-snq-o="${i}" data-v="${esc(v)}">${esc(v)}</button>`)
            .join('')}</div></div>`;
        });
      html += `<div class="snq__buy"><div class="sn-qty"><button type="button" data-snq-q="-1" aria-label="-">${icons.minus}</button><input type="number" value="1" min="1" data-snq-qty aria-label="Quantity"><button type="button" data-snq-q="1" aria-label="+">${icons.plus}</button></div><button type="button" class="sn-btn sn-btn--gold" data-snq-add><span>Add to cart</span></button></div><a class="sn-link" href="${p.url}">View full details${icons.arrow}</a></div>`;
      box.innerHTML = html;
      const paint = () => {
        const v = variant(), pr = $('[data-snq-price]', box)!, add = $<HTMLButtonElement>('[data-snq-add]', box)!;
        if (!v) { add.disabled = true; $('span', add)!.textContent = 'Unavailable'; return; }
        const sale = v.compare_at_price > v.price;
        pr.innerHTML = `<span class="sn-price__now${sale ? ' is-sale' : ''}">${money(v.price)}</span>${sale ? `<s class="sn-price__was">${money(v.compare_at_price)}</s>` : ''}`;
        add.disabled = !v.available;
        $('span', add)!.textContent = v.available ? 'Add to cart' : 'Sold out';
        if (v.featured_image) { const im = $<HTMLImageElement>('[data-snq-img]', box); if (im) im.src = imgUrl(v.featured_image.src, 900); }
      };
      paint();
      box.onclick = (e) => {
        const t = e.target as El;
        const o = t.closest('[data-snq-o]');
        if (o) {
          const i = +o.getAttribute('data-snq-o')!;
          sel[i] = o.getAttribute('data-v')!;
          $$(`[data-snq-o="${i}"]`, box).forEach((b) => b.classList.toggle('is-on', b === o));
          const lb = $(`[data-snq-optv="${i}"]`, box);
          if (lb) lb.textContent = sel[i];
          paint();
        }
        const th = t.closest('[data-snq-th]');
        if (th) {
          $<HTMLImageElement>('[data-snq-img]', box)!.src = th.getAttribute('data-snq-th')!;
          $$('[data-snq-th]', box).forEach((b) => b.classList.toggle('is-on', b === th));
        }
        const qq = t.closest('[data-snq-q]');
        if (qq) {
          const inp = $<HTMLInputElement>('[data-snq-qty]', box)!;
          inp.value = String(Math.max(1, (+inp.value || 1) + +qq.getAttribute('data-snq-q')!));
        }
        const ad = t.closest('[data-snq-add]');
        if (ad) {
          const v = variant();
          if (!v) return;
          ad.classList.add('is-busy');
          window.SN.cart
            .add([{ id: v.id, quantity: +$<HTMLInputElement>('[data-snq-qty]', box)!.value || 1 }])
            .catch(() => {})
            .then(() => ad.classList.remove('is-busy'));
        }
      };
    })
    .catch(() => { window.location.href = `/products/${handle}`; });
}

/* ---------------- predictive search ---------------- */
function search(scope: ParentNode | null) {
  if (!scope) return;
  $$('[data-sn-psearch]:not([data-on])', scope).forEach((wrap) => {
    wrap.setAttribute('data-on', '');
    const input = $<HTMLInputElement>('input[type="search"], input[name="q"]', wrap), out = $('[data-sn-presults]', wrap);
    if (!input || !out) return;
    let t: ReturnType<typeof setTimeout> | undefined, ctrl: AbortController | null = null;
    input.addEventListener('input', () => {
      const q = input.value.trim();
      clearTimeout(t);
      wrap.classList.toggle('has-q', !!q);
      if (q.length < 2) { out.innerHTML = ''; return; }
      t = setTimeout(() => {
        ctrl?.abort();
        ctrl = new AbortController();
        wrap.classList.add('is-loading');
        fetch(`/api/search/suggest?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
          .then((r) => r.json())
          .then((d) => {
            wrap.classList.remove('is-loading');
            const P = d.products || [], C = d.collections || [], A = (d.articles || []).concat(d.pages || []);
            if (!P.length && !C.length && !A.length) {
              out.innerHTML = `<p class="snps__none">Nothing found for “${esc(q)}”</p>`;
              return;
            }
            let h = '';
            if (P.length)
              h += `<div class="snps__col snps__col--p"><p class="sn-eyebrow">Products</p><ul>${P.map(
                (p: any, i: number) =>
                  `<li style="--i:${i}"><a href="${p.url}"><span class="snps__img">${p.image ? `<img src="${imgUrl(p.image, 160)}" alt="">` : ''}</span><span><b>${esc(p.title)}</b><small>${money(Math.round(parseFloat(p.price) * 100))}</small></span></a></li>`,
              ).join('')}</ul></div>`;
            if (C.length || A.length)
              h += `<div class="snps__col"><p class="sn-eyebrow">Suggestions</p><ul>${C.concat(A)
                .map((c: any, i: number) => `<li style="--i:${i}"><a class="snps__txt" href="${c.url}">${esc(c.title)}</a></li>`)
                .join('')}</ul></div>`;
            h += `<a class="sn-link snps__all" href="/search?q=${encodeURIComponent(q)}">View all results${icons.arrow}</a>`;
            out.innerHTML = h;
          })
          .catch(() => wrap.classList.remove('is-loading'));
      }, 220);
    });
  });
}


/* ---------------- feathers (light 2D canvas particles) ---------------- */
function feathers(scope: ParentNode) {
  if (!motion() || document.body.getAttribute('data-feathers') === 'off') return;
  $$('[data-sn-feathers]:not([data-on])', scope).forEach((host) => {
    host.setAttribute('data-on', '');
    const cv = document.createElement('canvas');
    cv.className = 'sn-feathers';
    host.appendChild(cv);
    const ctx = cv.getContext('2d')!;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const col = host.getAttribute('data-color') || 'rgba(255,255,255,.75)';
    const n = parseInt(host.getAttribute('data-sn-feathers')!, 10) || 26;
    let W = 0, H = 0, vis = false, raf: number | null = null;
    const size = () => {
      W = host.clientWidth; H = host.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const mk = (y?: number) => ({ x: Math.random() * W, y: y ?? Math.random() * H, r: 1 + Math.random() * 2.6, s: 0.15 + Math.random() * 0.45, a: Math.random() * 6.28, w: 0.4 + Math.random() * 0.8, o: 0.25 + Math.random() * 0.6, f: Math.random() < 0.25 });
    size();
    const parts = Array.from({ length: n }, () => mk());
    window.addEventListener('resize', size);
    const loop = () => {
      if (raf) return;
      const f = () => {
        raf = null;
        if (!vis || document.hidden || !host.isConnected) return;
        ctx.clearRect(0, 0, W, H);
        parts.forEach((p, i) => {
          p.y -= p.s; p.a += 0.012 * p.w; p.x += Math.sin(p.a) * 0.35;
          if (p.y < -10) parts[i] = mk(H + 10);
          ctx.globalAlpha = p.o * (0.6 + 0.4 * Math.sin(p.a * 2));
          ctx.fillStyle = col;
          ctx.beginPath();
          if (p.f) ctx.ellipse(p.x, p.y, p.r * 2.6, p.r * 0.9, p.a, 0, 6.283); else ctx.arc(p.x, p.y, p.r, 0, 6.283);
          ctx.fill();
        });
        raf = requestAnimationFrame(f);
      };
      f();
    };
    whenIdle(() => new IntersectionObserver((es) => { vis = es[0].isIntersecting; if (vis) loop(); }).observe(host));
    document.addEventListener('visibilitychange', () => !document.hidden && loop());
  });
}

/* ---------------- back-to-top moon ---------------- */
function moon() {
  const m = $('[data-sn-moon]');
  if (!m || m.dataset.on) return;
  m.dataset.on = '1';
  const shadow = $('[data-sn-moon-shadow]', m), ring = $<SVGCircleElement>('.sn-moon-top__ring circle', m);
  let ticking = false;
  const upd = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight, p = max > 0 ? scrollY / max : 0;
    m.classList.toggle('is-on', scrollY > innerHeight * 0.6);
    shadow?.setAttribute('cx', (12 - p * 17).toFixed(2));
    ring?.style.setProperty('--off', (100 - p * 100).toFixed(1));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
  upd();
  m.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce() ? 'auto' : 'smooth' }));
}

export function boot(scope: ParentNode = document) {
  reveal(scope);
  rail(scope);
  tabs(scope);
  search(scope);
  feathers(scope);
  wish.paint();
  moon();
}

/* ---------------- one-time global listeners ---------------- */
export function install() {
  if (window.SN?._core) return;
  const SN = (window.SN = window.SN || {});
  Object.assign(SN, { $, $$, money, esc, img: imgUrl, reveal, rail, tabs, pill, open, close, toast, icons, wish, recent, product, quick, search, feathers, boot, t: {} });
  SN.cart ||= {
    add: () => Promise.reject(new Error('cart not ready')),
    change: () => Promise.reject(new Error('cart not ready')),
    count: () => {},
    open: () => open('SnCart'),
  } satisfies SNCart;

  // capture phase so these win over next/link navigation
  document.addEventListener(
    'click',
    (e) => {
      const t = e.target as El;
      if (!t.closest) return;
      const o = t.closest('[data-sn-open]');
      // only when the overlay exists (the cart drawer mounts when idle); otherwise the link navigates
      if (o && document.getElementById(o.getAttribute('data-sn-open')!)) { e.preventDefault(); open(o.getAttribute('data-sn-open')!); return; }
      const c = t.closest('[data-sn-close]');
      if (c) { e.preventDefault(); close(c.closest('.sn-ov') as El); return; }
      const a = t.closest('[data-sn-add]');
      if (a) {
        e.preventDefault();
        a.classList.add('is-busy');
        SN.cart.add([{ id: a.getAttribute('data-sn-add'), quantity: parseInt(a.getAttribute('data-qty') || '1', 10) }]).catch(() => {}).then(() => a.classList.remove('is-busy'));
        return;
      }
      const w = t.closest('[data-sn-wish]');
      if (w) {
        e.preventDefault();
        const on = wish.toggle(w.getAttribute('data-sn-wish')!);
        w.animate?.([{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 450, easing: 'cubic-bezier(.3,1.5,.5,1)' });
        toast(on ? 'Saved to your wishlist' : 'Removed from wishlist', 'heart');
        return;
      }
      const q = t.closest('[data-sn-quick]');
      if (q) { e.preventDefault(); quick(q.getAttribute('data-sn-quick')!); }
    },
    true,
  );
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && openOv) close(); });
  // close overlays when navigating away
  document.addEventListener('click', (e) => {
    const a = (e.target as El).closest?.('a[href^="/"]');
    if (a && openOv && !e.defaultPrevented) close();
  });

  document.addEventListener('pointermove', (e) => {
    const m = (e.target as El).closest?.('.sn-card__media') as El | null;
    if (!m) return;
    const r = m.getBoundingClientRect();
    m.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
    m.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
  }, { passive: true });
  document.addEventListener('mouseover', (e) => {
    const d = (e.target as El).closest?.('.sn-sw__dot[data-img]');
    if (!d) return;
    const card = d.closest('.sn-card'), im = card && $<HTMLImageElement>('.sn-card__media img:not(.sn-card__b)', card);
    if (!im) return;
    if (!im.dataset.o) { im.dataset.o = im.currentSrc || im.src; im.dataset.ss = im.getAttribute('srcset') || ''; }
    im.removeAttribute('srcset');
    im.src = d.getAttribute('data-img')!;
    $$('.sn-sw__dot', card!).forEach((x) => x.classList.toggle('is-on', x === d));
  });
  document.addEventListener('mouseout', (e) => {
    const sw = (e.target as El).closest?.('.sn-sw');
    if (!sw || sw.contains(e.relatedTarget as Node)) return;
    const card = sw.closest('.sn-card'), im = card && $<HTMLImageElement>('.sn-card__media img:not(.sn-card__b)', card);
    if (im?.dataset.o) { im.src = im.dataset.o; if (im.dataset.ss) im.setAttribute('srcset', im.dataset.ss); }
    $$('.sn-sw__dot', sw).forEach((x) => x.classList.remove('is-on'));
  });
  SN._core = 1;
  (SN._q || []).splice(0).forEach((f: () => void) => { try { f(); } catch (err) { console.error(err); } });
}
