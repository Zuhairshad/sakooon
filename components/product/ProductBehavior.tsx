'use client';

import { useAfterPaint } from '@/components/theme/useAfterPaint';
import { img, money } from '@/lib/utils';
import { recent } from '@/lib/theme/lite';

/* eslint-disable @typescript-eslint/no-explicit-any */
type V = {
  id: number;
  title: string;
  options: string[];
  available: boolean;
  price: number;
  compare_at_price: number | null;
  featured_media: { id: string } | null;
  featured_image: { src: string } | null;
};
type P = { title: string; handle: string; variants: V[] };

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));

/** Port of the theme's sn-product.js controller, bound to one [data-sn-product] root. */
class ProductController {
  p: P;
  inv: Record<string, number> = {};
  sel: string[];
  idInput: HTMLInputElement | null;
  form: HTMLFormElement | null;
  history: boolean;
  offs: (() => void)[] = [];

  constructor(public root: HTMLElement) {
    this.p = JSON.parse($('[data-sn-pjson]', root)!.textContent || '{}');
    try { this.inv = JSON.parse($('[data-sn-pinv]', root)?.textContent || '{}'); } catch {}
    this.form = $('form[data-sn-pform]', root);
    this.idInput = $('[data-sn-pvid]', root);
    // ?variant= preselect (kept client-side so the page stays static)
    const q = Number(new URLSearchParams(location.search).get('variant'));
    if (q && this.idInput && this.p.variants.some((v) => v.id === q)) this.idInput.value = String(q);
    this.sel = (this.current() || this.p.variants[0]).options.slice();
    this.history = root.hasAttribute('data-history');
    this.bind();
    this.paint(!q);
    (root as any).snProduct = this;
  }

  current() {
    const id = this.idInput ? parseInt(this.idInput.value, 10) : 0;
    return this.p.variants.find((v) => v.id === id);
  }
  variant() {
    return this.p.variants.find((v) => v.options.every((o, i) => o === this.sel[i]));
  }
  on(t: EventTarget, ev: string, fn: (e: any) => void, o?: AddEventListenerOptions) {
    t.addEventListener(ev, fn, o);
    this.offs.push(() => t.removeEventListener(ev, fn, o));
  }

