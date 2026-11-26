/* cart.js: owned by shad-d8 (commerce). Loaded deferred from layout/theme.liquid.
   Cart AJAX API + Section Rendering for the cart drawer and cart page.
   Public: theme.cart.add(formOrItems, opts), theme.cart.change(line, quantity), theme.cart.updateNote(note), theme.cart.refresh(), theme.cart.open()
   Elements: <cart-items> (wraps [data-cart-content] of a cart section), <quantity-input>, <cart-recommendations>.
   Events: publishes `cart:updated` { cart, source, open?, sections? } after every successful change, `cart:error` { message }.
   Listens: `cart:updated` from other sources (re-render, open drawer when open: true), `cart:open-request`. */
(function () {
  'use strict';
  const theme = (window.theme = window.theme || {});
  const routes = () => theme.routes || {};
  const strings = () => theme.strings || {};

  /** Section ids of every cart view on the page (drawer, cart page). */
  const cartSectionIds = () => Array.from(document.querySelectorAll('cart-items[data-cart-section]')).map((el) => el.dataset.cartSection);

  async function postJSON(url, body) {
    const res = await fetch(url, { ...theme.fetchConfig('javascript'), body: JSON.stringify(body) });
    let data = {};
    try { data = await res.json(); } catch (e) { /* non-JSON error page */ }
    if (!res.ok || data.status) {
      const err = new Error(data.description || data.message || strings().cartError || 'Cart error');
      err.status = res.status || data.status;
      throw err;
    }
    return data;
  }

  async function getCart() {
    const res = await fetch(`${routes().cart || '/cart'}.js`, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(strings().cartError);
    return res.json();
  }

  /** Swap the [data-cart-content] of every cart view, from a `sections` map or by fetching each section. */
  async function renderCartSections(sections) {
    const views = Array.from(document.querySelectorAll('cart-items[data-cart-section]'));
    await Promise.all(views.map(async (view) => {
      const id = view.dataset.cartSection;
      let source = null;
      try {
        if (sections && sections[id]) source = new DOMParser().parseFromString(sections[id], 'text/html');
        else source = await theme.renderSection({ sectionId: id, url: window.location.pathname });
      } catch (e) { console.error('[cart] section render failed', id, e); return; }
      const next = source && source.querySelector(`cart-items[data-cart-section="${id}"] [data-cart-content]`);
      if (next) view.replaceContent(next);
    }));
  }

  function itemsFromForm(form) {
    const fd = new FormData(form);
    const item = { id: Number(fd.get('id')), quantity: Number(fd.get('quantity') || 1) };
    if (fd.get('selling_plan')) item.selling_plan = fd.get('selling_plan');
    const properties = {};
    for (const [key, value] of fd.entries()) {
      const m = /^properties\[(.+)\]$/.exec(key);
      if (m && value !== '') properties[m[1]] = value;
    }
    if (Object.keys(properties).length) item.properties = properties;
    return [item];
  }

  const drawer = () => document.getElementById('cart-drawer');

  theme.cart = {
    /** Add to cart. `input` is a product <form> or an array of { id, quantity, properties }. Resolves with the full cart. */
    async add(input, { source = 'product-form', open = true } = {}) {
      const items = input instanceof HTMLFormElement ? itemsFromForm(input) : input;
      const ids = cartSectionIds();
      const added = await postJSON(`${routes().cartAdd || '/cart/add'}.js`, { items, sections: ids, sections_url: window.location.pathname });
      const cart = await getCart();
      // Cart type "page" (no drawer on the page): go to the cart, as the no-JS form would.
      if (open && !drawer() && !document.querySelector('cart-items[data-cart-section]')) { window.location.href = routes().cart || '/cart'; return cart; }
      theme.pubsub.publish('cart:updated', { cart, source, open, sections: added.sections || null });
      return cart;
    },
    /** Change a line (1-based index) to `quantity` (0 removes). Resolves with the cart. */
    async change(line, quantity, { source = 'cart-items' } = {}) {
      const data = await postJSON(`${routes().cartChange || '/cart/change'}.js`, { line, quantity, sections: cartSectionIds(), sections_url: window.location.pathname });
      const { sections, ...cart } = data;
      await renderCartSections(sections);
      theme.pubsub.publish('cart:updated', { cart, source });
      return cart;
    },
    async updateNote(note) {
      return postJSON(`${routes().cartUpdate || '/cart/update'}.js`, { note });
    },
    /** Re-render every cart view from the server (bfcache restore, other tabs). */
    async refresh() {
      await renderCartSections(null);
      const cart = await getCart();
      theme.pubsub.publish('cart:updated', { cart, source: 'refresh' });
      return cart;
    },
    open(trigger) { const d = drawer(); if (d && typeof d.open === 'function') d.open(trigger); },
  };

  /* Updates published by other parts of the theme (product form, quick add): re-render, then open the drawer. */
  theme.pubsub.subscribe('cart:updated', async ({ source, open, sections }) => {
    if (source === 'cart-items' || source === 'refresh') return;
    await renderCartSections(sections);
    if (open && theme.settings.cartType === 'drawer') theme.cart.open();
  });
  theme.pubsub.subscribe('cart:open-request', ({ trigger } = {}) => theme.cart.open(trigger));

  /* A page restored from the back/forward cache shows a stale cart. */
  window.addEventListener('pageshow', (e) => { if (e.persisted && cartSectionIds().length) theme.cart.refresh().catch(() => {}); });

  /* ---------- <cart-items> ---------- */
  class CartItems extends HTMLElement {
    connectedCallback() {
      this._onChange = this._onChange.bind(this);
      this._onClick = this._onClick.bind(this);
      this._debounced = theme.debounce((input) => this._updateLine(input), 350);
      this._noteDebounced = theme.debounce((note) => theme.cart.updateNote(note).catch((e) => this._error(e.message)), 500);
      this.addEventListener('change', this._onChange);
      this.addEventListener('click', this._onClick);
    }
    disconnectedCallback() {
      this.removeEventListener('change', this._onChange);
      this.removeEventListener('click', this._onClick);
    }
    _onChange(e) {
      if (e.target.matches('.quantity__input[data-line]')) this._debounced(e.target);
      else if (e.target.matches('[data-cart-note]')) this._noteDebounced(e.target.value);
    }
    _onClick(e) {
      const remove = e.target.closest('[data-cart-remove]');
      if (!remove) return;
      e.preventDefault();
      const line = remove.closest('[data-line-item]');
      this._setLine(Number(line.dataset.index), 0, line);
    }
    _updateLine(input) {
      const value = Math.max(0, parseInt(input.value, 10) || 0);
      this._setLine(Number(input.dataset.line), value, input.closest('[data-line-item]'));
    }
    async _setLine(index, quantity, lineEl) {
      // One request at a time; the latest change made meanwhile runs next.
      if (this._busy) { this._pending = [index, quantity]; return; }
      this._busy = true;
      this.setAttribute('aria-busy', 'true');
      lineEl && lineEl.classList.add('is-loading');
      this._error('');
      try {
        const cart = await theme.cart.change(index, quantity);
        // Shopify caps quantity at inventory and reports it only through the returned quantity.
        const updated = cart.items[index - 1];
        if (quantity > 0 && updated && updated.key === (lineEl && lineEl.dataset.key) && updated.quantity < quantity) {
          const msg = (strings().quantityError || '').replace('[quantity]', updated.quantity);
          this._lineError(index, msg);
        }
      } catch (e) {
        lineEl && lineEl.classList.remove('is-loading');
        this._lineError(index, e.message) || this._error(e.message);
        theme.pubsub.publish('cart:error', { message: e.message });
        // Restore the server's quantity in the input after a failed change.
        theme.cart.refresh().catch(() => {});
      } finally {
        this._busy = false;
        this.removeAttribute('aria-busy');
        if (this._pending) {
          const [i, q] = this._pending; this._pending = null;
          this._setLine(i, q, this.querySelector(`[data-line-item][data-index="${i}"]`));
        }
      }
    }
    _lineError(index, message) {
      const el = this.querySelector(`[data-line-item][data-index="${index}"] [data-line-error]`);
      if (!el || !message) return false;
      el.textContent = message; el.hidden = false;
      return true;
    }
    _error(message) {
      const el = this.querySelector('[data-cart-error]');
      if (!el) return;
      el.textContent = message || ''; el.hidden = !message;
    }
    /** Replace the content with fresh server HTML, keeping focus on the equivalent control. */
    replaceContent(next) {
      const current = this.querySelector('[data-cart-content]');
      if (!current) return;
      const active = document.activeElement;
      let focusSelector = null;
      if (active && this.contains(active)) {
        const line = active.closest('[data-line-item]');
        if (active.id) focusSelector = `#${CSS.escape(active.id)}`;
        else if (line && active.name) focusSelector = `[data-line-item][data-key="${CSS.escape(line.dataset.key)}"] [name="${active.name}"]`;
        else if (active.matches('[data-drawer-close]')) focusSelector = '[data-drawer-close]';
      }
      current.replaceWith(document.importNode(next, true));
      const target = (focusSelector && this.querySelector(focusSelector)) || null;
      if (target) target.focus({ preventScroll: true });
      else if (focusSelector || document.activeElement === document.body) {
        // The focused control went away with its line: keep focus inside the dialog / cart.
        const panel = this.closest('.drawer, [role="dialog"]') || this;
        if (!panel.hasAttribute('tabindex')) panel.setAttribute('tabindex', '-1');
        panel.focus({ preventScroll: true });
      }
    }
  }
  if (!customElements.get('cart-items')) customElements.define('cart-items', CartItems);

  /* ---------- <quantity-input> ---------- */
  class QuantityInput extends HTMLElement {
    connectedCallback() {
      this.input = this.querySelector('input');
      this._onClick = (e) => {
        const btn = e.target.closest('button[name="plus"], button[name="minus"]');
        if (!btn || !this.input) return;
        e.preventDefault();
        const step = Number(this.input.step) || 1;
        const min = this.input.min !== '' ? Number(this.input.min) : 0;
        const max = this.input.max !== '' ? Number(this.input.max) : Infinity;
        const prev = Number(this.input.value) || 0;
        const next = btn.name === 'plus' ? Math.min(prev + step, max) : Math.max(prev - step, min);
        if (next === prev) return;
        this.input.value = next;
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
      };
      this._sync = () => this._updateButtons();
      this.addEventListener('click', this._onClick);
      this.input && this.input.addEventListener('change', this._sync);
      this._updateButtons();
    }
    disconnectedCallback() { this.removeEventListener('click', this._onClick); this.input && this.input.removeEventListener('change', this._sync); }
    _updateButtons() {
      if (!this.input) return;
      const v = Number(this.input.value) || 0;
      const min = this.input.min !== '' ? Number(this.input.min) : 0;
      const max = this.input.max !== '' ? Number(this.input.max) : Infinity;
      const minus = this.querySelector('button[name="minus"]'); const plus = this.querySelector('button[name="plus"]');
      // Cart lines (min 0) keep minus enabled at 1 so it can remove the line.
      if (minus) minus.disabled = v <= min;
      if (plus) plus.disabled = v >= max;
    }
  }
  if (!customElements.get('quantity-input')) customElements.define('quantity-input', QuantityInput);

  /* ---------- <cart-recommendations> ----------
     Fetches complementary products (Product Recommendations API, Search & Discovery) rendered by
     sections/complementary-products.liquid; the drawer styles it compactly. Renders nothing when none exist. */
  class CartRecommendations extends HTMLElement {
    connectedCallback() {
      if (this._loaded || !this.dataset.url) return;
      this._loaded = true;
      fetch(this.dataset.url).then((r) => (r.ok ? r.text() : '')).then((html) => {
        if (!html) return;
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const content = doc.querySelector('[data-recommendations]');
        if (content && content.querySelector('[data-product-card], .product-card, [data-recommendation-item]')) this.replaceChildren(document.importNode(content, true));
      }).catch(() => {});
    }
  }
  if (!customElements.get('cart-recommendations')) customElements.define('cart-recommendations', CartRecommendations);
})();
