/* facets.js: owned by shad-d8 (commerce). Loaded deferred on collection and search templates.
   <facets-form data-section-id> wraps snippets/facets.liquid inside a [data-facets-section] section.
   Apply (form submit), active-filter pills, "clear all", reset and pagination links ([data-facets-link] and .pagination a)
   re-render the whole section through the Section Rendering API, update the URL with history.pushState,
   and the back/forward buttons restore earlier states. Without JS everything is a plain GET form / link. */
(function () {
  'use strict';
  const theme = (window.theme = window.theme || {});
  const cache = new Map();
  let controller = null;

  const sectionEl = () => document.querySelector('[data-facets-section]');

  function urlFromForm(form) {
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(form).entries()) {
      if (value === '' || value == null) continue; // empty price inputs
      params.append(key, value);
    }
    const action = new URL(form.getAttribute('action') || window.location.pathname, window.location.origin);
    return `${action.pathname}${params.toString() ? `?${params}` : ''}`;
  }

  async function render(url, { push = true, focus = true } = {}) {
    const section = sectionEl();
    if (!section) { window.location.href = url; return; }
    const sectionId = section.dataset.facetsSection;
    const drawer = document.getElementById('facets-drawer');
    if (drawer && drawer.isOpen) drawer.close();
    const results = section.querySelector('[data-facets-results]');
    results && results.setAttribute('aria-busy', 'true');
    section.classList.add('is-loading');
    controller && controller.abort();
    controller = new AbortController();
    try {
      let html = cache.get(url);
      if (!html) {
        const u = new URL(url, window.location.origin);
        u.searchParams.set('section_id', sectionId);
        const res = await fetch(u.toString(), { signal: controller.signal, headers: { Accept: 'text/html' } });
        if (!res.ok) throw new Error(String(res.status));
        html = await res.text();
        cache.set(url, html);
      }
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const next = doc.querySelector('[data-facets-section]');
      if (!next) throw new Error('Section markup missing');
      section.replaceWith(document.importNode(next, true));
      if (push) history.pushState({ facets: true }, '', url);
      const fresh = sectionEl();
      if (focus && fresh) {
        const count = fresh.querySelector('[data-facets-count]');
        if (count) {
          count.focus({ preventScroll: true });
          theme.announce && theme.announce(count.textContent.trim());
        }
        const top = fresh.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 0);
        if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
      }
      theme.observeReveal && theme.observeReveal(fresh);
    } catch (e) {
      if (e.name === 'AbortError') return;
      console.error('[facets] render failed, falling back to navigation', e);
      window.location.href = url;
    } finally {
      const s = sectionEl();
      if (s) { s.classList.remove('is-loading'); const r = s.querySelector('[data-facets-results]'); r && r.removeAttribute('aria-busy'); }
    }
  }

  class FacetsForm extends HTMLElement {
    connectedCallback() {
      this.form = this.querySelector('form[data-facets-form]');
      if (!this.form) return;
      this._onSubmit = (e) => { e.preventDefault(); render(urlFromForm(this.form)); };
      this.form.addEventListener('submit', this._onSubmit);
    }
    disconnectedCallback() { this.form && this.form.removeEventListener('submit', this._onSubmit); }
  }
  if (!customElements.get('facets-form')) customElements.define('facets-form', FacetsForm);

  // Pills, clear all, reset and pagination inside the facets section (delegated: the section is replaced on every render).
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-facets-section] [data-facets-link], [data-facets-section] .pagination a, #facets-drawer [data-facets-link]');
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const href = link.getAttribute('href');
    if (!href) return;
    e.preventDefault();
    render(new URL(href, window.location.origin).pathname + new URL(href, window.location.origin).search);
  });

  window.addEventListener('popstate', () => {
    if (!sectionEl()) return;
    render(window.location.pathname + window.location.search, { push: false, focus: false });
  });

  // Mark the entry state so popstate back to it re-renders the section instead of being ignored.
  if (sectionEl()) history.replaceState({ facets: true }, '', window.location.href);
})();
