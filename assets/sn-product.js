/* =====================================================================
   SAKOOON · NOCTURNE — product form engine
   <div data-sn-product> … </div> used by main product, featured product
   and the sticky buy bar. No dependencies; uses window.SN when present.
   ===================================================================== */
(function () {
  'use strict';
  if (window.SNProduct) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (c) { return window.SN && SN.money ? SN.money(c) : (c / 100).toFixed(0); };

  function Product(root) {
    this.root = root;
    var j = $('[data-sn-pjson]', root);
    if (!j) return;
    try { this.p = JSON.parse(j.textContent); } catch (e) { return; }
    var inv = $('[data-sn-pinv]', root); this.inv = {};
    try { this.inv = inv ? JSON.parse(inv.textContent) : {}; } catch (e) {}
    this.form = $('form[data-sn-pform]', root) || $('[data-sn-pform]', root);
    this.idInput = $('[data-sn-pvid]', root);
    this.sel = (this.current() || this.p.variants[0]).options.slice();
    this.history = root.hasAttribute('data-history');
    this.bind(); this.paint(true);
    root.snProduct = this;
  }
  Product.prototype.current = function () {
    var id = this.idInput ? parseInt(this.idInput.value, 10) : 0;
    return this.p.variants.find(function (v) { return v.id === id; });
  };
  Product.prototype.variant = function () {
    var sel = this.sel;
    return this.p.variants.find(function (v) { return v.options.every(function (o, i) { return o === sel[i]; }); });
  };
  Product.prototype.bind = function () {
    var self = this, root = this.root;
    root.addEventListener('change', function (e) {
      var t = e.target;
      if (t.matches('[data-sn-opt-i]')) { self.sel[+t.getAttribute('data-sn-opt-i')] = t.value; self.paint(); }
      else if (t.matches('select[data-sn-opt-sel]')) { self.sel[+t.getAttribute('data-sn-opt-sel')] = t.value; self.paint(); }
    });
    root.addEventListener('click', function (e) {
      var q = e.target.closest('[data-sn-q]');
      if (q && root.contains(q)) { e.preventDefault(); var inp = $('[data-sn-pqty]', root); if (inp) { inp.value = Math.max(1, (parseInt(inp.value, 10) || 1) + parseInt(q.getAttribute('data-sn-q'), 10)); inp.dispatchEvent(new Event('change', { bubbles: true })); } }
      var th = e.target.closest('[data-sn-thumb]');
      if (th && root.contains(th)) { e.preventDefault(); self.showMedia(th.getAttribute('data-sn-thumb'), true); }
    });
    if (this.form) this.form.addEventListener('submit', function (e) {
      if (document.body.getAttribute('data-cart') === 'page' && !root.hasAttribute('data-ajax')) return;
      e.preventDefault(); self.add();
    });
    var g = $('[data-sn-gallery]', root);
    if (g) {
      var track = $('[data-sn-track]', g);
      if (track) {
        var tk = false;
        track.addEventListener('scroll', function () {
          if (tk) return; tk = true;
          requestAnimationFrame(function () {
            tk = false;
            var w = track.clientWidth, i = Math.round(track.scrollLeft / Math.max(1, w)), sl = $$('[data-sn-slide]', track)[i];
            if (sl) self.markThumb(sl.getAttribute('data-sn-slide'));
            var bar = $('[data-sn-gprog]', g); if (bar) { var n = $$('[data-sn-slide]', track).length; bar.style.width = (100 / n) + '%'; bar.style.left = (i / n * 100) + '%'; }
          });
        }, { passive: true });
      }
      $$('[data-sn-gnav]', g).forEach(function (b) { b.addEventListener('click', function () { var tr = $('[data-sn-track]', g); tr.scrollBy({ left: tr.clientWidth * parseInt(b.getAttribute('data-sn-gnav'), 10), behavior: 'smooth' }); }); });
    }
  };
  Product.prototype.markThumb = function (id) { $$('[data-sn-thumb]', this.root).forEach(function (t) { var on = t.getAttribute('data-sn-thumb') === String(id); t.classList.toggle('is-on', on); if (on && t.parentNode.scrollTo) { var p = t.parentNode; p.scrollTo({ left: t.offsetLeft - p.clientWidth / 2 + t.offsetWidth / 2, top: t.offsetTop - p.clientHeight / 2 + t.offsetHeight / 2, behavior: 'smooth' }); } }); };
  Product.prototype.showMedia = function (id, user) {
    var root = this.root, sl = $('[data-sn-slide="' + id + '"]', root); if (!sl) return;
    var track = sl.closest('[data-sn-track]');
    var stacked = track && getComputedStyle(track).overflowX === 'visible';
    if (track && !stacked) track.scrollTo({ left: sl.offsetLeft - track.offsetLeft, behavior: user ? 'smooth' : 'auto' });
    else if (user) sl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    $$('[data-sn-slide]', root).forEach(function (s) { s.classList.toggle('is-on', s === sl); });
    this.markThumb(id);
  };
  Product.prototype.avail = function (idx, value) {
    var sel = this.sel.slice(); sel[idx] = value;
    var exists = false, avail = false;
    this.p.variants.forEach(function (v) {
      var ok = v.options.every(function (o, i) { return i > idx ? true : o === sel[i]; });
      if (ok) { exists = true; if (v.available) avail = true; }
    });
    return exists ? (avail ? 1 : 0) : -1;
  };
  Product.prototype.paint = function (first) {
    var self = this, root = this.root, v = this.variant();
    // option states
    $$('[data-sn-opt-i]', root).forEach(function (inp) {
      var i = +inp.getAttribute('data-sn-opt-i'), st = self.avail(i, inp.value);
      inp.checked = self.sel[i] === inp.value;
      var lab = inp.closest('label') || inp.nextElementSibling;
      if (lab) { lab.classList.toggle('is-out', st === 0); lab.classList.toggle('is-none', st === -1); }
      if (inp.tagName === 'OPTION') inp.selected = self.sel[i] === inp.value;
    });
    $$('select[data-sn-opt-sel]', root).forEach(function (s) { s.value = self.sel[+s.getAttribute('data-sn-opt-sel')]; });
    $$('[data-sn-optv]', root).forEach(function (el) { el.textContent = self.sel[+el.getAttribute('data-sn-optv')] || ''; });
    var atc = $$('[data-sn-patc]', root), price = $$('[data-sn-pprice]', root), stock = $('[data-sn-pstock]', root);
    if (!v) {
      atc.forEach(function (b) { b.disabled = true; var s = $('span', b); if (s) s.textContent = (SN.t && SN.t.unavailable) || 'Unavailable'; });
      if (stock) stock.hidden = true;
      return;
    }
    if (this.idInput) this.idInput.value = v.id;
    $$('[data-sn-pvid-mirror]').forEach(function (i) { if (i.closest('[data-sn-product]') === root || i.getAttribute('data-for') === root.id) i.value = v.id; });
    var sale = v.compare_at_price > v.price;
    price.forEach(function (p) {
      var pct = sale ? Math.round((v.compare_at_price - v.price) * 100 / v.compare_at_price) : 0;
      p.innerHTML = '<span class="sn-price__now' + (sale ? ' is-sale' : '') + '">' + money(v.price) + '</span>' + (sale ? '<s class="sn-price__was">' + money(v.compare_at_price) + '</s><span class="sn-badge sn-badge--sale">−' + pct + '%</span>' : '');
      if (!first) { p.classList.remove('is-tick'); void p.offsetWidth; p.classList.add('is-tick'); }
    });
    atc.forEach(function (b) { b.disabled = !v.available; var s = $('span', b); if (s) s.textContent = v.available ? (b.getAttribute('data-label') || 'Add to cart') : (b.getAttribute('data-sold') || 'Sold out'); });
    $$('[data-sn-buynow]', root).forEach(function (b) { b.hidden = !v.available; });
    if (stock) {
      var q = this.inv[v.id], low = parseInt(stock.getAttribute('data-low') || '5', 10);
      stock.hidden = false; stock.classList.remove('is-low', 'is-out');
      var txt = stock.getAttribute('data-in');
      if (!v.available) { txt = stock.getAttribute('data-out'); stock.classList.add('is-out'); }
      else if (typeof q === 'number' && q > 0 && q <= low) { txt = stock.getAttribute('data-lowtxt').replace('[n]', q); stock.classList.add('is-low'); }
      $('[data-sn-pstock-t]', stock).textContent = txt;
      var bar = $('[data-sn-pstock-b]', stock); if (bar) bar.style.width = (!v.available ? 0 : (typeof q === 'number' && q > 0 ? Math.min(100, q / (low * 3) * 100) : 100)) + '%';
    }
    var sku = $('[data-sn-psku]', root); if (sku) sku.textContent = v.sku || '';
    if (v.featured_media && !first) this.showMedia(v.featured_media.id);
    if (!first && this.history && history.replaceState) { var u = new URL(location.href); u.searchParams.set('variant', v.id); history.replaceState({}, '', u.toString()); }
    root.dispatchEvent(new CustomEvent('sn:variant', { bubbles: true, detail: v }));
  };
  Product.prototype.add = function () {
    var v = this.variant(); if (!v || !v.available) return;
    var root = this.root, btns = $$('[data-sn-patc]', root), qty = $('[data-sn-pqty]', root);
    var props = {};
    $$('[name^="properties["]', root).forEach(function (i) { if ((i.type === 'checkbox' || i.type === 'radio') && !i.checked) return; if (i.value) props[i.name.slice(11, -1)] = i.value; });
    btns.forEach(function (b) { b.classList.add('is-busy'); });
    var item = { id: v.id, quantity: qty ? Math.max(1, parseInt(qty.value, 10) || 1) : 1 };
    if (Object.keys(props).length) item.properties = props;
    var fly = $('[data-sn-slide].is-on img, [data-sn-slide] img', root);
    SN.cart.add([item]).then(function () { if (fly) Product.fly(fly); }).catch(function () {}).then(function () { btns.forEach(function (b) { b.classList.remove('is-busy'); }); });
  };
  /* a soft "thread" flight of the image to the cart icon */
  Product.fly = function (img) {
    if (document.body.getAttribute('data-motion') === 'off') return;
    var to = document.querySelector('[data-sn-cart-icon]') || document.querySelector('[data-sn-cart-count]'); if (!to) return;
    var a = img.getBoundingClientRect(), b = to.getBoundingClientRect(); if (!a.width) return;
    var c = img.cloneNode(); c.removeAttribute('srcset');
    c.style.cssText = 'position:fixed;z-index:2147483600;left:' + a.left + 'px;top:' + a.top + 'px;width:' + a.width + 'px;height:' + a.height + 'px;object-fit:cover;border-radius:24px;pointer-events:none;box-shadow:0 30px 60px -20px rgba(0,0,0,.5)';
    document.body.appendChild(c);
    var dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    c.animate([{ transform: 'none', opacity: 1, borderRadius: '24px' }, { transform: 'translate(' + dx * .5 + 'px,' + (dy * .5 - 80) + 'px) scale(.45) rotate(-8deg)', opacity: .9, borderRadius: '50%' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.05)', opacity: 0, borderRadius: '50%' }], { duration: 900, easing: 'cubic-bezier(.5,0,.2,1)' }).onfinish = function () { c.remove(); };
  };
  window.SNProduct = { init: function (scope) { $$('[data-sn-product]', scope || document).forEach(function (r) { if (!r.snProduct) new Product(r); }); }, Product: Product };
  function go() { SNProduct.init(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
  document.addEventListener('shopify:section:load', function (e) { SNProduct.init(e.target); });
})();
