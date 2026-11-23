/* =====================================================================
   SAKOOON · NOCTURNE — AJAX filters, sort, pagination, load more
   Host: [data-sn-fhost data-section="ID"] containing regions marked
   [data-sn-region="name"]. Regions are swapped from the section render.
   ===================================================================== */
(function () {
  'use strict';
  if (window.SNFacets) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var cache = {};

  function Host(h) {
    this.h = h; this.sid = h.getAttribute('data-section');
    this.bind(); this.prices(h);
  }
  Host.prototype.params = function () {
    var f = $('[data-sn-facets]', this.h) || $('[data-sn-facets]', document.getElementById('SnFilters-' + this.sid) || document);
    var p = new URLSearchParams();
    if (f) new FormData(f).forEach(function (v, k) { if (v !== '' && v != null) p.append(k, v); });
    var so = $('[data-sn-sort]', this.h); if (so) p.set('sort_by', so.value);
    return p;
  };
  Host.prototype.go = function (url, push) {
    var self = this, h = this.h;
    var u = new URL(url, location.href); u.searchParams.delete('section_id');
    var key = u.pathname + '?' + u.searchParams.toString();
    h.classList.add('is-loading');
    var fu = new URL(u); fu.searchParams.set('section_id', this.sid);
    var p = cache[key] || fetch(fu.toString()).then(function (r) { return r.text(); });
    cache[key] = p;
    p.then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      $$('[data-sn-region]', doc).forEach(function (n) {
        var name = n.getAttribute('data-sn-region');
        $$('[data-sn-region="' + name + '"]').forEach(function (cur) {
          if (name === 'filters') { /* keep open state */
            var open = $$('details[open]', cur).map(function (d) { return d.getAttribute('data-fid'); });
            cur.innerHTML = n.innerHTML;
            $$('details', cur).forEach(function (d) { if (open.indexOf(d.getAttribute('data-fid')) > -1) d.open = true; });
          } else cur.innerHTML = n.innerHTML;
        });
      });
      h.classList.remove('is-loading');
      if (push !== false) history.replaceState({}, '', key.replace(/\?$/, ''));
      self.prices(document);
      if (window.SN) { SN.reveal(h); SN.wish.paint(); }
      h.dispatchEvent(new CustomEvent('sn:facets', { bubbles: true }));
    }).catch(function () { location.href = key; });
  };
  Host.prototype.more = function (a) {
    var self = this, h = this.h, grid = $('[data-sn-grid]', h);
    a.classList.add('is-busy');
    var fu = new URL(a.href, location.href); fu.searchParams.set('section_id', this.sid);
    fetch(fu.toString()).then(function (r) { return r.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html'), ng = $('[data-sn-grid]', doc);
      if (ng && grid) { var start = grid.children.length; $$(':scope > *', ng).forEach(function (c, i) { if (c.hasAttribute('data-sn-promo')) return; c.style.setProperty('--i', i % 8); grid.appendChild(c); }); }
      var np = $('[data-sn-region="pager"]', doc), cp = $('[data-sn-region="pager"]', h); if (np && cp) cp.innerHTML = np.innerHTML;
      var nc = $('[data-sn-region="count"]', doc); if (nc) $$('[data-sn-region="count"]', h).forEach(function (c) { c.innerHTML = nc.innerHTML; });
      if (window.SN) { SN.reveal(h); SN.wish.paint(); }
      self.observe();
    }).catch(function () { location.href = a.href; });
  };
  Host.prototype.observe = function () {
    var self = this, a = $('[data-sn-more][data-auto]', this.h);
    if (!a || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); self.more(a); } }, { rootMargin: '600px 0px' });
    io.observe(a);
  };
  Host.prototype.prices = function (scope) {
    $$('[data-sn-price]:not([data-on])', scope).forEach(function (w) {
      w.setAttribute('data-on', '');
      var rmin = $('[data-sn-pr="min"]', w), rmax = $('[data-sn-pr="max"]', w), nmin = $('[data-sn-pn="min"]', w), nmax = $('[data-sn-pn="max"]', w), max = +rmax.max || 1;
      function paint() { w.style.setProperty('--a', (+rmin.value / max * 100) + '%'); w.style.setProperty('--b', (+rmax.value / max * 100) + '%'); }
      function fromRange(e) {
        if (+rmin.value > +rmax.value - 1) { if (e.target === rmin) rmin.value = +rmax.value - 1; else rmax.value = +rmin.value + 1; }
        nmin.value = +rmin.value > 0 ? rmin.value : ''; nmax.value = +rmax.value < max ? rmax.value : ''; paint();
      }
      rmin.addEventListener('input', fromRange); rmax.addEventListener('input', fromRange);
      [rmin, rmax].forEach(function (r) { r.addEventListener('change', function () { nmin.dispatchEvent(new Event('change', { bubbles: true })); }); });
      [nmin, nmax].forEach(function (n) { n.addEventListener('input', function () { rmin.value = nmin.value || 0; rmax.value = nmax.value || max; paint(); }); });
      paint();
    });
  };
  Host.prototype.bind = function () {
    var self = this, h = this.h, t = null;
    var onChange = function (e) {
      if (!e.target.closest('[data-sn-facets]') && !e.target.matches('[data-sn-sort]')) return;
      if (e.target.matches('[data-sn-pr]')) return;
      clearTimeout(t); t = setTimeout(function () { self.go(location.pathname + '?' + self.params().toString()); }, e.target.type === 'number' ? 600 : 120);
    };
    document.addEventListener('change', function (e) { if (h.contains(e.target) || (e.target.closest && e.target.closest('#SnFilters-' + self.sid))) onChange(e); });
    document.addEventListener('submit', function (e) { if (e.target.matches('[data-sn-facets]') && (h.contains(e.target) || e.target.closest('#SnFilters-' + self.sid))) { e.preventDefault(); self.go(location.pathname + '?' + self.params().toString()); } });
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-sn-flink]');
      if (a && (h.contains(a) || a.closest('#SnFilters-' + self.sid))) { e.preventDefault(); self.go(a.href); if (a.closest('[data-sn-region="pager"]')) h.scrollIntoView({ behavior: 'smooth' }); return; }
      var m = e.target.closest('[data-sn-more]'); if (m && h.contains(m)) { e.preventDefault(); self.more(m); return; }
      var c = e.target.closest('[data-sn-cols]');
      if (c && h.contains(c)) { var n = c.getAttribute('data-sn-cols'); $$('[data-sn-cols]', h).forEach(function (x) { x.classList.toggle('is-on', x === c); }); var g = $('[data-sn-grid]', h); g.classList.add('is-swap'); setTimeout(function () { g.style.setProperty('--cols', n); g.classList.remove('is-swap'); }, 220); try { localStorage.setItem('sakooon:cols', n); } catch (er) {} }
    });
    try { var sc = localStorage.getItem('sakooon:cols'), btn = sc && $('[data-sn-cols="' + sc + '"]', h); if (btn && innerWidth > 989) btn.click(); } catch (er) {}
    this.observe();
  };
  window.SNFacets = { init: function (scope) { $$('[data-sn-fhost]:not([data-on])', scope || document).forEach(function (h) { h.setAttribute('data-on', ''); new Host(h); }); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { SNFacets.init(); }); else SNFacets.init();
  document.addEventListener('shopify:section:load', function (e) { SNFacets.init(e.target); });
})();
