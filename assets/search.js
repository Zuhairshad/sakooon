/* search.js: owned by shad-d8 (commerce). Loaded deferred from layout/theme.liquid when predictive search is enabled.
   <predictive-search> inside sections/search-drawer.liquid: Predictive Search API rendered by the same section
   (/search/suggest?...&section_id=search-drawer). Debounced 250ms, aborts stale requests, caches by query.
   Keyboard: ArrowDown from the input moves to the first result; Escape closes the drawer (theme-drawer).
   Listens: `search:open-request`. */
(function () {
  'use strict';
  const theme = (window.theme = window.theme || {});
  const RESOURCES = 'product,collection,query,page,article';

  class PredictiveSearch extends HTMLElement {
    connectedCallback() {
      this.input = this.querySelector('[data-search-input]');
      this.form = this.querySelector('form');
      this.idle = this.querySelector('[data-search-idle]');
      this.live = this.querySelector('[data-search-live]');
      this.region = this.querySelector('[data-search-results]');
      this.reset = this.querySelector('[data-search-reset]');
      this.errorEl = this.querySelector('[data-search-error]');
      this.cache = new Map();
      if (!this.input) return;
      this._onInput = theme.debounce(() => this.search(this.input.value), 250);
      this._onKey = (e) => {
        if (e.key === 'ArrowDown') {
          const first = this.live && !this.live.hidden && this.live.querySelector('a[href]');
          if (first) { e.preventDefault(); first.focus(); }
        }
      };
      this._onSubmit = (e) => { if (!this.input.value.trim()) { e.preventDefault(); this.input.focus(); } };
      this._onReset = () => { requestAnimationFrame(() => { this.show(null); this.input.focus(); }); };
      this.input.addEventListener('input', this._onInput);
      this.input.addEventListener('keydown', this._onKey);
      this.form.addEventListener('submit', this._onSubmit);
      this.form.addEventListener('reset', this._onReset);
    }
    disconnectedCallback() {
      if (!this.input) return;
      this.input.removeEventListener('input', this._onInput);
      this.input.removeEventListener('keydown', this._onKey);
      this.form.removeEventListener('submit', this._onSubmit);
      this.form.removeEventListener('reset', this._onReset);
      this.controller && this.controller.abort();
    }
    url(q) {
      const u = new URL(this.dataset.url || (theme.routes && theme.routes.predictiveSearch) || '/search/suggest', window.location.origin);
      u.searchParams.set('q', q);
      u.searchParams.set('resources[type]', RESOURCES);
      u.searchParams.set('resources[limit]', this.dataset.limit || '8');
      u.searchParams.set('resources[limit_scope]', 'each');
      u.searchParams.set('section_id', 'search-drawer');
      return u.toString();
    }
    async search(raw) {
      const q = raw.trim();
      this.reset && (this.reset.hidden = raw.length === 0);
      if (this.hasAttribute('data-disabled')) return;
      if (!q) { this.controller && this.controller.abort(); this.show(null); return; }
      if (this.cache.has(q)) { this.show(this.cache.get(q), q); return; }
      this.controller && this.controller.abort();
      this.controller = new AbortController();
      this.region.setAttribute('aria-busy', 'true');
      this.classList.add('is-loading');
      try {
        const res = await fetch(this.url(q), { signal: this.controller.signal, headers: { Accept: 'text/html' } });
        if (!res.ok) throw new Error(String(res.status));
        const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
        const results = doc.querySelector('[data-predictive-results]');
        if (!results) throw new Error('No results markup');
        this.cache.set(q, results);
        // Only show the response for what is still in the box.
        if (this.input.value.trim() === q) this.show(results, q);
      } catch (e) {
        if (e.name === 'AbortError') return;
        this.error(theme.strings.searchError || theme.strings.cartError || '');
      } finally {
        this.region.setAttribute('aria-busy', 'false');
        this.classList.remove('is-loading');
      }
    }
    show(results, q) {
      this.error('');
      if (!results) {
        this.live.hidden = true; this.live.replaceChildren();
        if (this.idle) this.idle.hidden = false;
        return;
      }
      this.live.replaceChildren(document.importNode(results, true));
      this.live.hidden = false;
      if (this.idle) this.idle.hidden = true;
      const count = Number(results.dataset.count || 0);
      const template = count ? theme.strings.searchResults : theme.strings.searchNoResults;
      if (theme.announce && template) theme.announce(template.replace('[count]', count).replace('[terms]', q));
    }
    error(message) {
      if (!this.errorEl) return;
      this.errorEl.textContent = message; this.errorEl.hidden = !message;
    }
  }
  if (!customElements.get('predictive-search')) customElements.define('predictive-search', PredictiveSearch);

  // Autofocus fallback: under prefers-reduced-motion the input can still be mid visibility transition on the
  // drawer's first frame, so focus() is ignored. Retry once it is visible.
  document.addEventListener('theme:drawer:open', (e) => {
    if (!e.detail || e.detail.id !== 'search-drawer') return;
    const input = document.getElementById('SearchDrawerInput');
    if (!input) return;
    const tryFocus = (n) => { if (document.activeElement === input || n > 5) return; input.focus({ preventScroll: true }); setTimeout(() => tryFocus(n + 1), 30); };
    setTimeout(() => tryFocus(0), 0);
  });

  theme.pubsub && theme.pubsub.subscribe('search:open-request', ({ trigger } = {}) => {
    const d = document.getElementById('search-drawer');
    if (d && typeof d.open === 'function') d.open(trigger);
  });
})();
