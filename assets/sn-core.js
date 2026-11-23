/* =====================================================================
   SAKOOON · NOCTURNE — core engine (no dependencies)
   reveal · dream text · rails · tabs · overlays · cart · wishlist ·
   quick view · predictive search · countdown · moon scroll · feathers
   ===================================================================== */
(function () {
  'use strict';
  var SN = window.SN = window.SN || {};
  var body = document.body;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var motion = function () { return body.getAttribute('data-motion') !== 'off' && !reduce; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  SN.$ = $; SN.$$ = $$;
  var root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
  SN.root = root;

  /* ---------------- money ---------------- */
  SN.money = function (cents) {
    var fmt = SN.moneyFormat || 'Rs.{{amount_no_decimals}}';
    var n = (cents || 0) / 100;
    var whole = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var dec = n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return fmt.replace(/\{\{\s*amount_no_decimals\s*\}\}/, whole).replace(/\{\{\s*amount\s*\}\}/, dec).replace(/\{\{\s*amount_with_comma_separator\s*\}\}/, dec.replace('.', ','));
  };
  SN.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  SN.img = function (src, w) { if (!src) return ''; return src.replace(/(\.[a-z]+)(\?|$)/i, '$1$2').split('?')[0] + '?width=' + (w || 600); };

  /* ---------------- dream split text ---------------- */
  function split(el) {
    if (el.dataset.snSplitDone) return; el.dataset.snSplitDone = '1';
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'sn-w';
            var s = document.createElement('span'); s.style.setProperty('--wi', i++); s.textContent = p;
            w.appendChild(s); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !n.classList.contains('sn-w')) walk(n);
      });
    })(el);
  }

  /* ---------------- reveal ---------------- */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -7% 0px', threshold: 0.06 }) : null;
  SN.reveal = function (scope) {
    $$('[data-sn-split]', scope).forEach(split);
    var els = $$('[data-r]:not(.is-in), [data-sn-split]:not(.is-in), .sn-sheen:not(.is-in)', scope);
    if (!io || !motion()) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    els.forEach(function (e) { io.observe(e); });
  };

  /* ---------------- rails (drag + arrows + progress) ---------------- */
  SN.rail = function (scope) {
    $$('[data-sn-rail]:not([data-sn-rail-on])', scope).forEach(function (r) {
      r.setAttribute('data-sn-rail-on', '');
      var wrap = r.closest('[data-sn-railwrap]') || r.parentNode;
      var bar = $('[data-sn-prog]', wrap);
      function step() { var c = r.firstElementChild; return c ? c.getBoundingClientRect().width + (parseFloat(getComputedStyle(r).columnGap) || 20) : 300; }
      function prog() {
        if (!bar) return;
        var max = r.scrollWidth - r.clientWidth, w = Math.max(10, r.clientWidth / Math.max(r.scrollWidth, 1) * 100);
        bar.style.width = w + '%'; bar.style.left = (max > 0 ? r.scrollLeft / max * (100 - w) : 0) + '%';
      }
      r.addEventListener('scroll', prog, { passive: true }); window.addEventListener('resize', prog); setTimeout(prog, 200);
      $$('[data-sn-prev]', wrap).forEach(function (b) { b.addEventListener('click', function () { r.scrollBy({ left: -step(), behavior: 'smooth' }); }); });
      $$('[data-sn-next]', wrap).forEach(function (b) { b.addEventListener('click', function () { r.scrollBy({ left: step(), behavior: 'smooth' }); }); });
      var down = false, x0 = 0, s0 = 0, moved = false;
      r.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.button) return; down = true; moved = false; x0 = e.clientX; s0 = r.scrollLeft; });
      window.addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - x0; if (Math.abs(dx) > 6) { moved = true; r.classList.add('is-drag'); } if (moved) r.scrollLeft = s0 - dx; });
      window.addEventListener('pointerup', function () { if (!down) return; down = false; setTimeout(function () { r.classList.remove('is-drag'); }, 30); });
      r.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
      var auto = parseFloat(r.getAttribute('data-sn-auto')) || 0;
      if (auto > 0 && motion()) {
        var hov = false; r.addEventListener('mouseenter', function () { hov = true; }); r.addEventListener('mouseleave', function () { hov = false; });
        setInterval(function () { if (hov || down || document.hidden) return; var max = r.scrollWidth - r.clientWidth - 4; if (r.scrollLeft >= max) r.scrollTo({ left: 0, behavior: 'smooth' }); else r.scrollBy({ left: step(), behavior: 'smooth' }); }, auto * 1000);
      }
    });
  };

  /* ---------------- tabs pill ---------------- */
  SN.pill = function (tabs) {
    var p = $('.sn-tabs__pill', tabs), on = $('.is-on', tabs);
    if (!p || !on) return;
    p.style.left = on.offsetLeft + 'px'; p.style.width = on.offsetWidth + 'px';
  };
  SN.tabs = function (scope) {
    $$('[data-sn-tabs]:not([data-sn-tabs-on])', scope).forEach(function (t) {
      t.setAttribute('data-sn-tabs-on', '');
      var host = t.closest('[data-sn-tabhost]') || t.parentNode;
      var btns = $$('button[data-tab]', t);
      btns.forEach(function (b) {
        b.addEventListener('click', function () {
          btns.forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-selected', x === b); });
          $$('[data-panel]', host).forEach(function (p) {
            var on = p.getAttribute('data-panel') === b.getAttribute('data-tab');
            p.hidden = !on; if (on) { p.classList.remove('is-in'); SN.reveal(p); requestAnimationFrame(function () { $$('[data-r]', p).forEach(function (x) { x.classList.add('is-in'); }); }); }
          });
          SN.pill(t);
          t.dispatchEvent(new CustomEvent('sn:tab', { bubbles: true, detail: b.getAttribute('data-tab') }));
        });
      });
      SN.pill(t); window.addEventListener('resize', function () { SN.pill(t); });
      setTimeout(function () { SN.pill(t); }, 400);
    });
  };

  /* ---------------- overlays ---------------- */
  var openOv = null, lastFocus = null;
  SN.open = function (id) {
    var ov = typeof id === 'string' ? document.getElementById(id) : id;
    if (!ov) return;
    if (openOv && openOv !== ov) SN.close(openOv, true);
    lastFocus = document.activeElement;
    ov.hidden = false; ov.removeAttribute('hidden');
    requestAnimationFrame(function () { ov.classList.add('is-open'); });
    document.documentElement.classList.add('sn-lock'); openOv = ov;
    var f = ov.querySelector('[autofocus], input:not([type=hidden]), button, a[href]');
    setTimeout(function () { if (f) f.focus({ preventScroll: true }); }, 350);
    ov.dispatchEvent(new CustomEvent('sn:open', { bubbles: true }));
  };
  SN.close = function (ov, keep) {
    ov = ov || openOv; if (!ov) return;
    ov.classList.remove('is-open');
    if (!keep) document.documentElement.classList.remove('sn-lock');
    if (openOv === ov) openOv = null;
    if (lastFocus && lastFocus.focus && !keep) lastFocus.focus({ preventScroll: true });
  };
  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-sn-open]');
    if (o) { e.preventDefault(); SN.open(o.getAttribute('data-sn-open')); return; }
    var c = e.target.closest('[data-sn-close]');
    if (c) { e.preventDefault(); SN.close(c.closest('.sn-ov')); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openOv) SN.close(); });

  /* ---------------- toast ---------------- */
  var toastEl = null, toastT = null;
  SN.toast = function (msg, icon) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'sn-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.innerHTML = '<i>' + (SN.icons[icon || 'check'] || '') + '</i><span>' + SN.esc(msg) + '</span>';
    requestAnimationFrame(function () { toastEl.classList.add('is-on'); });
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2600);
  };
  var I = function (d) { return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  SN.icons = {
    check: I('<path d="m5 12 5 5 9-10"/>'), heart: I('<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11Z"/>'),
    close: I('<path d="M6 6l12 12M18 6 6 18"/>'), plus: I('<path d="M12 5v14M5 12h14"/>'), minus: I('<path d="M5 12h14"/>'),
    bag: I('<path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'), arrow: I('<path d="M4 12h16M14 6l6 6-6 6"/>'),
    search: I('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>')
  };

  /* ---------------- cart ---------------- */
  SN.cart = {
    count: function (n) { $$('[data-sn-cart-count]').forEach(function (el) { el.textContent = n; el.classList.toggle('is-empty', !n); el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump'); }); },
    refresh: function (open) {
      return fetch(root + '?section_id=sn-cart-drawer').then(function (r) { return r.text(); }).then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var fresh = doc.querySelector('[data-sn-cart-inner]'), cur = $('[data-sn-cart-inner]');
        if (fresh && cur) { cur.innerHTML = fresh.innerHTML; SN.reveal(cur); }
        var c = doc.querySelector('[data-sn-cart-total-count]');
        if (c) SN.cart.count(parseInt(c.getAttribute('data-sn-cart-total-count'), 10) || 0);
        document.dispatchEvent(new CustomEvent('sn:cart:updated'));
        if (open && body.getAttribute('data-cart') !== 'page' && document.getElementById('SnCart')) SN.open('SnCart');
        else if (open && body.getAttribute('data-cart') === 'page') SN.toast(SN.t.added || 'Added to your cart', 'bag');
      });
    },
    add: function (items, open) {
      return fetch(root + 'cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ items: items }) })
        .then(function (r) { return r.json().then(function (d) { if (!r.ok) throw d; return d; }); })
        .then(function (d) { return SN.cart.refresh(open !== false).then(function () { return d; }); })
        .catch(function (err) { SN.toast((err && (err.description || err.message)) || 'Could not add to cart', 'close'); throw err; });
    },
    change: function (line, qty) {
      return fetch(root + 'cart/change.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ line: line, quantity: qty }) })
        .then(function (r) { return r.json(); }).then(function () { return SN.cart.refresh(false); });
    }
  };
  SN.addToCart = function (items) { return SN.cart.add(items, true); };
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-sn-add]');
    if (a) {
      e.preventDefault(); a.classList.add('is-busy');
      SN.cart.add([{ id: parseInt(a.getAttribute('data-sn-add'), 10), quantity: parseInt(a.getAttribute('data-qty') || '1', 10) }]).catch(function () {}).then(function () { a.classList.remove('is-busy'); });
      return;
    }
    var q = e.target.closest('[data-sn-line-qty]');
    if (q) {
      e.preventDefault();
      var line = parseInt(q.getAttribute('data-line'), 10), to = parseInt(q.getAttribute('data-sn-line-qty'), 10);
      var row = q.closest('[data-sn-line]'); if (row) row.classList.add('is-busy');
      SN.cart.change(line, Math.max(0, to)).then(function () { if (body.getAttribute('data-template') === 'cart') location.reload(); });
    }
  });

  /* ---------------- wishlist ---------------- */
  var WK = 'sakooon:wish';
  SN.wish = {
    get: function () { try { return JSON.parse(localStorage.getItem(WK)) || []; } catch (e) { return []; } },
    set: function (a) { try { localStorage.setItem(WK, JSON.stringify(a)); } catch (e) {} SN.wish.paint(); },
    has: function (h) { return SN.wish.get().indexOf(h) > -1; },
    toggle: function (h) { var a = SN.wish.get(), i = a.indexOf(h); if (i > -1) a.splice(i, 1); else a.unshift(h); SN.wish.set(a.slice(0, 60)); return i < 0; },
    paint: function () {
      var a = SN.wish.get();
      $$('[data-sn-wish]').forEach(function (b) { var on = a.indexOf(b.getAttribute('data-sn-wish')) > -1; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
      $$('[data-sn-wish-count]').forEach(function (el) { el.textContent = a.length; el.classList.toggle('is-empty', !a.length); });
    }
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-sn-wish]'); if (!b) return;
    e.preventDefault();
    var on = SN.wish.toggle(b.getAttribute('data-sn-wish'));
    b.animate && b.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 450, easing: 'cubic-bezier(.3,1.5,.5,1)' });
    SN.toast(on ? (SN.t.wishAdd || 'Saved to your wishlist') : (SN.t.wishRemove || 'Removed from wishlist'), 'heart');
  });

  /* ---------------- recently viewed ---------------- */
  var RK = 'sakooon:recent';
  SN.recent = { get: function () { try { return JSON.parse(localStorage.getItem(RK)) || []; } catch (e) { return []; } } };
  var ph = body.getAttribute('data-product-handle');
  if (ph) { var ra = SN.recent.get().filter(function (h) { return h !== ph; }); ra.unshift(ph); try { localStorage.setItem(RK, JSON.stringify(ra.slice(0, 16))); } catch (e) {} }

  /* ---------------- product json + simple card (wishlist, recent, quick view) ---------------- */
  var pcache = {};
  SN.product = function (h) { if (!pcache[h]) pcache[h] = fetch(root + 'products/' + h + '.js').then(function (r) { if (!r.ok) throw r; return r.json(); }); return pcache[h]; };
  SN.cardHTML = function (p) {
    var v = p.variants[0], img = p.featured_image ? SN.img(p.featured_image, 700) : '', img2 = p.images && p.images[1] ? SN.img(p.images[1], 700) : '';
    var sale = p.compare_at_price > p.price;
    return '<article class="sn-card"><div class="sn-card__stage">' +
      '<a class="sn-card__media" href="' + p.url + '">' + (img ? '<img src="' + img + '" alt="' + SN.esc(p.title) + '" loading="lazy">' : '') + (img2 ? '<img class="sn-card__b" src="' + img2 + '" alt="" loading="lazy">' : '') + '</a>' +
      '<div class="sn-card__badges">' + (sale ? '<span class="sn-badge sn-badge--sale">' + (SN.t.sale || 'Sale') + '</span>' : '') + (!p.available ? '<span class="sn-badge sn-badge--out">' + (SN.t.soldOut || 'Sold out') + '</span>' : '') + '</div>' +
      '<button type="button" class="sn-card__wish" data-sn-wish="' + p.handle + '" aria-label="Wishlist">' + SN.icons.heart + '</button>' +
      '<button type="button" class="sn-card__quick" data-sn-quick="' + p.handle + '">' + SN.icons.plus + '<span>' + (SN.t.quick || 'Quick add') + '</span></button></div>' +
      '<div class="sn-card__info"><h3 class="sn-card__title"><a href="' + p.url + '">' + SN.esc(p.title) + '</a></h3>' +
      '<div class="sn-card__price sn-price"><span class="sn-price__now' + (sale ? ' is-sale' : '') + '">' + (p.price_varies ? '<span class="sn-price__from">' + (SN.t.from || 'From') + '</span> ' : '') + SN.money(p.price) + '</span>' + (sale ? '<s class="sn-price__was">' + SN.money(p.compare_at_price) + '</s>' : '') + '</div></div></article>';
  };

  /* ---------------- quick view ---------------- */
  SN.quick = function (handle) {
    var ov = document.getElementById('SnQuick'); if (!ov) { location.href = root + 'products/' + handle; return; }
    var box = $('[data-sn-quick-body]', ov); box.innerHTML = '<div class="snq__load"><span></span></div>';
    SN.open(ov);
    SN.product(handle).then(function (p) {
      var opts = p.options || [], sel = (p.variants.find(function (v) { return v.available; }) || p.variants[0]).options.slice();
      var imgs = (p.images || []).slice(0, 6);
      function variant() { return p.variants.find(function (v) { return v.options.every(function (o, i) { return o === sel[i]; }); }); }
      var html = '<div class="snq__gal"><div class="snq__main sn-media">' + (imgs[0] ? '<img src="' + SN.img(imgs[0], 900) + '" alt="" data-snq-img>' : '') + '</div>' +
        (imgs.length > 1 ? '<div class="snq__thumbs">' + imgs.map(function (s, i) { return '<button type="button" class="' + (i ? '' : 'is-on') + '" data-snq-th="' + SN.img(s, 900) + '"><img src="' + SN.img(s, 160) + '" alt=""></button>'; }).join('') + '</div>' : '') + '</div>' +
        '<div class="snq__info"><p class="sn-eyebrow">' + SN.esc(p.vendor || '') + '</p><h2 class="sn-h sn-h--m">' + SN.esc(p.title) + '</h2><div class="sn-price snq__price" data-snq-price></div>';
      if (!(opts.length === 1 && p.variants.length === 1)) {
        opts.forEach(function (o, i) {
          var name = o.name || o, values = o.values || [];
          html += '<div class="snq__opt"><p>' + SN.esc(name) + ': <b data-snq-optv="' + i + '">' + SN.esc(sel[i]) + '</b></p><div>' + values.map(function (v) { return '<button type="button" class="sn-chip' + (v === sel[i] ? ' is-on' : '') + '" data-snq-o="' + i + '" data-v="' + SN.esc(v) + '">' + SN.esc(v) + '</button>'; }).join('') + '</div></div>';
        });
      }
      html += '<div class="snq__buy"><div class="sn-qty"><button type="button" data-snq-q="-1" aria-label="-">' + SN.icons.minus + '</button><input type="number" value="1" min="1" data-snq-qty aria-label="Quantity"><button type="button" data-snq-q="1" aria-label="+">' + SN.icons.plus + '</button></div><button type="button" class="sn-btn sn-btn--gold" data-snq-add><span>' + (SN.t.add || 'Add to cart') + '</span></button></div>' +
        '<a class="sn-link" href="' + p.url + '">' + (SN.t.details || 'View full details') + SN.icons.arrow + '</a></div>';
      box.innerHTML = html;
      function paint() {
        var v = variant(), pr = $('[data-snq-price]', box), add = $('[data-snq-add]', box);
        if (!v) { add.disabled = true; $('span', add).textContent = SN.t.unavailable || 'Unavailable'; return; }
        pr.innerHTML = '<span class="sn-price__now' + (v.compare_at_price > v.price ? ' is-sale' : '') + '">' + SN.money(v.price) + '</span>' + (v.compare_at_price > v.price ? '<s class="sn-price__was">' + SN.money(v.compare_at_price) + '</s>' : '');
        add.disabled = !v.available; $('span', add).textContent = v.available ? (SN.t.add || 'Add to cart') : (SN.t.soldOut || 'Sold out');
        if (v.featured_image) { var im = $('[data-snq-img]', box); if (im) im.src = SN.img(v.featured_image.src, 900); }
      }
      paint();
      box.addEventListener('click', function (e) {
        var o = e.target.closest('[data-snq-o]');
        if (o) { var i = +o.getAttribute('data-snq-o'); sel[i] = o.getAttribute('data-v'); $$('[data-snq-o="' + i + '"]', box).forEach(function (b) { b.classList.toggle('is-on', b === o); }); var lb = $('[data-snq-optv="' + i + '"]', box); if (lb) lb.textContent = sel[i]; paint(); }
        var th = e.target.closest('[data-snq-th]');
        if (th) { $('[data-snq-img]', box).src = th.getAttribute('data-snq-th'); $$('[data-snq-th]', box).forEach(function (b) { b.classList.toggle('is-on', b === th); }); }
        var qq = e.target.closest('[data-snq-q]');
        if (qq) { var inp = $('[data-snq-qty]', box); inp.value = Math.max(1, (+inp.value || 1) + (+qq.getAttribute('data-snq-q'))); }
        var ad = e.target.closest('[data-snq-add]');
        if (ad) { var v = variant(); if (!v) return; ad.classList.add('is-busy'); SN.cart.add([{ id: v.id, quantity: +$('[data-snq-qty]', box).value || 1 }]).catch(function () {}).then(function () { ad.classList.remove('is-busy'); }); }
      });
    }).catch(function () { location.href = root + 'products/' + handle; });
  };
  document.addEventListener('click', function (e) { var q = e.target.closest('[data-sn-quick]'); if (!q) return; e.preventDefault(); SN.quick(q.getAttribute('data-sn-quick')); });

  /* ---------------- predictive search ---------------- */
  SN.search = function (scope) {
    $$('[data-sn-psearch]:not([data-on])', scope).forEach(function (wrap) {
      wrap.setAttribute('data-on', '');
      var input = $('input[type="search"], input[name="q"]', wrap), out = $('[data-sn-presults]', wrap), t = null, ctrl = null;
      if (!input || !out) return;
      input.addEventListener('input', function () {
        var q = input.value.trim(); clearTimeout(t);
        wrap.classList.toggle('has-q', !!q);
        if (q.length < 2) { out.innerHTML = ''; return; }
        t = setTimeout(function () {
          if (ctrl) ctrl.abort(); ctrl = window.AbortController ? new AbortController() : null;
          wrap.classList.add('is-loading');
          fetch(root + 'search/suggest.json?q=' + encodeURIComponent(q) + '&resources[type]=product,collection,article,page&resources[limit]=6', ctrl ? { signal: ctrl.signal } : {})
            .then(function (r) { return r.json(); }).then(function (d) {
              wrap.classList.remove('is-loading');
              var R = (d.resources && d.resources.results) || {}, P = R.products || [], C = R.collections || [], A = (R.articles || []).concat(R.pages || []);
              if (!P.length && !C.length && !A.length) { out.innerHTML = '<p class="snps__none">' + (SN.t.noResults || 'Nothing found for') + ' “' + SN.esc(q) + '”</p>'; return; }
              var h = '';
              if (P.length) h += '<div class="snps__col snps__col--p"><p class="sn-eyebrow">' + (SN.t.products || 'Products') + '</p><ul>' + P.map(function (p, i) { return '<li style="--i:' + i + '"><a href="' + p.url + '"><span class="snps__img">' + (p.image ? '<img src="' + SN.img(p.image, 160) + '" alt="">' : '') + '</span><span><b>' + SN.esc(p.title) + '</b><small>' + SN.money(Math.round(parseFloat(p.price) * 100)) + '</small></span></a></li>'; }).join('') + '</ul></div>';
              if (C.length || A.length) h += '<div class="snps__col"><p class="sn-eyebrow">' + (SN.t.suggestions || 'Suggestions') + '</p><ul>' + C.concat(A).map(function (c, i) { return '<li style="--i:' + i + '"><a class="snps__txt" href="' + c.url + '">' + SN.esc(c.title) + '</a></li>'; }).join('') + '</ul></div>';
              h += '<a class="sn-link snps__all" href="' + root + 'search?q=' + encodeURIComponent(q) + '">' + (SN.t.viewAll || 'View all results') + SN.icons.arrow + '</a>';
              out.innerHTML = h;
            }).catch(function () { wrap.classList.remove('is-loading'); });
        }, 220);
      });
    });
  };

  /* ---------------- countdown ---------------- */
  SN.countdown = function (scope) {
    $$('[data-sn-countdown]:not([data-on])', scope).forEach(function (el) {
      el.setAttribute('data-on', '');
      var end = Date.parse(el.getAttribute('data-sn-countdown'));
      if (isNaN(end)) return;
      var D = $('[data-d]', el), H = $('[data-h]', el), M = $('[data-m]', el), S = $('[data-s]', el);
      function pad(n) { return (n < 10 ? '0' : '') + n; }
      function set(node, v) { if (node && node.textContent !== v) { node.textContent = v; node.classList.remove('is-tick'); void node.offsetWidth; node.classList.add('is-tick'); } }
      (function tick() {
        var d = Math.max(0, end - Date.now()), s = Math.floor(d / 1000);
        set(D, pad(Math.floor(s / 86400))); set(H, pad(Math.floor(s % 86400 / 3600))); set(M, pad(Math.floor(s % 3600 / 60))); set(S, pad(s % 60));
        if (d <= 0) { el.classList.add('is-over'); return; }
        setTimeout(tick, 1000);
      })();
    });
  };

  /* ---------------- feathers (drifting soft particles) ---------------- */
  SN.feathers = function (scope) {
    if (!motion() || body.getAttribute('data-feathers') === 'off') return;
    $$('[data-sn-feathers]:not([data-on])', scope).forEach(function (host) {
      host.setAttribute('data-on', '');
      var cv = document.createElement('canvas'); cv.className = 'sn-feathers'; host.appendChild(cv);
      var ctx = cv.getContext('2d'), W = 0, H = 0, dpr = Math.min(devicePixelRatio || 1, 1.5), parts = [], vis = true;
      var col = host.getAttribute('data-color') || 'rgba(255,255,255,.75)', n = parseInt(host.getAttribute('data-sn-feathers'), 10) || 26;
      function size() { W = host.clientWidth; H = host.clientHeight; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
      function mk(y) { return { x: Math.random() * W, y: y == null ? Math.random() * H : y, r: 1 + Math.random() * 2.6, s: .15 + Math.random() * .45, a: Math.random() * 6.28, w: .4 + Math.random() * .8, o: .25 + Math.random() * .6, f: Math.random() < .25 }; }
      size(); for (var i = 0; i < n; i++) parts.push(mk());
      window.addEventListener('resize', size);
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) loop(); }).observe(host);
      var raf = null;
      function loop() {
        if (raf) return;
        (function f() {
          raf = null; if (!vis || document.hidden) return;
          ctx.clearRect(0, 0, W, H);
          parts.forEach(function (p, i) {
            p.y -= p.s; p.a += .012 * p.w; p.x += Math.sin(p.a) * .35;
            if (p.y < -10) parts[i] = mk(H + 10);
            ctx.globalAlpha = p.o * (0.6 + 0.4 * Math.sin(p.a * 2));
            ctx.fillStyle = col;
            ctx.beginPath();
            if (p.f) { ctx.ellipse(p.x, p.y, p.r * 2.6, p.r * .9, p.a, 0, 6.283); } else { ctx.arc(p.x, p.y, p.r, 0, 6.283); }
            ctx.fill();
          });
          raf = requestAnimationFrame(f);
        })();
      }
      loop();
    });
  };

  /* ---------------- moon scroll indicator ---------------- */
  (function moon() {
    var m = $('[data-sn-moon]'); if (!m) return;
    var shadow = $('[data-sn-moon-shadow]', m), ring = $('.sn-moon-top__ring circle', m), ticking = false;
    function upd() {
      ticking = false;
      var max = document.documentElement.scrollHeight - innerHeight, p = max > 0 ? scrollY / max : 0;
      m.classList.toggle('is-on', scrollY > innerHeight * .6);
      if (shadow) shadow.setAttribute('cx', (12 - p * 17).toFixed(2));
      if (ring) ring.style.setProperty('--off', (100 - p * 100).toFixed(1));
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true }); upd();
    m.addEventListener('click', function () { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  })();

  /* ---------------- card light follow ---------------- */
  document.addEventListener('pointermove', function (e) {
    var m = e.target.closest && e.target.closest('.sn-card__media'); if (!m) return;
    var r = m.getBoundingClientRect(); m.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%'); m.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  }, { passive: true });
  /* card swatch preview */
  document.addEventListener('mouseover', function (e) {
    var d = e.target.closest && e.target.closest('.sn-sw__dot[data-img]'); if (!d) return;
    var card = d.closest('.sn-card'), im = card && $('.sn-card__media img:not(.sn-card__b)', card); if (!im) return;
    if (!im.dataset.o) { im.dataset.o = im.currentSrc || im.src; im.dataset.ss = im.getAttribute('srcset') || ''; }
    im.removeAttribute('srcset'); im.src = d.getAttribute('data-img');
    $$('.sn-sw__dot', card).forEach(function (x) { x.classList.toggle('is-on', x === d); });
  });
  document.addEventListener('mouseout', function (e) {
    var sw = e.target.closest && e.target.closest('.sn-sw'); if (!sw || sw.contains(e.relatedTarget)) return;
    var card = sw.closest('.sn-card'), im = card && $('.sn-card__media img:not(.sn-card__b)', card);
    if (im && im.dataset.o) { im.src = im.dataset.o; if (im.dataset.ss) im.setAttribute('srcset', im.dataset.ss); }
    $$('.sn-sw__dot', sw).forEach(function (x) { x.classList.remove('is-on'); });
  });

  /* ---------------- view transitions flag ---------------- */
  if (body.getAttribute('data-vt') === 'on' && motion()) document.documentElement.classList.add('sn-vt');

  /* ---------------- boot ---------------- */
  SN.boot = function (scope) { SN.reveal(scope); SN.rail(scope); SN.tabs(scope); SN.search(scope); SN.countdown(scope); SN.feathers(scope); SN.wish.paint(); };
  function start() { SN.boot(document); }
  SN.feathers(document.querySelector('[data-snpl]'));
  if (document.documentElement.classList.contains('pl-lock')) {
    window.addEventListener('preloader:done', start, { once: true });
    setTimeout(start, 6000);
  } else start();
  document.addEventListener('shopify:section:load', function (e) { SN.boot(e.target); if (window.SNSilk) window.SNSilk.init(e.target); });
  SN._core = 1; (SN._q || []).splice(0).forEach(function (f) { try { f(); } catch (e) { console.error(e); } });
})();
