/* =========================================================================
   header.js: owned by shad-2d. Loaded deferred from layout/theme.liquid.
   <sticky-header>        scrolled/hidden state, publishes header:height
   <header-menu>          desktop mega menu (hover intent, click, keyboard)
   <mobile-nav-levels>    level-2 panels inside <theme-drawer id="mobile-nav">
   <announcement-bar>     rotating messages, pause, dismiss
   Depends on window.theme from global.js (pubsub, trapFocus); every use is guarded.
   ========================================================================= */
(function () {
  'use strict';
  const theme = (window.theme = window.theme || {});
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 1024px)');
  const publish = (event, payload) => theme.pubsub && theme.pubsub.publish(event, payload);

  /* ---------- <sticky-header data-mode="always|hide_on_scroll|none"> ---------- */
  class StickyHeader extends HTMLElement {
    connectedCallback() {
      this.header = this.querySelector('.header');
      this.wrapper = this.closest('.shopify-section') || this;
      this.mode = this.dataset.mode || 'always';
      this.lastY = window.scrollY;
      this.state = { scrolled: null, hidden: null };
      this._onScroll = () => {
        if (this._ticking) return;
        this._ticking = true;
        requestAnimationFrame(() => { this._ticking = false; this.update(); });
      };
      this._onMenu = () => this.update(true);
      window.addEventListener('scroll', this._onScroll, { passive: true });
      document.addEventListener('theme:drawer:open', this._onMenu);
      document.addEventListener('header:menu', this._onMenu);
      if ('ResizeObserver' in window) {
        this._ro = new ResizeObserver(() => this.publishHeight());
        this._ro.observe(this.header);
      }
      this.update(true);
    }

    disconnectedCallback() {
      window.removeEventListener('scroll', this._onScroll);
      document.removeEventListener('theme:drawer:open', this._onMenu);
      document.removeEventListener('header:menu', this._onMenu);
      if (this._ro) this._ro.disconnect();
    }

    /* Document offset where the header starts sticking: everything above it in the header group (announcement bar). */
    stickyStart() {
      let offset = 0;
      for (let el = this.wrapper.previousElementSibling; el; el = el.previousElementSibling) offset += el.offsetHeight;
      return offset;
    }

    busy() {
      return this.header.hasAttribute('data-menu-open') || !!document.querySelector('theme-drawer[open], theme-dialog[open]');
    }

    update(force) {
      const y = Math.max(window.scrollY, 0);
      const start = this.stickyStart();
      const scrolled = this.mode !== 'none' ? y > start : false;
      let hidden = false;
      if (this.mode === 'hide_on_scroll' && !reducedMotion.matches && scrolled) {
        const past = y > start + this.header.offsetHeight;
        if (this.busy() || !past) hidden = false;
        else if (y > this.lastY + 4) hidden = true;
        else if (y < this.lastY - 4) hidden = false;
        else hidden = !!this.state.hidden;
      }
      this.lastY = y;
      if (!force && scrolled === this.state.scrolled && hidden === this.state.hidden) return;
      const changed = hidden !== this.state.hidden;
      this.state = { scrolled, hidden };
      this.header.toggleAttribute('data-scrolled', scrolled);
      this.header.toggleAttribute('data-hidden', hidden);
      if (changed || force) this.publishHeight();
    }

    publishHeight() {
      const height = this.header.offsetHeight;
      const visible = this.state.hidden ? 0 : height;
      const root = document.documentElement.style;
      root.setProperty('--header-height', `${height}px`);
      root.setProperty('--header-visible-height', `${visible}px`);
      publish('header:height', { height: visible, fullHeight: height, hidden: !!this.state.hidden });
    }
  }
  if (!customElements.get('sticky-header')) customElements.define('sticky-header', StickyHeader);

  /* ---------- <header-menu>: desktop mega menu ----------
     Open: hover with intent (120ms; instant when switching from another open item), click, Enter/Space, ArrowDown.
     Close: hover out (200ms, only when hover-opened), click on the open trigger (unless hover-opened), Escape
     (focus returns to the trigger), focus leaving the item, a click outside, resizing below desktop. */
  const OPEN_DELAY = 120;
  const CLOSE_DELAY = 200;

  class HeaderMenu extends HTMLElement {
    connectedCallback() {
      this.header = this.closest('.header');
      this.items = Array.from(this.querySelectorAll('[data-mega-item]')).map((item) => ({
        item, trigger: item.querySelector('[data-mega-trigger]'), panel: item.querySelector('[data-mega-panel]'),
      })).filter((x) => x.trigger && x.panel);
      this.current = null;
      this.openedBy = null;
      this._listeners = [];
      const on = (el, type, fn, opts) => { el.addEventListener(type, fn, opts); this._listeners.push([el, type, fn, opts]); };

      this.items.forEach((entry) => {
        on(entry.trigger, 'click', () => this.onTriggerClick(entry));
        on(entry.trigger, 'keydown', (e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); this.open(entry, 'keyboard'); this.focusFirst(entry); }
        });
        on(entry.item, 'pointerenter', (e) => { if (e.pointerType === 'mouse') this.intent(entry, true); });
        on(entry.item, 'pointerleave', (e) => { if (e.pointerType === 'mouse') this.intent(entry, false); });
        on(entry.item, 'focusout', (e) => {
          if (this.current === entry && e.relatedTarget && !entry.item.contains(e.relatedTarget)) this.close();
        });
      });
      on(document, 'keydown', (e) => {
        if (e.key !== 'Escape' || !this.current) return;
        const { trigger } = this.current;
        this.close();
        trigger.focus();
      });
      on(document, 'click', (e) => { if (this.current && !this.current.item.contains(e.target)) this.close(); });
      on(desktop, 'change', () => { if (!desktop.matches) this.close(); });
      // Theme editor: selecting a promo block opens its panel.
      on(document, 'shopify:block:select', (e) => {
        const entry = this.items.find((x) => x.panel.contains(e.target));
        if (entry) this.open(entry, 'click', true);
      });
      on(document, 'shopify:block:deselect', () => this.close());
    }

    disconnectedCallback() {
      clearTimeout(this._timer);
      this._listeners.forEach(([el, type, fn, opts]) => el.removeEventListener(type, fn, opts));
      this._listeners = [];
    }

    intent(entry, entering) {
      clearTimeout(this._timer);
      if (entering) {
        if (this.current === entry) return;
        if (this.current) this.open(entry, 'hover', true);
        else this._timer = setTimeout(() => this.open(entry, 'hover'), OPEN_DELAY);
      } else if (this.current === entry && this.openedBy === 'hover') {
        this._timer = setTimeout(() => this.close(), CLOSE_DELAY);
      }
    }

    onTriggerClick(entry) {
      clearTimeout(this._timer);
      if (this.current !== entry) { this.open(entry, 'click'); return; }
      // A click on a panel that hover just opened pins it instead of closing it.
      if (this.openedBy === 'hover') { this.openedBy = 'click'; return; }
      this.close();
    }

    open(entry, by, instant) {
      clearTimeout(this._timer);
      const switching = !!this.current && this.current !== entry;
      if (switching) this.setOpen(this.current, false);
      this.current = entry;
      this.openedBy = by;
      this.header.toggleAttribute('data-menu-switching', switching || !!instant);
      this.setOpen(entry, true);
      this.header.setAttribute('data-menu-open', '');
      if (switching || instant) requestAnimationFrame(() => requestAnimationFrame(() => this.header.removeAttribute('data-menu-switching')));
      this.dispatchEvent(new CustomEvent('header:menu', { bubbles: true, detail: { open: true } }));
    }

    close() {
      clearTimeout(this._timer);
      if (!this.current) return;
      this.setOpen(this.current, false);
      this.current = null;
      this.openedBy = null;
      this.header.removeAttribute('data-menu-open');
      this.dispatchEvent(new CustomEvent('header:menu', { bubbles: true, detail: { open: false } }));
    }

    setOpen({ item, trigger, panel }, open) {
      trigger.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('is-open', open);
      item.toggleAttribute('data-open', open);
    }

    focusFirst({ panel }) {
      const first = panel.querySelector('a[href], button:not([disabled])');
      if (first) requestAnimationFrame(() => first.focus());
    }
  }
  if (!customElements.get('header-menu')) customElements.define('header-menu', HeaderMenu);

  /* ---------- <mobile-nav-levels>: level-2 panels in the mobile drawer ---------- */
  class MobileNavLevels extends HTMLElement {
    connectedCallback() {
      this.drawer = this.closest('theme-drawer');
      this.panel = this.closest('.drawer') || this;
      this._onClick = (e) => {
        const opener = e.target.closest('[data-level-open]');
        if (opener && this.contains(opener)) { e.preventDefault(); this.openLevel(opener); return; }
        const back = e.target.closest('[data-level-back]');
        if (back && this.contains(back)) { e.preventDefault(); this.closeLevel(); }
      };
      this._onKey = (e) => { if (e.key === 'Escape' && this.active) { e.stopPropagation(); this.closeLevel(); } };
      this._onDrawerClose = (e) => { if (e.target === this.drawer) this.closeLevel(true); };
      this.addEventListener('click', this._onClick);
      this.addEventListener('keydown', this._onKey);
      document.addEventListener('theme:drawer:close', this._onDrawerClose);
    }

    disconnectedCallback() {
      this.removeEventListener('click', this._onClick);
      this.removeEventListener('keydown', this._onKey);
      document.removeEventListener('theme:drawer:close', this._onDrawerClose);
    }

    openLevel(opener) {
      const level = document.getElementById(opener.getAttribute('aria-controls'));
      if (!level) return;
      this.scrollTop = 0;
      this.active = { opener, level };
      opener.setAttribute('aria-expanded', 'true');
      level.classList.add('is-open');
      this.setAttribute('data-level-active', '');
      const back = level.querySelector('[data-level-back]');
      // Re-trap so the first/last focusable elements reflect the visible level.
      if (theme.trapFocus) theme.trapFocus(this.panel, back || level);
      else if (back) back.focus();
    }

    closeLevel(silent) {
      if (!this.active) return;
      const { opener, level } = this.active;
      this.active = null;
      opener.setAttribute('aria-expanded', 'false');
      level.classList.remove('is-open');
      this.removeAttribute('data-level-active');
      if (silent) return;
      if (theme.trapFocus) theme.trapFocus(this.panel, opener);
      else opener.focus();
    }
  }
  if (!customElements.get('mobile-nav-levels')) customElements.define('mobile-nav-levels', MobileNavLevels);

  /* ---------- <announcement-bar data-autoplay data-speed="5"> ---------- */
  class AnnouncementBar extends HTMLElement {
    connectedCallback() {
      this.slides = Array.from(this.querySelectorAll('[data-slide]'));
      this.index = Math.max(0, this.slides.findIndex((s) => s.classList.contains('is-active')));
      this.speed = Math.max(3, Number(this.dataset.speed) || 5) * 1000;
      this.paused = reducedMotion.matches || !this.hasAttribute('data-autoplay');
      this._onClick = (e) => {
        if (e.target.closest('[data-announcement-prev]')) this.go(this.index - 1, true);
        else if (e.target.closest('[data-announcement-next]')) this.go(this.index + 1, true);
        else if (e.target.closest('[data-announcement-toggle]')) this.setPaused(!this.paused, true);
        else if (e.target.closest('[data-announcement-dismiss]')) this.dismiss();
      };
      this._hold = () => { this._held = true; this.stop(); };
      this._release = () => { this._held = false; this.start(); };
      this.addEventListener('click', this._onClick);
      this.addEventListener('pointerenter', this._hold);
      this.addEventListener('pointerleave', this._release);
      this.addEventListener('focusin', this._hold);
      this.addEventListener('focusout', this._release);
      this.start();
    }

    disconnectedCallback() {
      this.stop();
      this.removeEventListener('click', this._onClick);
      this.removeEventListener('pointerenter', this._hold);
      this.removeEventListener('pointerleave', this._release);
      this.removeEventListener('focusin', this._hold);
      this.removeEventListener('focusout', this._release);
    }

    start() {
      this.stop();
      if (this.paused || this._held || this.slides.length < 2) return;
      this._timer = setInterval(() => this.go(this.index + 1), this.speed);
    }

    stop() { clearInterval(this._timer); }

    setPaused(paused, byUser) {
      this.paused = paused;
      const toggle = this.querySelector('[data-announcement-toggle]');
      if (toggle) {
        toggle.setAttribute('aria-pressed', String(paused));
        toggle.setAttribute('aria-label', paused ? toggle.dataset.labelPlay : toggle.dataset.labelPause);
        toggle.querySelectorAll('[data-icon]').forEach((i) => { i.hidden = i.dataset.icon !== (paused ? 'play' : 'pause'); });
      }
      if (byUser) this._held = false;
      this.start();
    }

    go(i, byUser) {
      if (!this.slides.length) return;
      const n = this.slides.length;
      this.index = ((i % n) + n) % n;
      this.slides.forEach((s, k) => {
        const on = k === this.index;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-hidden', String(!on));
        s.querySelectorAll('a').forEach((a) => (on ? a.removeAttribute('tabindex') : a.setAttribute('tabindex', '-1')));
      });
      if (byUser) this.start();
    }

    dismiss() {
      const section = this.closest('.shopify-section');
      try { sessionStorage.setItem(`announcement-dismissed:${this.dataset.key || ''}`, '1'); } catch (e) { /* storage unavailable */ }
      (section || this).hidden = true;
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('scroll'));
    }
  }
  if (!customElements.get('announcement-bar')) customElements.define('announcement-bar', AnnouncementBar);
})();
