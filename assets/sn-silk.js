/* Sakooon Nocturne — WebGL silk. Flowing satin rendered in a fragment shader.
   Usage: <div data-sn-silk data-c1="#1B2130" data-c2="#3A3550" data-c3="#E8CF9E" data-speed="1" data-scale="1" data-amp="1"></div>
   The element gets a <canvas>. Falls back to a CSS gradient when WebGL or motion is unavailable. */
(function () {
  'use strict';
  var VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  var FS = [
    'precision mediump float;',
    'uniform vec2 r;uniform float t;uniform vec3 c1;uniform vec3 c2;uniform vec3 c3;uniform vec2 m;uniform float sc;uniform float amp;uniform float mi;uniform float fold;',
    'float h(vec2 p){',
    ' vec2 q=p+.42*vec2(sin(p.y*1.1+t*.31),sin(p.x*.9-t*.27));',
    ' float v=0.;',
    ' v+=sin(dot(q,vec2(.86,.5))*2.6+t*.62)*.55;',
    ' v+=sin(dot(q,vec2(-.32,.95))*1.7+t*.33+sin(q.x*.8)*1.4)*.45;',
    ' v+=sin(dot(q,vec2(.6,.8))*3.6-t*.48+sin(q.y*1.3)*1.1)*.16*fold;',
        ' float d=length(p-m);',
    ' v+=mi*.5*exp(-d*d*1.6)*sin(d*6.5-t*3.);',
    ' return v*amp;',
    '}',
    'float rnd(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}',
    'void main(){',
    ' vec2 uv=gl_FragCoord.xy/r;',
    ' vec2 p=(gl_FragCoord.xy-.5*r)/min(r.x,r.y)*sc*2.6;',
    ' float e=.012;',
    ' float dx=(h(p+vec2(e,0.))-h(p-vec2(e,0.)))/(2.*e);',
    ' float dy=(h(p+vec2(0.,e))-h(p-vec2(0.,e)))/(2.*e);',
    ' vec3 n=normalize(vec3(-dx*.75,-dy*.75,1.));',
    ' vec3 L=normalize(vec3(-.62,.52,.5));',
    ' float dif=dot(n,L)*.5+.5;',
    ' vec3 H=normalize(L+vec3(0.,0.,1.));',
    ' float sp=pow(max(dot(n,H),0.),16.);',
    ' float sheen=pow(1.-abs(n.z),2.2);',
    ' vec3 col=mix(c1,c2,smoothstep(.2,.98,dif));',
    ' col=mix(col,c3,clamp(sp*.55+sheen*.18,0.,.85));',
    ' col*=.82+.18*smoothstep(1.25,.2,length(uv-.5));',
    ' col+= (rnd(gl_FragCoord.xy+t)-.5)*.025;',
    ' gl_FragColor=vec4(col,1.);',
    '}'
  ].join('\n');

  function hex(c) {
    c = (c || '#000').replace('#', '').trim();
    if (c.length === 3) c = c.replace(/./g, '$&$&');
    var n = parseInt(c.slice(0, 6), 16);
    return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
  }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var off = function () { return document.body && document.body.getAttribute('data-silk') === 'off'; };
  var all = [];

  function Silk(el) {
    this.el = el; this.ok = false;
    var d = el.dataset;
    this.c = [hex(d.c1 || '#1B2130'), hex(d.c2 || '#4A4566'), hex(d.c3 || '#E8CF9E')];
    this.speed = parseFloat(d.speed || '1'); this.scale = parseFloat(d.scale || '1'); this.amp = parseFloat(d.amp || '1');
    this.fold = parseFloat(d.fold || '1');
    this.mouse = d.mouse !== 'false';
    this.m = [99, 99]; this.mt = [99, 99]; this.mi = 0; this.mit = 0;
    el.style.background = 'radial-gradient(120% 90% at 30% 20%, ' + (d.c3 || '#E8CF9E') + '33, transparent 60%), linear-gradient(160deg, ' + (d.c2 || '#4A4566') + ', ' + (d.c1 || '#1B2130') + ')';
    if (reduce || off()) return;
    var cv = document.createElement('canvas');
    cv.setAttribute('aria-hidden', 'true');
    cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity 1.2s ease';
    var gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power', premultipliedAlpha: false });
    if (!gl) return;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.appendChild(cv);
    this.cv = cv; this.gl = gl;
    var p = gl.createProgram();
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    gl.attachShader(p, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return;
    gl.useProgram(p);
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var a = gl.getAttribLocation(p, 'a'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    var u = {}; ['r', 't', 'c1', 'c2', 'c3', 'm', 'sc', 'amp', 'mi', 'fold'].forEach(function (k) { u[k] = gl.getUniformLocation(p, k); });
    this.u = u; this.ok = true; this.t0 = performance.now(); this.vis = true; this.t = Math.random() * 50;
    var self = this;
    this.resize(); window.addEventListener('resize', function () { self.resize(); });
    if (this.mouse) {
      var host = el.closest('[data-sn-silk-host]') || el;
      host.addEventListener('pointermove', function (e) {
        var rc = el.getBoundingClientRect(), mn = Math.min(rc.width, rc.height);
        self.mt = [(e.clientX - rc.left - rc.width / 2) / mn * self.scale * 2.2, -(e.clientY - rc.top - rc.height / 2) / mn * self.scale * 2.2];
        self.mit = 1;
      });
      host.addEventListener('pointerleave', function () { self.mit = 0; });
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { self.vis = es[0].isIntersecting; if (self.vis) self.loop(); }, { rootMargin: '100px' }).observe(el);
    requestAnimationFrame(function () { cv.style.opacity = '1'; });
    this.last = performance.now();
    this.loop();
  }
  Silk.prototype.resize = function () {
    if (!this.cv) return;
    var dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 750 ? 1 : 1.35);
    var w = Math.max(2, this.el.clientWidth * dpr | 0), h = Math.max(2, this.el.clientHeight * dpr | 0);
    var q = this.el.dataset.quality === 'low' ? .6 : 1;
    this.cv.width = w * q | 0; this.cv.height = h * q | 0;
    this.gl.viewport(0, 0, this.cv.width, this.cv.height);
  };
  Silk.prototype.loop = function () {
    if (!this.ok || this.raf) return;
    var self = this;
    function f(now) {
      self.raf = null;
      if (!self.vis || document.hidden) return;
      var dt = Math.min(now - self.last, 50) / 1000; self.last = now;
      self.t += dt * self.speed;
      self.m[0] += (self.mt[0] - self.m[0]) * .08; self.m[1] += (self.mt[1] - self.m[1]) * .08;
      self.mi += (self.mit - self.mi) * .05;
      var gl = self.gl, u = self.u;
      gl.uniform2f(u.r, self.cv.width, self.cv.height); gl.uniform1f(u.t, self.t);
      gl.uniform3fv(u.c1, self.c[0]); gl.uniform3fv(u.c2, self.c[1]); gl.uniform3fv(u.c3, self.c[2]);
      gl.uniform2f(u.m, self.m[0], self.m[1]); gl.uniform1f(u.sc, self.scale); gl.uniform1f(u.amp, self.amp); gl.uniform1f(u.mi, self.mi); gl.uniform1f(u.fold, self.fold);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      self.raf = requestAnimationFrame(f);
    }
    self.last = performance.now();
    self.raf = requestAnimationFrame(f);
  };
  Silk.prototype.recolor = function (c1, c2, c3) { this.c = [hex(c1), hex(c2), hex(c3)]; };
  function init(root) {
    (root || document).querySelectorAll('[data-sn-silk]:not([data-sn-silk-on])').forEach(function (el) {
      el.setAttribute('data-sn-silk-on', '');
      var s = new Silk(el); el._silk = s; all.push(s);
    });
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) all.forEach(function (s) { s.loop(); }); });
  window.SNSilk = { init: init, all: all };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); }); else init();
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
