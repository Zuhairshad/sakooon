/* =========================================================================
   Sakooon theme: global.js. Owner: Fable. Loaded deferred on every page.
   Public API: window.theme.* (see docs/component-contracts.md section 1).
   Custom elements: <theme-drawer>, <theme-dialog>, <theme-disclosure>, <theme-tabs>, <theme-reveal>.
   No dependencies.
   ========================================================================= */
(function () {
  'use strict';
  const theme = (window.theme = window.theme || {});
  theme.strings = theme.strings || {};
  theme.routes = theme.routes || {};
  theme.settings = theme.settings || {};

  /* ---------- pubsub ---------- */
  const subscribers = {};
  theme.pubsub = {
    subscribe(event, callback) {
      (subscribers[event] = subscribers[event] || []).push(callback);
      return () => { subscribers[event] = (subscribers[event] || []).filter((cb) => cb !== callback); };
    },
    publish(event, payload) {
      (subscribers[event] || []).slice().forEach((cb) => { try { cb(payload); } catch (e) { console.error(`[theme] ${event} handler failed`, e); } });
    },
  };

  /* ---------- helpers ---------- */
  theme.fetchConfig = function (type = 'json') {
    return { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: `application/${type}` } };
  };
  theme.debounce = function (fn, wait = 200) {
    let t; return function (...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait); };
  };
  theme.throttle = function (fn, limit = 100) {
    let waiting = false; return function (...args) { if (waiting) return; fn.apply(this, args); waiting = true; setTimeout(() => (waiting = false), limit); };
  };
  theme.getFocusableElements = function (container) {
    return Array.from(container.querySelectorAll('summary, a[href], button:not([disabled]), [tabindex]:not([tabindex^="-"]), [draggable], area, input:not([type=hidden]):not([disabled]), select:not([disabled]), textarea:not([disabled]), object, iframe'))
      .filter((el) => el.offsetParent !== null || el === document.activeElement);
  };

  /* Focus trap (one at a time) */
  const trap = { container: null, handlers: {} };
  theme.trapFocus = function (container, elementToFocus) {
    theme.removeTrapFocus();
    const focusable = theme.getFocusableElements(container);
    const first = focusable[0], last = focusable[focusable.length - 1];
    trap.container = container;
    trap.handlers.focusin = (e) => { if (e.target !== container && e.target !== last && e.target !== first) return; document.addEventListener('keydown', trap.handlers.keydown); };
    trap.handlers.focusout = () => document.removeEventListener('keydown', trap.handlers.keydown);
    trap.handlers.keydown = (e) => {
      if (e.code !== 'Tab') return;
      if (e.target === last && !e.shiftKey) { e.preventDefault(); first.focus(); }
      if ((e.target === container || e.target === first) && e.shiftKey) { e.preventDefault(); last.focus(); }
    };
    document.addEventListener('focusout', trap.handlers.focusout);
    document.addEventListener('focusin', trap.handlers.focusin);
    (elementToFocus || container).focus({ preventScroll: true });
  };
  theme.removeTrapFocus = function (elementToFocus) {
    document.removeEventListener('focusin', trap.handlers.focusin);
    document.removeEventListener('focusout', trap.handlers.focusout);
    document.removeEventListener('keydown', trap.handlers.keydown);
    trap.container = null;
    if (elementToFocus) elementToFocus.focus({ preventScroll: true });
  };

  /* Scroll lock with counter (nested drawers) */
  let lockCount = 0, scrollY = 0;
  theme.lockScroll = function () {
    if (lockCount++ === 0) { scrollY = window.scrollY; document.body.classList.add('scroll-locked'); document.body.style.top = `-${scrollY}px`; }
  };
  theme.unlockScroll = function () {
    if (lockCount === 0) return;
    if (--lockCount === 0) { document.body.classList.remove('scroll-locked'); document.body.style.top = ''; window.scrollTo(0, scrollY); }
  };

  /* Section rendering API: fetch a section's HTML and return a parsed element */
  theme.renderSection = async function ({ sectionId, url = window.location.pathname, params = {} }) {
    const u = new URL(url, window.location.origin);
    u.searchParams.set('section_id', sectionId);
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
    const res = await fetch(u.toString(), { headers: { Accept: 'text/html' } });
    if (!res.ok) throw new Error(`Section ${sectionId} failed: ${res.status}`);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.getElementById(`shopify-section-${sectionId}`) || doc.body.firstElementChild;
  };

  /* Money formatting from shop.money_format */
  theme.money = function (cents, format) {
    const fmt = format || theme.moneyFormat || '{{amount}}';
    const value = Number(cents || 0) / 100;
    const match = /\{\{\s*(\w+)\s*\}\}/.exec(fmt);
    const type = match ? match[1] : 'amount';
    const withDelims = (num, precision, thousands, decimal) => {
      const parts = num.toFixed(precision).split('.');
      return parts[0].replace(/(\d)(?=(\d{3})+$)/g, `$1${thousands}`) + (parts[1] ? decimal + parts[1] : '');
    };
    let out;
    switch (type) {
      case 'amount': out = withDelims(value, 2, ',', '.'); break;
      case 'amount_no_decimals': out = withDelims(value, 0, ',', '.'); break;
      case 'amount_with_comma_separator': out = withDelims(value, 2, '.', ','); break;
      case 'amount_no_decimals_with_comma_separator': out = withDelims(value, 0, '.', ','); break;
      case 'amount_with_space_separator': out = withDelims(value, 2, ' ', ','); break;
      case 'amount_no_decimals_with_space_separator': out = withDelims(value, 0, ' ', ','); break;
      case 'amount_with_apostrophe_separator': out = withDelims(value, 2, "'", '.'); break;
      default: out = withDelims(value, 2, ',', '.');
    }
    return fmt.replace(/\{\{\s*\w+\s*\}\}/, out).replace(/<[^>]*>/g, '');
  };

  /* Live region announcements */
  theme.announce = function (message) {
    const region = document.querySelector('[data-live-region]');
    if (!region) return;
    region.textContent = '';
    requestAnimationFrame(() => { region.textContent = message; });
  };
  theme.toast = function (message, duration = 3000) {
    let el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = message; el.hidden = false;
    clearTimeout(el._t); el._t = setTimeout(() => { el.hidden = true; }, duration);
  };

  /* Theme editor hooks */
  theme.onSectionLoad = function (sectionType, callback) {
    if (!window.Shopify || !window.Shopify.designMode) return () => {};
    const handler = (e) => { const el = e.target; if (!sectionType || el.querySelector(`[data-section-type="${sectionType}"]`) || el.dataset.sectionType === sectionType) callback(el, e); };
    document.addEventListener('shopify:section:load', handler);
    return () => document.removeEventListener('shopify:section:load', handler);
  };

  /* ---------- <theme-drawer> ----------
     <theme-drawer id="cart-drawer" data-side="right" data-lock-scroll>
       <div class="overlay" data-drawer-close></div>
       <div class="drawer drawer--right" role="dialog" aria-modal="true" aria-labelledby="...">…<button data-drawer-close>…</button></div>
     </theme-drawer>
     Open from anywhere: <button data-drawer-open="cart-drawer">. API: el.open(trigger), el.close(). */
  class ThemeDrawer extends HTMLElement {
    constructor() { super(); this._onKey = this._onKey.bind(this); this._onClick = this._onClick.bind(this); }
    connectedCallback() {
      this.addEventListener('click', this._onClick);
      this.panel = this.querySelector('.drawer, .dialog__panel, [data-panel]') || this;
      if (!this.panel.hasAttribute('tabindex')) this.panel.setAttribute('tabindex', '-1');
      if (this.hasAttribute('open')) this.open();
    }
    disconnectedCallback() { this.removeEventListener('click', this._onClick); document.removeEventListener('keydown', this._onKey); if (this._locked) theme.unlockScroll(); }
    get isOpen() { return this.hasAttribute('open'); }
    open(trigger) {
      if (this.isOpen) return;
      this.trigger = trigger || document.activeElement;
      this.setAttribute('open', '');
      if (this.hasAttribute('data-lock-scroll') || this.dataset.lockScroll !== undefined) { theme.lockScroll(); this._locked = true; }
      document.addEventListener('keydown', this._onKey);
      document.querySelectorAll(`[data-drawer-open="${this.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'true'));
      const focusTarget = this.querySelector('[data-autofocus]') || this.panel;
      // Focus once the panel is actually visible: visibility flips on the next frame (or after a .01ms transition under
      // reduced motion), and focus() on a visibility:hidden element is a silent no-op. Retry a few frames, then force it.
      let tries = 0;
      const attempt = () => {
        if (!this.isOpen) return;
        const visible = getComputedStyle(this.panel).visibility !== 'hidden';
        if (visible || tries >= 10) { theme.trapFocus(this.panel, focusTarget); if (!this.panel.contains(document.activeElement)) focusTarget.focus({ preventScroll: true }); return; }
        tries += 1; requestAnimationFrame(attempt);
      };
      requestAnimationFrame(attempt);
      this.dispatchEvent(new CustomEvent('theme:drawer:open', { bubbles: true, detail: { id: this.id } }));
      theme.pubsub.publish('drawer:open', { id: this.id, el: this });
    }
    close() {
      if (!this.isOpen) return;
      this.removeAttribute('open');
      if (this._locked) { theme.unlockScroll(); this._locked = false; }
      document.removeEventListener('keydown', this._onKey);
      document.querySelectorAll(`[data-drawer-open="${this.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'false'));
      theme.removeTrapFocus(this.trigger && document.contains(this.trigger) ? this.trigger : null);
      this.dispatchEvent(new CustomEvent('theme:drawer:close', { bubbles: true, detail: { id: this.id } }));
      theme.pubsub.publish('drawer:close', { id: this.id, el: this });
    }
    toggle(trigger) { this.isOpen ? this.close() : this.open(trigger); }
    _onKey(e) { if (e.key === 'Escape') { e.preventDefault(); this.close(); } }
    _onClick(e) { if (e.target.closest('[data-drawer-close]')) { e.preventDefault(); this.close(); } }
  }
  if (!customElements.get('theme-drawer')) customElements.define('theme-drawer', ThemeDrawer);
  class ThemeDialog extends ThemeDrawer {}
  if (!customElements.get('theme-dialog')) customElements.define('theme-dialog', ThemeDialog);

  // Global delegation for openers (works for content injected later and in the editor)
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-drawer-open]');
    if (!opener) return;
    const target = document.getElementById(opener.dataset.drawerOpen);
    if (!target || typeof target.open !== 'function') return;
    e.preventDefault();
    target.toggle(opener);
  });
  // Close all drawers when the editor selects another section
  document.addEventListener('shopify:section:unload', (e) => { e.target.querySelectorAll('theme-drawer[open], theme-dialog[open]').forEach((d) => d.close()); });

  /* ---------- <theme-disclosure> ----------
     <theme-disclosure [data-group="name"] [open]>
       <button class="disclosure__trigger" aria-expanded="false" aria-controls="id">…</button>
       <div class="disclosure__panel" id="id"><div class="disclosure__content">…</div></div>
     </theme-disclosure>  (data-group closes siblings in the same group) */
  class ThemeDisclosure extends HTMLElement {
    connectedCallback() {
      this.trigger = this.querySelector('[aria-controls], .disclosure__trigger, summary');
      this.panel = this.trigger && document.getElementById(this.trigger.getAttribute('aria-controls')) || this.querySelector('.disclosure__panel');
      if (!this.trigger || !this.panel) return;
      this._onClick = (e) => { e.preventDefault(); this.toggle(); };
      this.trigger.addEventListener('click', this._onClick);
      this.set(this.hasAttribute('open') || this.trigger.getAttribute('aria-expanded') === 'true');
    }
    disconnectedCallback() { if (this.trigger && this._onClick) this.trigger.removeEventListener('click', this._onClick); }
    set(expanded) {
      this.trigger.setAttribute('aria-expanded', String(expanded));
      this.panel.toggleAttribute('data-open', expanded);
      this.toggleAttribute('open', expanded);
      // Keep content focusable only when visible
      this.panel.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach((el) => expanded ? el.removeAttribute('tabindex') : el.setAttribute('tabindex', '-1'));
      if (expanded && this.dataset.group) {
        document.querySelectorAll(`theme-disclosure[data-group="${this.dataset.group}"]`).forEach((other) => { if (other !== this && other.hasAttribute('open')) other.set(false); });
      }
      this.dispatchEvent(new CustomEvent('theme:disclosure:toggle', { bubbles: true, detail: { expanded } }));
    }
    toggle() { this.set(this.trigger.getAttribute('aria-expanded') !== 'true'); }
  }
  if (!customElements.get('theme-disclosure')) customElements.define('theme-disclosure', ThemeDisclosure);

  /* ---------- <theme-tabs> ----------
     <theme-tabs><div role="tablist"><button role="tab" aria-selected aria-controls id>…</div><div role="tabpanel" id hidden>…</theme-tabs> */
  class ThemeTabs extends HTMLElement {
    connectedCallback() {
      this.tabs = Array.from(this.querySelectorAll('[role="tab"]'));
      this._onClick = (e) => { const t = e.target.closest('[role="tab"]'); if (t && this.tabs.includes(t)) this.select(t); };
      this._onKey = (e) => {
        const i = this.tabs.indexOf(document.activeElement); if (i < 0) return;
        let n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % this.tabs.length; if (e.key === 'ArrowLeft') n = (i - 1 + this.tabs.length) % this.tabs.length;
        if (e.key === 'Home') n = 0; if (e.key === 'End') n = this.tabs.length - 1;
        if (n !== null) { e.preventDefault(); this.select(this.tabs[n]); this.tabs[n].focus(); }
      };
      this.addEventListener('click', this._onClick); this.addEventListener('keydown', this._onKey);
      const current = this.tabs.find((t) => t.getAttribute('aria-selected') === 'true') || this.tabs[0];
      if (current) this.select(current);
    }
    disconnectedCallback() { this.removeEventListener('click', this._onClick); this.removeEventListener('keydown', this._onKey); }
    select(tab) {
      this.tabs.forEach((t) => {
        const on = t === tab; t.setAttribute('aria-selected', String(on)); t.setAttribute('tabindex', on ? '0' : '-1');
        const panel = document.getElementById(t.getAttribute('aria-controls')); if (panel) panel.hidden = !on;
      });
      this.dispatchEvent(new CustomEvent('theme:tabs:change', { bubbles: true, detail: { tab } }));
    }
  }
  if (!customElements.get('theme-tabs')) customElements.define('theme-tabs', ThemeTabs);

  /* ---------- Reveal on scroll (opt-in via settings.animations_reveal) ---------- */
  const revealOn = theme.settings.reveal && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window;
  if (!revealOn) document.documentElement.classList.add('reveal-off');
  else {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    const observe = (root = document) => root.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => io.observe(el));
    observe();
    document.addEventListener('shopify:section:load', (e) => observe(e.target));
    theme.observeReveal = observe;
  }

  /* ---------- Header height custom property fallback ---------- */
  const setHeaderHeight = () => {
    const header = document.querySelector('.header, [data-header]');
    const bar = document.querySelector('.announcement-bar, [data-announcement]');
    if (header) document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
    if (bar) document.documentElement.style.setProperty('--announcement-height', `${bar.offsetHeight}px`);
  };
  setHeaderHeight();
  window.addEventListener('resize', theme.debounce(setHeaderHeight, 150));
  document.addEventListener('shopify:section:load', setHeaderHeight);

  /* ---------- Cart count badge (any element with data-cart-count) ---------- */
  theme.pubsub.subscribe('cart:updated', ({ cart }) => {
    if (!cart) return;
    document.querySelectorAll('[data-cart-count]').forEach((el) => { el.textContent = cart.item_count; el.toggleAttribute('data-empty', cart.item_count === 0); });
  });

  theme.ready = true;
  document.dispatchEvent(new CustomEvent('theme:ready'));
})();
