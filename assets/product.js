/* product.js: owned by shad-d8 (commerce). Loaded deferred on product templates.
   <variant-picker>: resolves the variant from the selected option values, fetches the main-product section for
     ?variant=<id> (Section Rendering API) and swaps every [data-pdp-update] region (gallery only when the colour changes),
     keeps the URL in sync (replaceState) and publishes `variant:change` { sectionId, variant, product }.
   <product-form>: add to cart through theme.cart.add (cart.js), loading/error states, `cart:updated` opens the drawer.
   <product-gallery>: scroll-snap track with arrows + counter; swipe on touch; opens the zoom dialog at the clicked image.
   <sticky-buy-bar>: shown once the main add button has scrolled out of view.
   Size guide: [data-size-guide-open] loads the guide page's [data-size-guide] into its dialog (falls back to the link). */
(function () {
  'use strict';
  const theme = (window.theme = window.theme || {});
  const sectionCache = new Map();

  /* ---------- <variant-picker> ---------- */
  class VariantPicker extends HTMLElement {
    connectedCallback() {
      this.section = this.closest('[data-product-section]');
      this.variants = JSON.parse(this.querySelector('script[data-variants]')?.textContent || '[]');
      this._onChange = (e) => { if (e.target.matches('input[type="radio"], select')) this.onOptionChange(e.target); };
      this.addEventListener('change', this._onChange);
    }
    disconnectedCallback() { this.removeEventListener('change', this._onChange); }

    selectedOptions() {
      return Array.from(this.querySelectorAll('[data-option-index]')).map((group) => {
        const checked = group.querySelector('input[type="radio"]:checked');
        if (checked) return checked.value;
        const select = group.querySelector('select');
        return select ? select.value : null;
      });
    }
    findVariant(options, changedIndex) {
      const exact = this.variants.find((v) => v.options.every((o, i) => o === options[i]));
      if (exact) return exact;
      // The combination does not exist: keep the value just chosen, prefer an available variant.
      const candidates = this.variants.filter((v) => v.options[changedIndex] === options[changedIndex]);
      return candidates.find((v) => v.available) || candidates[0] || null;
    }
    async onOptionChange(input) {
      const group = input.closest('[data-option-index]');
      const changedIndex = Number(group.dataset.optionIndex);
      const label = group.querySelector('[data-selected-value]');
      if (label) label.textContent = input.value;
      const variant = this.findVariant(this.selectedOptions(), changedIndex);
      const sectionId = this.dataset.sectionId;
      const previous = this.variants.find((v) => String(v.id) === String(this.section?.dataset.variantId));
      if (!variant) { setUnavailable(this.section); return; }
      const form = document.getElementById(this.dataset.formId);
      const idInput = form && form.querySelector('[data-variant-id]');
      if (idInput) idInput.value = variant.id;
      setBusy(this.section, true);
      try {
        await renderVariant({ section: this.section, sectionId, url: this.dataset.url, variant, previous, focusName: input.name, focusValue: input.value });
        const url = new URL(window.location.href);
        url.searchParams.set('variant', variant.id);
        history.replaceState(history.state, '', url.toString());
        theme.pubsub.publish('variant:change', { sectionId, variant, product: { url: this.dataset.url } });
      } catch (e) {
        console.error('[product] variant render failed', e);
        window.location.href = `${this.dataset.url}?variant=${variant.id}`;
      } finally {
        setBusy(document.querySelector(`[data-product-section="${sectionId}"]`), false);
      }
    }
  }
  if (!customElements.get('variant-picker')) customElements.define('variant-picker', VariantPicker);

  function setBusy(section, busy) { if (section) section.classList.toggle('is-updating', busy); }
  function setUnavailable(section) {
    if (!section) return;
    section.querySelectorAll('[data-add-button], [data-sticky-add]').forEach((b) => { b.disabled = true; });
    const label = section.querySelector('[data-add-label]');
    if (label) label.textContent = theme.strings.unavailable || '';
  }

  /** Colour of a variant = the value of the option that carries swatches (the gallery knows which colour it shows). */
  function colourChanged(section, variant) {
    const gallery = section.querySelector('product-gallery');
    if (!gallery) return true;
    const current = gallery.dataset.colour || '';
    if (!current) return false;
    return !variant.options.includes(current);
  }

  /**
   * Update the picker without replacing its nodes, so the control the shopper used keeps focus and identity
   * (screen readers do not re-announce the group). Falls back to a replace when the structure differs.
   */
  function syncInPlace(region, next) {
    const a = [region, ...region.querySelectorAll('*')];
    const b = [next, ...next.querySelectorAll('*')];
    if (a.length !== b.length || a.some((el, i) => el.tagName !== b[i].tagName)) return false;
    a.forEach((el, i) => {
      const src = b[i];
      for (const { name } of Array.from(el.attributes)) if (!src.hasAttribute(name)) el.removeAttribute(name);
      for (const { name, value } of Array.from(src.attributes)) if (el.getAttribute(name) !== value) el.setAttribute(name, value);
      if (el.tagName === 'INPUT') { el.checked = src.hasAttribute('checked'); el.disabled = src.hasAttribute('disabled'); }
      if (el.tagName === 'OPTION') { el.selected = src.hasAttribute('selected'); el.disabled = src.hasAttribute('disabled'); }
      if (!el.children.length && el.textContent !== src.textContent) el.textContent = src.textContent;
    });
    return true;
  }

  async function renderVariant({ section, sectionId, url, variant, previous, focusName, focusValue }) {
    const key = `${url}?variant=${variant.id}`;
    let doc = sectionCache.get(key);
    if (!doc) {
      const u = new URL(url, window.location.origin);
      u.searchParams.set('variant', variant.id);
      u.searchParams.set('section_id', sectionId);
      const res = await fetch(u.toString(), { headers: { Accept: 'text/html' } });
      if (!res.ok) throw new Error(String(res.status));
      doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      sectionCache.set(key, doc);
    }
    const swapGallery = colourChanged(section, variant);
    // Remember open accordions so swapping them does not collapse what the shopper opened.
    const openPanels = new Set(Array.from(section.querySelectorAll('theme-disclosure[open] [aria-controls]')).map((t) => t.getAttribute('aria-controls')));
    section.querySelectorAll('[data-pdp-update]').forEach((region) => {
      const k = region.dataset.pdpUpdate;
      if (k === 'gallery' && !swapGallery) return;
      const next = doc.querySelector(`[data-pdp-update="${CSS.escape(k)}"]`);
      if (!next) return;
      if (k === 'sticky') {
        const wasHidden = region.hidden; const fresh = document.importNode(next, true); fresh.hidden = wasHidden; region.replaceWith(fresh); return;
      }
      if (k.startsWith('picker-') && syncInPlace(region, next)) return;
      region.replaceWith(document.importNode(next, true));
    });
    if (openPanels.size) section.querySelectorAll('theme-disclosure').forEach((d) => {
      const t = d.querySelector('[aria-controls]'); if (t && openPanels.has(t.getAttribute('aria-controls')) && typeof d.set === 'function') d.set(true);
    });
    section.dataset.variantId = variant.id;
    // Keep focus on the control the shopper used (the picker was re-rendered).
    if (focusName) {
      const el = section.querySelector(`[name="${CSS.escape(focusName)}"][value="${CSS.escape(focusValue)}"]`) || section.querySelector(`select[name="${CSS.escape(focusName)}"]`);
      if (el) el.focus({ preventScroll: true });
    }
    // The zoom dialog lives outside the regions when the gallery changes; replace it too.
    if (swapGallery) {
      const zoomId = `ProductZoom-${sectionId}`;
      const oldZoom = document.getElementById(zoomId); const newZoom = doc.getElementById(zoomId);
      if (oldZoom && newZoom) oldZoom.replaceWith(document.importNode(newZoom, true));
    }
  }

  /* ---------- <product-form> ---------- */
  class ProductForm extends HTMLElement {
    connectedCallback() {
      this.form = this.querySelector('form');
      if (!this.form) return;
      this._onSubmit = this.onSubmit.bind(this);
      this.form.addEventListener('submit', this._onSubmit);
    }
    disconnectedCallback() { this.form && this.form.removeEventListener('submit', this._onSubmit); }
    async onSubmit(e) {
      if (!theme.cart || typeof theme.cart.add !== 'function') return; // cart.js missing: let the form post
      e.preventDefault();
      const buttons = [this.form.querySelector('[data-add-button]'), document.querySelector(`[data-sticky-add][form="${this.form.id}"]`)].filter(Boolean);
      if (buttons.some((b) => b.getAttribute('aria-busy') === 'true')) return;
      const error = this.form.querySelector('[data-form-error]');
      if (error) { error.hidden = true; error.textContent = ''; }
      buttons.forEach((b) => { b.setAttribute('aria-busy', 'true'); b.disabled = true; });
      try {
        await theme.cart.add(this.form, { source: 'product-form', open: true });
        theme.announce && theme.announce(theme.strings.itemAdded || '');
      } catch (err) {
        if (error) { error.textContent = err.message || theme.strings.cartError || ''; error.hidden = false; }
        theme.pubsub.publish('cart:error', { message: err.message });
      } finally {
        // Re-query: a variant change may have replaced the buttons meanwhile.
        const live = [this.form.querySelector('[data-add-button]'), document.querySelector(`[data-sticky-add][form="${this.form.id}"]`)].filter(Boolean);
        live.forEach((b) => { b.removeAttribute('aria-busy'); b.disabled = b.dataset.available !== 'true'; });
      }
    }
  }
  if (!customElements.get('product-form')) customElements.define('product-form', ProductForm);

  /* ---------- <product-gallery> ---------- */
  class ProductGallery extends HTMLElement {
    connectedCallback() {
      this.track = this.querySelector('[data-gallery-track]');
      this.prev = this.querySelector('[data-gallery-prev]');
      this.next = this.querySelector('[data-gallery-next]');
      this.counter = this.querySelector('[data-gallery-counter]');
      if (!this.track) return;
      this.slides = Array.from(this.track.children);
      this._onScroll = theme.throttle(() => this.update(), 80);
      this._onPrev = () => this.go(this.index() - 1);
      this._onNext = () => this.go(this.index() + 1);
      this._onKey = (e) => { if (e.key === 'ArrowLeft') { e.preventDefault(); this._onPrev(); } if (e.key === 'ArrowRight') { e.preventDefault(); this._onNext(); } };
      this._onZoom = (e) => { const b = e.target.closest('[data-zoom-media]'); if (b) this.openZoom(b.dataset.zoomMedia); };
      this.track.addEventListener('scroll', this._onScroll, { passive: true });
      this.track.addEventListener('keydown', this._onKey);
      this.track.addEventListener('click', this._onZoom);
      this.prev && this.prev.addEventListener('click', this._onPrev);
      this.next && this.next.addEventListener('click', this._onNext);
      this.update();
    }
    disconnectedCallback() {
      if (!this.track) return;
      this.track.removeEventListener('scroll', this._onScroll);
      this.track.removeEventListener('keydown', this._onKey);
      this.track.removeEventListener('click', this._onZoom);
      this.prev && this.prev.removeEventListener('click', this._onPrev);
      this.next && this.next.removeEventListener('click', this._onNext);
    }
    horizontal() { return this.track.scrollWidth > this.track.clientWidth + 1; }
    index() {
      if (!this.horizontal()) return 0;
      return Math.round(this.track.scrollLeft / this.track.clientWidth);
    }
    go(i) {
      const n = Math.max(0, Math.min(this.slides.length - 1, i));
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.track.scrollTo({ left: n * this.track.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
    }
    update() {
      const i = this.index();
      if (this.counter) this.counter.textContent = `${i + 1}/${this.slides.length}`;
      if (this.prev) this.prev.disabled = i <= 0;
      if (this.next) this.next.disabled = i >= this.slides.length - 1;
      this.slides.forEach((s, n) => s.toggleAttribute('inert', this.horizontal() && n !== i));
    }
    openZoom(mediaId) {
      // Zoom images ship in <template data-deferred-media> (product-gallery.liquid): swap them in on first open.
      const dialog = document.getElementById(`ProductZoom-${this.dataset.sectionId}`);
      if (dialog) dialog.querySelectorAll('template[data-deferred-media]').forEach((t) => t.replaceWith(t.content.cloneNode(true)));
      // theme-drawer delegation opens the dialog; scroll the clicked image into view once it is visible.
      requestAnimationFrame(() => {
        const item = document.querySelector(`#ProductZoom-${this.dataset.sectionId} [data-zoom-item="${mediaId}"]`);
        if (item) item.scrollIntoView({ block: 'start' });
      });
    }
  }
  if (!customElements.get('product-gallery')) customElements.define('product-gallery', ProductGallery);

  /* ---------- <sticky-buy-bar> ---------- */
  class StickyBuyBar extends HTMLElement {
    connectedCallback() {
      this.watch();
      this._onVariant = theme.pubsub.subscribe('variant:change', () => requestAnimationFrame(() => this.watch()));
    }
    disconnectedCallback() { this.observer && this.observer.disconnect(); this._onVariant && this._onVariant(); }
    watch() {
      this.observer && this.observer.disconnect();
      const target = document.querySelector(`#${CSS.escape(this.dataset.formId)} [data-add-button]`);
      if (!target || !('IntersectionObserver' in window)) return;
      this.observer = new IntersectionObserver(([entry]) => {
        // Show only after the button has scrolled above the viewport, not before reaching it.
        const past = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        this.hidden = !past;
        document.documentElement.classList.toggle('has-sticky-bar', past);
      });
      this.observer.observe(target);
    }
  }
  if (!customElements.get('sticky-buy-bar')) customElements.define('sticky-buy-bar', StickyBuyBar);

  /* ---------- Size guide dialog ---------- */
  document.addEventListener('click', async (e) => {
    const trigger = e.target.closest('[data-size-guide-open]');
    if (!trigger || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const dialog = document.getElementById(trigger.dataset.sizeGuideOpen);
    if (!dialog || typeof dialog.open !== 'function') return;
    e.preventDefault();
    dialog.open(trigger);
    const body = dialog.querySelector('[data-size-guide-body]');
    if (!body || body.dataset.loaded) { scrollToAnchor(body, trigger.dataset.sizeGuideAnchor); return; }
    try {
      const res = await fetch(trigger.dataset.sizeGuideUrl, { headers: { Accept: 'text/html' } });
      if (!res.ok) throw new Error(String(res.status));
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      const guide = doc.querySelector('[data-size-guide]');
      if (!guide) throw new Error('no [data-size-guide]');
      body.replaceChildren(document.importNode(guide, true));
      body.dataset.loaded = 'true';
      body.setAttribute('aria-busy', 'false');
      scrollToAnchor(body, trigger.dataset.sizeGuideAnchor);
    } catch (err) {
      // Could not load inline: go to the page itself.
      dialog.close();
      window.location.href = trigger.href;
    }
  });
  function scrollToAnchor(body, anchor) {
    if (!body || !anchor) return;
    const target = body.querySelector(`#${CSS.escape(anchor)}`);
    if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
})();

/* <product-recommendations>: fetch the section through the Product Recommendations API once it nears the viewport. */
(function () {
  'use strict';
  class ProductRecommendations extends HTMLElement {
    connectedCallback() {
      if (this.querySelector('[data-recommendations]') || !this.dataset.url) return;
      const load = () => {
        fetch(this.dataset.url).then((r) => (r.ok ? r.text() : '')).then((html) => {
          if (!html) return;
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const content = doc.querySelector('[data-recommendations]');
          if (content && content.querySelector('.product-card')) this.replaceChildren(document.importNode(content, true));
          else this.closest('.product-recs')?.setAttribute('hidden', '');
        }).catch(() => {});
      };
      if (!('IntersectionObserver' in window)) { load(); return; }
      this.io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { this.io.disconnect(); load(); } }, { rootMargin: '0px 0px 400px 0px' });
      this.io.observe(this);
    }
    disconnectedCallback() { this.io && this.io.disconnect(); }
  }
  if (!customElements.get('product-recommendations')) customElements.define('product-recommendations', ProductRecommendations);
})();
