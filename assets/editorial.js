/* editorial.js: owned by shad-8b (editorial). Loaded deferred from layout/theme.liquid.
   Custom elements for editorial sections. Each initialises in connectedCallback and cleans up in
   disconnectedCallback so theme-editor section reloads work. */
(() => {
  /* ---------- <guide-anchor-nav> ----------
     Builds its link list from [data-anchor-target] headings when it has no link blocks (data-auto="true"),
     then marks the link whose target is in view with aria-current="true". */
  class GuideAnchorNav extends HTMLElement {
    connectedCallback() {
      this.list = this.querySelector('.guide-anchor-nav__list');
      if (!this.list) return;
      if (this.dataset.auto === 'true') this.build();
      this.links = Array.from(this.list.querySelectorAll('a[href^="#"]'));
      this.toggleAttribute('data-empty', this.links.length === 0);
      if (!this.links.length) return;
      this.targets = this.links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
      this.observe();
      this._onClick = (e) => {
        const a = e.target.closest('a[href^="#"]'); if (!a) return;
        this.setCurrent(a);
      };
      this.list.addEventListener('click', this._onClick);
    }
    disconnectedCallback() {
      if (this.io) this.io.disconnect();
      if (this.list && this._onClick) this.list.removeEventListener('click', this._onClick);
    }
    build() {
      this.list.textContent = '';
      document.querySelectorAll('[data-anchor-target][id]').forEach((h) => {
        if (this.contains(h)) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = 'guide-anchor-nav__link';
        a.href = `#${h.id}`;
        a.textContent = (h.dataset.anchorLabel || h.textContent).trim();
        li.append(a);
        this.list.append(li);
      });
    }
    observe() {
      if (!('IntersectionObserver' in window)) return;
      const visible = new Map();
      this.io = new IntersectionObserver((entries) => {
        entries.forEach((en) => visible.set(en.target, en.isIntersecting));
        const current = this.targets.find((t) => visible.get(t));
        if (current) this.setCurrent(this.links.find((a) => decodeURIComponent(a.hash.slice(1)) === current.id));
      }, { rootMargin: '-20% 0px -65% 0px' });
      this.targets.forEach((t) => this.io.observe(t));
    }
    setCurrent(link) {
      if (!link || link === this.current) return;
      this.links.forEach((a) => a.removeAttribute('aria-current'));
      link.setAttribute('aria-current', 'true');
      this.current = link;
      // Keep the active link visible in the horizontally scrolling list without moving the page.
      const l = this.list, r = link.getBoundingClientRect(), lr = l.getBoundingClientRect();
      if (r.left < lr.left || r.right > lr.right) l.scrollTo({ left: l.scrollLeft + (r.left - lr.left) - 16, behavior: 'smooth' });
    }
  }
  if (!customElements.get('guide-anchor-nav')) customElements.define('guide-anchor-nav', GuideAnchorNav);

  /* --ed-sticky-offset: how far the site header currently covers the top of the viewport (0 when it has
     scrolled away or hides on scroll), so sticky editorial bars and anchor targets sit just below it. */
  let ticking = false;
  const setStickyOffset = () => {
    ticking = false;
    const header = document.querySelector('.header, [data-header]');
    const bottom = header ? Math.max(0, Math.round(header.getBoundingClientRect().bottom)) : 0;
    document.documentElement.style.setProperty('--ed-sticky-offset', `${bottom}px`);
    // Anchor targets need a scroll-independent offset: the header only counts if it really sticks
    // (fixed, or sticky inside a parent taller than itself), plus the sticky nav and a little air.
    let headerOffset = 0;
    if (header) {
      const pos = getComputedStyle(header).position;
      if (pos === 'fixed' || (pos === 'sticky' && header.parentElement && header.parentElement.offsetHeight > header.offsetHeight + 1)) headerOffset = header.offsetHeight;
    }
    const nav = document.querySelector('.section-guide-anchor-nav');
    // A sidebar nav sits beside the content on desktop, so it only adds to the offset when it is the mobile chip row.
    const besideContent = nav && nav.querySelector('.guide-anchor-nav--sidebar') && window.matchMedia('(min-width: 1024px)').matches;
    document.documentElement.style.setProperty('--ed-anchor-offset', `${headerOffset + (nav && !besideContent ? nav.offsetHeight : 0) + 24}px`);
  };
  const requestOffset = () => { if (!ticking) { ticking = true; requestAnimationFrame(setStickyOffset); } };
  /* Sidebar nav: its section takes no vertical space on desktop (margin-bottom: -height in editorial.css). */
  const sidebar = document.querySelector('.guide-anchor-nav--sidebar');
  if (sidebar && sidebar.parentElement) {
    const host = sidebar.parentElement;
    const setSidebarHeight = () => host.style.setProperty('--ed-sidebar-h', `${host.offsetHeight}px`);
    setSidebarHeight();
    if ('ResizeObserver' in window) new ResizeObserver(setSidebarHeight).observe(host);
  }
  if (document.querySelector('.section-guide-anchor-nav, [data-anchor-target]')) {
    setStickyOffset();
    window.addEventListener('scroll', requestOffset, { passive: true });
    window.addEventListener('resize', requestOffset);
  }

  /* ---------- <fabric-guide> ----------
     Filter chips (aria-pressed) show only cards whose data-weave / data-fibre matches. */
  class FabricGuide extends HTMLElement {
    connectedCallback() {
      this.chips = Array.from(this.querySelectorAll('[data-filter]'));
      if (!this.chips.length) return;
      this.attr = this.dataset.filterBy === 'fibre' ? 'fibre' : 'weave';
      this.empty = this.querySelector('.fabric-guide__empty');
      this._onClick = (e) => { const chip = e.target.closest('[data-filter]'); if (chip) this.apply(chip); };
      this.addEventListener('click', this._onClick);
    }
    disconnectedCallback() { if (this._onClick) this.removeEventListener('click', this._onClick); }
    apply(chip) {
      const value = chip.dataset.filter;
      this.chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      let shown = 0;
      this.querySelectorAll('.fabric-guide__item').forEach((item) => {
        const card = item.matches('.fabric-panel') ? item : item.querySelector('.fabric-card');
        const match = !value || (card && card.dataset[this.attr] === value);
        item.hidden = !match;
        if (match) shown += 1;
      });
      if (this.empty) this.empty.hidden = shown > 0;
    }
  }
  if (!customElements.get('fabric-guide')) customElements.define('fabric-guide', FabricGuide);

  /* ---------- <size-guide data-size-guide> ----------
     Self-contained so commerce can inject it into a dialog. Converts every [data-cm] cell between cm and inches.
     The chosen unit persists per visitor (localStorage, best effort). */
  const UNIT_KEY = 'sakooon:size-unit';
  const toInches = (cm) => { const v = cm / 2.54; return v >= 20 ? String(Math.round(v)) : String(Math.round(v * 2) / 2); };
  class SizeGuide extends HTMLElement {
    connectedCallback() {
      this.units = this.querySelector('.size-guide__units');
      this.cells = Array.from(this.querySelectorAll('[data-cm]'));
      if (!this.units || !this.cells.length) return;
      this.units.hidden = false;
      let unit = this.dataset.defaultUnit || 'cm';
      try { unit = localStorage.getItem(UNIT_KEY) || unit; } catch (e) { /* storage unavailable */ }
      this._onChange = (e) => { if (e.target.name && e.target.name.startsWith('size-unit')) this.apply(e.target.value, true); };
      this.units.addEventListener('change', this._onChange);
      this.apply(unit, false);
    }
    disconnectedCallback() { if (this.units && this._onChange) this.units.removeEventListener('change', this._onChange); }
    apply(unit, persist) {
      this.units.querySelectorAll('input').forEach((i) => { i.checked = i.value === unit; });
      this.cells.forEach((cell) => {
        const cm = cell.dataset.cm;
        cell.textContent = unit === 'in' ? cm.replace(/\d+(?:[.,]\d+)?/g, (n) => toInches(parseFloat(n.replace(',', '.')))) : cm;
      });
      const label = this.units.querySelector(`input[value="${unit}"] + span`);
      if (label) this.querySelectorAll('[data-unit-name]').forEach((el) => { el.textContent = label.textContent; });
      if (persist) { try { localStorage.setItem(UNIT_KEY, unit); } catch (e) { /* storage unavailable */ } }
      this.dispatchEvent(new CustomEvent('size-guide:unit', { bubbles: true, detail: { unit } }));
    }
  }
  if (!customElements.get('size-guide')) customElements.define('size-guide', SizeGuide);

  /* ---------- <blog-load-more> ----------
     "Show more" is a link to the next page; with JS it fetches that page and appends its cards in place,
     then updates the count, progress bar and next link. Focus moves to the first new card. */
  class BlogLoadMore extends HTMLElement {
    connectedCallback() {
      this._onClick = (e) => { const a = e.target.closest('[data-blog-next]'); if (a) { e.preventDefault(); this.load(a); } };
      this.addEventListener('click', this._onClick);
    }
    disconnectedCallback() { this.removeEventListener('click', this._onClick); }
    async load(link) {
      if (this.busy) return; this.busy = true; link.setAttribute('aria-busy', 'true');
      try {
        const res = await fetch(link.href, { credentials: 'same-origin' });
        if (!res.ok) throw new Error(res.status);
        const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
        const incoming = doc.querySelector('blog-load-more');
        const grid = this.querySelector('[data-blog-grid]');
        const items = incoming ? Array.from(incoming.querySelectorAll('[data-blog-grid] > li')) : [];
        items.forEach((li) => grid.append(document.importNode(li, true)));
        ['[data-blog-count]', '[data-blog-progress]'].forEach((sel) => { const from = incoming && incoming.querySelector(sel), to = this.querySelector(sel); if (from && to) to.replaceWith(document.importNode(from, true)); });
        const next = incoming && incoming.querySelector('[data-blog-next]');
        if (next) link.href = next.href; else link.remove();
        const first = grid.children[grid.children.length - items.length];
        const focusable = first && first.querySelector('a');
        if (focusable) focusable.focus({ preventScroll: true });
      } catch (err) {
        window.location.href = link.href; // fall back to normal navigation
      } finally { this.busy = false; link.removeAttribute('aria-busy'); }
    }
  }
  if (!customElements.get('blog-load-more')) customElements.define('blog-load-more', BlogLoadMore);

  /* Copy-link button on articles. */
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-copy-url]'); if (!btn) return;
    try { await navigator.clipboard.writeText(btn.dataset.copyUrl); const prev = btn.textContent; btn.textContent = btn.dataset.copied; setTimeout(() => { btn.textContent = prev; }, 2000); } catch (err) { /* clipboard unavailable */ }
  });

  /* Open an accordion when the URL hash targets it (e.g. a PDP linking to /pages/faq#faq-<id>). */
  const openFromHash = () => {
    if (!location.hash) return;
    const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    const item = el && (el.matches('theme-disclosure') ? el : el.closest('theme-disclosure'));
    if (item && typeof item.set === 'function') { item.set(true); item.scrollIntoView({ block: 'start' }); }
  };
  window.addEventListener('hashchange', openFromHash);
  if (document.readyState === 'complete') openFromHash(); else window.addEventListener('load', openFromHash);
})();