  bind() {
    const root = this.root;
    this.on(root, 'change', (e) => {
      const t = e.target as HTMLInputElement;
      if (t.matches('[data-sn-opt-i]')) { this.sel[+t.getAttribute('data-sn-opt-i')!] = t.value; this.paint(); }
      else if (t.matches('select[data-sn-opt-sel]')) { this.sel[+t.getAttribute('data-sn-opt-sel')!] = t.value; this.paint(); }
    });
    this.on(root, 'click', (e) => {
      const q = (e.target as HTMLElement).closest('[data-sn-q]');
      if (q && root.contains(q)) {
        e.preventDefault();
        const inp = $<HTMLInputElement>('[data-sn-pqty]', root);
        if (inp) {
          inp.value = String(Math.max(1, (parseInt(inp.value, 10) || 1) + parseInt(q.getAttribute('data-sn-q')!, 10)));
          inp.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      const th = (e.target as HTMLElement).closest('[data-sn-thumb]');
      if (th && root.contains(th)) { e.preventDefault(); this.showMedia(th.getAttribute('data-sn-thumb')!, true); }
    });
    if (this.form) this.on(this.form, 'submit', (e) => { e.preventDefault(); this.add(); });

    const g = $('[data-sn-gallery]', root);
    if (!g) return;
    const track = $('[data-sn-track]', g);
    if (track) {
      let tk = false;
      this.on(track, 'scroll', () => {
        if (tk) return;
        tk = true;
        requestAnimationFrame(() => {
          tk = false;
          const slides = $$('[data-sn-slide]', track);
          const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
          const sl = slides[i];
          if (sl) this.markThumb(sl.getAttribute('data-sn-slide')!);
          const bar = $('[data-sn-gprog]', g);
          if (bar) { bar.style.width = 100 / slides.length + '%'; bar.style.left = (i / slides.length) * 100 + '%'; }
        });
      }, { passive: true });
    }
    $$('[data-sn-gnav]', g).forEach((b) =>
      this.on(b, 'click', () => {
        const tr = $('[data-sn-track]', g)!;
        tr.scrollBy({ left: tr.clientWidth * parseInt(b.getAttribute('data-sn-gnav')!, 10), behavior: 'smooth' });
      }),
    );
  }

  markThumb(id: string) {
    $$('[data-sn-thumb]', this.root).forEach((t) => {
      const on = t.getAttribute('data-sn-thumb') === String(id);
      t.classList.toggle('is-on', on);
      if (on) {
        const p = t.parentElement!;
        p.scrollTo?.({ left: t.offsetLeft - p.clientWidth / 2 + t.offsetWidth / 2, top: t.offsetTop - p.clientHeight / 2 + t.offsetHeight / 2, behavior: 'smooth' });
      }
    });
  }

  showMedia(id: string, user = false) {
    const sl = $(`[data-sn-slide="${id}"]`, this.root);
    if (!sl) return;
    const track = sl.closest<HTMLElement>('[data-sn-track]');
    const stacked = track && getComputedStyle(track).overflowX === 'visible';
    if (track && !stacked) track.scrollTo({ left: sl.offsetLeft - track.offsetLeft, behavior: user ? 'smooth' : 'auto' });
    else if (user) sl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    $$('[data-sn-slide]', this.root).forEach((s) => s.classList.toggle('is-on', s === sl));
    this.markThumb(id);
  }

  avail(idx: number, value: string) {
    const sel = this.sel.slice();
    sel[idx] = value;
    let exists = false, ok = false;
    this.p.variants.forEach((v) => {
      if (v.options.every((o, i) => (i > idx ? true : o === sel[i]))) { exists = true; if (v.available) ok = true; }
    });
    return exists ? (ok ? 1 : 0) : -1;
  }

  paint(first = false) {
    const root = this.root, v = this.variant();
    $$<HTMLInputElement>('[data-sn-opt-i]', root).forEach((inp) => {
      const i = +inp.getAttribute('data-sn-opt-i')!, st = this.avail(i, inp.value);
      inp.checked = this.sel[i] === inp.value;
      const lab = inp.closest('label') || inp.nextElementSibling;
      lab?.classList.toggle('is-out', st === 0);
      lab?.classList.toggle('is-none', st === -1);
    });
    $$<HTMLSelectElement>('select[data-sn-opt-sel]', root).forEach((s) => (s.value = this.sel[+s.getAttribute('data-sn-opt-sel')!]));
    $$('[data-sn-optv]', root).forEach((el) => (el.textContent = this.sel[+el.getAttribute('data-sn-optv')!] || ''));
    const atc = $$<HTMLButtonElement>('[data-sn-patc]', root), price = $$('[data-sn-pprice]', root), stock = $('[data-sn-pstock]', root);
    if (!v) {
      atc.forEach((b) => { b.disabled = true; const s = $('span', b); if (s) s.textContent = 'Unavailable'; });
      if (stock) stock.hidden = true;
      return;
    }
    if (this.idInput) this.idInput.value = String(v.id);
    const sale = !!v.compare_at_price && v.compare_at_price > v.price;
    price.forEach((p) => {
      const pct = sale ? Math.round(((v.compare_at_price! - v.price) * 100) / v.compare_at_price!) : 0;
      const inner = `<span class="sn-price__now${sale ? ' is-sale' : ''}">${money(v.price)}</span>${sale ? `<s class="sn-price__was">${money(v.compare_at_price)}</s>` : ''}`;
      // the sticky bar wraps prices in .sn-price and has no badge
      const wrapped = p.querySelector(':scope > .sn-price');
      if (wrapped) wrapped.innerHTML = inner;
      else p.innerHTML = inner + (sale ? `<span class="sn-badge sn-badge--sale">−${pct}%</span>` : '');
      if (!first) { p.classList.remove('is-tick'); void p.offsetWidth; p.classList.add('is-tick'); }
    });
    atc.forEach((b) => {
      b.disabled = !v.available;
      const s = $('span', b);
      if (s) s.textContent = v.available ? b.getAttribute('data-label') || 'Add to cart' : b.getAttribute('data-sold') || 'Sold out';
    });
    $$('[data-sn-buynow]', root).forEach((b) => (b.hidden = !v.available));
    if (stock) {
      const q = this.inv[v.id], low = parseInt(stock.getAttribute('data-low') || '5', 10);
      stock.hidden = false;
      stock.classList.remove('is-low', 'is-out');
      let txt = stock.getAttribute('data-in')!;
      if (!v.available) { txt = stock.getAttribute('data-out')!; stock.classList.add('is-out'); }
      else if (typeof q === 'number' && q > 0 && q <= low) { txt = stock.getAttribute('data-lowtxt')!.replace('[n]', String(q)); stock.classList.add('is-low'); }
      $('[data-sn-pstock-t]', stock)!.textContent = txt;
      const bar = $('[data-sn-pstock-b]', stock);
      if (bar) bar.style.width = (v.available ? (typeof q === 'number' && q > 0 ? Math.min(100, (q / (low * 3)) * 100) : 100) : 0) + '%';
    }
    const simg = $<HTMLImageElement>('.snmp__simg img', root);
    if (simg && v.featured_image) simg.src = img(v.featured_image.src, 120);
    if (v.featured_media) this.showMedia(v.featured_media.id);
    if (!first && this.history) {
      const u = new URL(location.href);
      u.searchParams.set('variant', String(v.id));
      history.replaceState(history.state, '', u.toString());
    }
    root.dispatchEvent(new CustomEvent('sn:variant', { bubbles: true, detail: v }));
  }

  items() {
    const v = this.variant();
    if (!v || !v.available) return null;
    const qty = $<HTMLInputElement>('[data-sn-pqty]', this.root);
    const props: Record<string, string> = {};
    $$<HTMLInputElement>('[name^="properties["]', this.root).forEach((i) => {
      if ((i.type === 'checkbox' || i.type === 'radio') && !i.checked) return;
      if (i.value) props[i.name.slice(11, -1)] = i.value;
    });
    return [{ id: v.id, quantity: qty ? Math.max(1, parseInt(qty.value, 10) || 1) : 1, ...(Object.keys(props).length ? { properties: props } : {}) }];
  }

  add() {
    const items = this.items();
    if (!items) return;
    const btns = $$('[data-sn-patc]', this.root);
    btns.forEach((b) => b.classList.add('is-busy'));
    const fly = $<HTMLImageElement>('[data-sn-slide].is-on img, [data-sn-slide] img', this.root);
    window.SN.cart
      .add(items)
      .then(() => fly && ProductController.fly(fly))
      .catch(() => {})
      .then(() => btns.forEach((b) => b.classList.remove('is-busy')));
  }

  buyNow(btn: HTMLElement) {
    const items = this.items();
    if (!items) return;
    btn.classList.add('is-busy');
    window.SN.cart
      .add(items, false)
      .then((cart: { checkoutUrl?: string } | null) => { if (cart?.checkoutUrl) window.location.href = cart.checkoutUrl; })
      .catch(() => btn.classList.remove('is-busy'));
  }

  static fly(img: HTMLImageElement) {
    if (document.body.getAttribute('data-motion') === 'off') return;
    const to = $('[data-sn-cart-icon]') || $('[data-sn-cart-count]');
    if (!to) return;
    const a = img.getBoundingClientRect(), b = to.getBoundingClientRect();
    if (!a.width) return;
    const c = img.cloneNode() as HTMLImageElement;
    c.removeAttribute('srcset');
    c.style.cssText = `position:fixed;z-index:2147483600;left:${a.left}px;top:${a.top}px;width:${a.width}px;height:${a.height}px;object-fit:cover;border-radius:24px;pointer-events:none;box-shadow:0 30px 60px -20px rgba(0,0,0,.5)`;
    document.body.appendChild(c);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    c.animate(
      [
        { transform: 'none', opacity: 1, borderRadius: '24px' },
        { transform: `translate(${dx * 0.5}px,${dy * 0.5 - 80}px) scale(.45) rotate(-8deg)`, opacity: 0.9, borderRadius: '50%' },
        { transform: `translate(${dx}px,${dy}px) scale(.05)`, opacity: 0, borderRadius: '50%' },
      ],
      { duration: 900, easing: 'cubic-bezier(.5,0,.2,1)' },
    ).onfinish = () => c.remove();
  }

  destroy() { this.offs.forEach((f) => f()); }
}

/** Product section behaviour: controller + delivery estimate, sticky bar, lightbox, share, buy now. */
export default function ProductBehavior({ rootId }: { rootId: string }) {
  useAfterPaint(() => {
    const r = document.getElementById(rootId);
    const pr = r && $('[data-sn-product]', r);
    if (!r || !pr) return;
    const ctl = new ProductController(pr);
    const offs: (() => void)[] = [() => ctl.destroy()];
    const on = (t: EventTarget, ev: string, fn: (e: any) => void, o?: AddEventListenerOptions | boolean) => {
      t.addEventListener(ev, fn, o);
      offs.push(() => t.removeEventListener(ev, fn, o));
    };
    recent.push(ctl.p.handle);

    /* delivery estimate */
    const del = $('[data-snmp-del]', r);
    let tickT: ReturnType<typeof setTimeout> | undefined;
    if (del) {
      const cutH = +del.getAttribute('data-cut')!;
      const addDays = (n: number) => {
        const dt = new Date();
        let c = 0;
        if (dt.getHours() >= cutH) n++;
        while (c < n) { dt.setDate(dt.getDate() + 1); if (del.getAttribute('data-sun') === 'true' && dt.getDay() === 0) continue; c++; }
        return dt;
      };
      const f = (dt: Date) => dt.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
      $('[data-snmp-dates]', del)!.textContent = `${f(addDays(+del.getAttribute('data-min')!))} – ${f(addDays(+del.getAttribute('data-max')!))}`;
      const cut = $('[data-snmp-cut]', del)!, tpl = cut.getAttribute('data-tpl');
      const tick = () => {
        const end = new Date();
        end.setHours(cutH, 0, 0, 0);
        const ms = +end - Date.now();
        if (ms <= 0 || !tpl) { cut.textContent = ''; return; }
        cut.textContent = tpl.replace('[time]', `${Math.floor(ms / 36e5)}h ${Math.floor((ms % 36e5) / 6e4)}m`);
        tickT = setTimeout(tick, 30000);
      };
      tick();
      offs.push(() => clearTimeout(tickT));
    }

    /* WhatsApp link follows the variant */
    const wa = $<HTMLAnchorElement>('[data-snmp-wa]', r);
    on(r, 'sn:variant', (e: CustomEvent<V>) => {
      if (!wa) return;
      const u = new URL(wa.href);
      u.searchParams.set('text', `${wa.getAttribute('data-base')} ${wa.getAttribute('data-title')} (${e.detail.title}) – ${location.origin}/products/${wa.getAttribute('data-handle')}?variant=${e.detail.id}`);
      wa.href = u.toString();
    });

    /* copy / share link */
    const cp = $('[data-snmp-copy]', r);
    if (cp)
      on(cp, 'click', () => {
        const link = location.origin + cp.getAttribute('data-snmp-copy');
        if (navigator.share) navigator.share({ url: link }).catch(() => {});
        else navigator.clipboard?.writeText(link).then(() => window.SN?.toast?.('Link copied'));
      });

    /* buy it now → straight to Shopify checkout */
    const bn = $('[data-snmp-buynow]', r);
    if (bn) on(bn, 'click', (e) => { e.preventDefault(); ctl.buyNow(bn); });

    /* sticky add-to-cart bar: shows once the inline buy box scrolls out of view (mobile only, via CSS) */
    const st = $('[data-snmp-sticky]', r), buy = $('[data-snmp-buy]', r);
    if (st && buy) {
      const sadd = $('[data-snmp-sadd]', st);
      let outOfView = false;
      const apply = () => {
        // Hide while any overlay (e.g. the cart drawer) is open, same signal
        // the theme runtime uses for its own open/close state.
        const locked = document.documentElement.classList.contains('sn-lock');
        const show = outOfView && !locked;
        st.classList.toggle('is-on', show);
        st.setAttribute('aria-hidden', String(!show));
        if (sadd) sadd.tabIndex = show ? 0 : -1;
        document.body.classList.toggle('snmp-sticky-pad', show);
      };
      const io = new IntersectionObserver((es) => {
        const b = es[0];
        outOfView = !b.isIntersecting && b.boundingClientRect.top < 0;
        apply();
      });
      io.observe(buy);
      const lockObserver = new MutationObserver(apply);
      lockObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      offs.push(() => {
        io.disconnect();
        lockObserver.disconnect();
        document.body.classList.remove('snmp-sticky-pad');
      });
      if (sadd) on(sadd, 'click', () => ctl.add());
    }

    /* lightbox */
    const lb = $('[data-snmp-lb]', r), lbt = lb && $('[data-snmp-lbt]', lb);
    if (lb && lbt) {
      const close = () => { lb.classList.remove('is-open'); document.documentElement.classList.remove('sn-lock'); setTimeout(() => (lb.hidden = true), 500); };
      on(r, 'click', (e) => {
        const z = (e.target as HTMLElement).closest('[data-snmp-zoom]');
        if (!z) return;
        $$<HTMLImageElement>('img[data-src]', lb).forEach((im) => { if (!im.getAttribute('src')) im.src = im.getAttribute('data-src')!; });
        const ii = $$('[data-snmp-zoom]', r).indexOf(z as HTMLElement);
        lb.hidden = false;
        document.documentElement.classList.add('sn-lock');
        requestAnimationFrame(() => { lb.classList.add('is-open'); lbt.scrollLeft = lbt.clientWidth * ii; });
      });
      const x = $('[data-snmp-lbx]', lb);
      if (x) on(x, 'click', close);
      const lbGo = (d: number) => {
        const n = lbt.children.length;
        if (!n) return;
        const cur = Math.round(lbt.scrollLeft / lbt.clientWidth), nx = (cur + d + n) % n;
        $$('.snmp__lbf.is-z', lbt).forEach((f) => f.classList.remove('is-z'));
        lbt.scrollTo({ left: lbt.clientWidth * nx, behavior: 'smooth' });
      };
      $$('[data-snmp-lbn]', lb).forEach((b) => on(b, 'click', (e) => { e.stopPropagation(); lbGo(+b.getAttribute('data-snmp-lbn')!); }));
      on(window, 'keydown', (e: KeyboardEvent) => {
        if (lb.hidden) return;
        if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); close(); }
        else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); e.stopImmediatePropagation(); lbGo(e.key === 'ArrowRight' ? 1 : -1); }
      }, true);
      const origin = (e: MouseEvent, im: HTMLElement, box: Element) => {
        const b = box.getBoundingClientRect();
        im.style.transformOrigin = `${((e.clientX - b.left) / b.width) * 100}% ${((e.clientY - b.top) / b.height) * 100}%`;
      };
      on(lbt, 'click', (e: MouseEvent) => {
        const f = (e.target as HTMLElement).closest('.snmp__lbf');
        if (!f) return;
        if ((e.target as HTMLElement).tagName !== 'IMG') { close(); return; }
        const im = $('img', f)!;
        origin(e, im, im);
        f.classList.toggle('is-z');
      });
      on(lbt, 'pointermove', (e: MouseEvent) => {
        const f = (e.target as HTMLElement).closest('.snmp__lbf.is-z');
        if (f) origin(e, $('img', f)!, f);
      });
      offs.push(() => document.documentElement.classList.remove('sn-lock'));
    }
    return () => offs.forEach((f) => f());
  }, [rootId]);
  return null;
}
