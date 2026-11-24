/* animations.js — semua yang bergerak: bintang latar, intro welcome, transisi,
 * scroll-reveal, mesin tik, amplop, dan peta galaksi. Tanpa GSAP (CDN gagal)
 * atau dengan prefers-reduced-motion, semuanya tetap berfungsi tanpa gerak. */
(() => {
  'use strict';
  const ML = (window.MyLove = window.MyLove || {});
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const g = window.gsap;
  const motion = !!g && !reduced;
  const TAU = Math.PI * 2;

  /* ---------- bintang latar (fixed) ---------- */
  const warpState = { v: 0 };
  function initSky(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = 0, h = 0, f = 0, stars = [], last = performance.now();
    const spawn = initial => ({
      x: Math.random() * 2 - 1, y: Math.random() * 2 - 1,
      z: initial ? Math.random() * 0.95 + 0.05 : 1,
      c: Math.random() < 0.22 ? '214,180,119' : '242,233,216',
      tw: Math.random() * TAU, ts: 0.6 + Math.random() * 1.4
    });
    function draw(dt) {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2, warp = warpState.v;
      for (const s of stars) {
        const pz = s.z;
        s.z -= dt * (0.012 + warp * 1.5);
        s.tw += dt * s.ts;
        const px = cx + (s.x / s.z) * f, py = cy + (s.y / s.z) * f;
        if (s.z <= 0.03 || px < -40 || px > w + 40 || py < -40 || py > h + 40) { Object.assign(s, spawn(false)); continue; }
        const a = Math.min(1, (1 - s.z) * 2.2) * (0.75 + 0.25 * Math.sin(s.tw));
        const r = 0.35 + (1 - s.z) * 1.7;
        ctx.fillStyle = ctx.strokeStyle = `rgba(${s.c},${a.toFixed(3)})`;
        if (warp > 0.04) {
          ctx.lineWidth = r;
          ctx.beginPath();
          ctx.moveTo(cx + (s.x / pz) * f, cy + (s.y / pz) * f);
          ctx.lineTo(px, py);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(px, py, r, 0, TAU);
          ctx.fill();
        }
      }
    }
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      f = Math.max(w, h) * 0.5;
      stars = Array.from({ length: Math.min(260, Math.round((w * h) / 6500)) }, () => spawn(true));
      if (reduced) draw(0);
    }
    window.addEventListener('resize', resize);
    resize();
    if (reduced) return;
    (function frame(t) {
      const dt = Math.min((t - last) / 1000, 0.05); last = t;
      draw(dt);
      requestAnimationFrame(frame);
    })(last);
  }

  function warp(duration = 1.8) {
    if (!motion) return;
    g.timeline().to(warpState, { v: 1, duration: duration * 0.6, ease: 'power2.in' })
      .to(warpState, { v: 0, duration: duration * 0.4, ease: 'power2.out' });
  }

  /* ---------- welcome ---------- */
  function welcomeIntro(e) {
    if (!motion) return Promise.resolve();
    return new Promise(done => {
      const tl = g.timeline({ defaults: { ease: 'power3.out' }, onComplete: done });
      tl.from(e.eyebrow, { opacity: 0, y: 12, duration: 1.2 }, 0.5)
        .from(e.letters, { opacity: 0, y: 30, scale: 0.9, filter: 'blur(12px)', duration: 1.3, stagger: 0.12 }, 1.4)
        .from(e.ornament, { opacity: 0, scale: 0, rotate: -90, duration: 1, ease: 'back.out(2)' }, 2)
        .from(e.rule, { scaleX: 0, duration: 1.1, ease: 'power2.inOut' }, 2.5)
        .from(e.tagline, { opacity: 0, y: 10, duration: 1.1 }, 3)
        .from(e.lines, { opacity: 0, y: 14, duration: 1, stagger: 0.8 }, 4)
        .from(e.sign, { opacity: 0, duration: 1 }, '>-0.2')
        .from(e.button, { opacity: 0, y: 14, duration: 1 }, '>0.1');
    });
  }

  function enter(welcome, app, onVisible) {
    if (!motion) { welcome.hidden = true; app.hidden = false; onVisible(); return; }
    const inner = welcome.querySelector('.welcome__inner');
    const tl = g.timeline({ onComplete: () => { welcome.hidden = true; } });
    tl.to(inner, { scale: 1.2, opacity: 0, filter: 'blur(10px)', duration: 1.1, ease: 'power2.in' }, 0)
      .add(() => warp(1.9), 0)
      .add(() => {
        app.hidden = false; onVisible();
        g.fromTo(app, { opacity: 0 }, { opacity: 1, duration: 1.3, ease: 'power1.out', clearProps: 'opacity' });
        const hdr = app.querySelector('.site-header');
        if (hdr) g.from(hdr, { yPercent: -100, duration: 1, ease: 'power3.out', clearProps: 'transform' });
      }, 0.9)
      .to(welcome, { opacity: 0, duration: 1.1, ease: 'power1.inOut' }, 1);
  }

  function showView(el) {
    if (!motion) return;
    g.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', clearProps: 'opacity,transform' });
  }

  /* ---------- scroll reveal (IntersectionObserver) ---------- */
  let io;
  function reveal(root = document) {
    const els = [...root.querySelectorAll('.reveal:not(.is-in)')];
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('is-in')); return; }
    io = io || new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(el => io.observe(el));
  }

  /* ---------- mesin tik ---------- */
  function typewriter(el, text, { cps = 40, onProgress, onDone } = {}) {
    let raf = 0, t0 = 0, done = false;
    const finish = () => {
      cancelAnimationFrame(raf);
      el.textContent = text; el.classList.remove('is-typing');
      if (onProgress) onProgress(1);
      if (!done) { done = true; if (onDone) onDone(); }
    };
    if (reduced || !text) { finish(); return { finish, cancel: finish }; }
    el.classList.add('is-typing'); el.textContent = '';
    const step = t => {
      if (!t0) t0 = t;
      const i = Math.min(text.length, Math.floor(((t - t0) / 1000) * cps));
      el.textContent = text.slice(0, i);
      if (onProgress) onProgress(i / text.length);
      if (i >= text.length) finish(); else raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return { finish, cancel() { cancelAnimationFrame(raf); done = true; } };
  }

  /* ---------- amplop ---------- */
  function openEnvelope(env, letter) {
    let tl;
    const done = new Promise(res => {
      if (!motion) { env.hidden = true; letter.hidden = false; res(); return; }
      const flap = env.querySelector('.envelope__flap');
      const paper = env.querySelector('.envelope__paper');
      const seal = env.querySelector('.envelope__seal');
      env.hidden = false; letter.hidden = true;
      g.set(env, { opacity: 0, y: 30, scale: 0.92 });
      g.set(flap, { rotateX: 0, zIndex: 4, transformPerspective: 900, transformOrigin: '50% 0%' });
      g.set([paper, seal], { clearProps: 'all' });
      tl = g.timeline({ onComplete: res });
      tl.to(env, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' })
        .to(seal, { opacity: 0, scale: 0.5, duration: 0.3 }, '+=0.3')
        .to(flap, { rotateX: 180, duration: 0.8, ease: 'power2.inOut' }, '<')
        .set(flap, { zIndex: 1 })
        .to(paper, { yPercent: -70, duration: 0.8, ease: 'power2.out' })
        .to(env, { opacity: 0, scale: 0.85, y: 60, duration: 0.6, ease: 'power2.in' }, '+=0.15')
        .add(() => {
          env.hidden = true; letter.hidden = false;
          g.fromTo(letter, { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' });
        }, '<0.45');
    });
    return { done, kill() { if (tl) tl.kill(); } };
  }

  /* ---------- peta galaksi ---------- */
  function createUniverse(canvas, { nodes, onSelect }) {
    const ctx = canvas.getContext('2d');
    const wrap = canvas.parentElement;
    let w = 0, h = 0, running = false, raf = 0, last = 0, rot = 0;
    let selected = null, hover = null, particles = [];
    const ripples = [];
    const specials = nodes.filter(n => n.special);

    function build() {
      const n = w < 640 ? 520 : 1000;
      particles = Array.from({ length: n }, () => {
        const arm = Math.floor(Math.random() * 3), r = Math.pow(Math.random(), 0.75);
        const a = (arm * TAU) / 3 + r * 6 + (Math.random() - 0.5) * (1.1 - r * 0.6);
        const hue = Math.round(42 + r * 185);
        return { a, r, s: 0.6 + Math.random() * 1.6,
          c: `hsla(${hue},${Math.round(55 + r * 20)}%,${Math.round(82 - r * 22)}%,${(0.25 + Math.random() * 0.6).toFixed(2)})` };
      });
    }

    function draw(t) {
      if (!ctx || !w) return;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2, R = Math.min(w, h * 1.5) * 0.46;
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.35);
      gr.addColorStop(0, 'rgba(242,214,160,.35)'); gr.addColorStop(1, 'rgba(214,180,119,0)');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h);
      for (const p of particles) {
        const a = p.a + rot * (1.2 - p.r * 0.8);
        ctx.fillStyle = p.c;
        ctx.fillRect(cx + Math.cos(a) * p.r * R, cy + Math.sin(a) * p.r * R * 0.6, p.s, p.s);
      }
      if (specials.length === 2) {
        const [a, b] = specials;
        ctx.save();
        ctx.setLineDash([4, 8]); ctx.lineDashOffset = -t / 60;
        ctx.strokeStyle = `rgba(214,180,119,${(0.4 + 0.15 * Math.sin(t / 600)).toFixed(2)})`;
        ctx.lineWidth = 1.2; ctx.shadowColor = '#D6B477'; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(b.x * w, b.y * h); ctx.stroke();
        ctx.restore();
      }
      nodes.forEach((n, i) => {
        const x = n.x * w, y = n.y * h;
        const pulse = reduced ? 1 : 1 + 0.12 * Math.sin(t / 700 + i);
        const size = (n.special ? 7 : 4) * pulse * (n === hover ? 1.35 : 1);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 6);
        glow.addColorStop(0, n.special ? 'rgba(242,214,160,.9)' : 'rgba(242,233,216,.65)');
        glow.addColorStop(1, 'rgba(214,180,119,0)');
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, size * 6, 0, TAU); ctx.fill();
        ctx.fillStyle = '#fff6df'; ctx.beginPath(); ctx.arc(x, y, size * 0.55, 0, TAU); ctx.fill();
        if (n.special) {
          ctx.strokeStyle = 'rgba(255,246,223,.85)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(x - size * 2.2, y); ctx.lineTo(x + size * 2.2, y);
          ctx.moveTo(x, y - size * 2.2); ctx.lineTo(x, y + size * 2.2); ctx.stroke();
          ctx.fillStyle = '#F2E9D8'; ctx.textAlign = 'center';
          ctx.font = `italic 500 ${w < 500 ? 16 : 19}px "Cormorant Garamond", serif`;
          ctx.fillText(n.name, x, y + 34);
        }
        if (n === selected) {
          ctx.strokeStyle = 'rgba(214,180,119,.9)'; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(x, y, n.special ? 22 : 17, 0, TAU); ctx.stroke();
        }
      });
      for (let i = ripples.length - 1; i >= 0; i--) {
        const p = (t - ripples[i].t0) / 1000;
        if (p > 1) { ripples.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(214,180,119,${(1 - p).toFixed(2)})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(ripples[i].x, ripples[i].y, p * 70, 0, TAU); ctx.stroke();
      }
    }

    const refresh = () => { if (!running) draw(performance.now()); };

    function resize() {
      const r = wrap.getBoundingClientRect();
      if (!r.width) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.round(r.width); h = Math.round(r.height);
      canvas.width = w * dpr; canvas.height = h * dpr;
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build(); refresh();
    }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(wrap);

    function loop(t) {
      if (!running) return;
      rot += ((t - last) / 1000) * 0.05; last = t;
      draw(t);
      raf = requestAnimationFrame(loop);
    }
    function start() {
      resize();
      if (reduced || running) return;
      running = true; last = performance.now();
      raf = requestAnimationFrame(loop);
    }
    function stop() { running = false; cancelAnimationFrame(raf); }

    function hit(ev) {
      const r = canvas.getBoundingClientRect();
      const x = ev.clientX - r.left, y = ev.clientY - r.top;
      let best = null, bd = 1e9;
      for (const n of nodes) {
        const d = Math.hypot(n.x * w - x, n.y * h - y);
        if (d < (n.special ? 30 : 24) && d < bd) { best = n; bd = d; }
      }
      return best;
    }
    function select(id) {
      const n = nodes.find(x => x.id === id);
      if (!n) return;
      selected = n;
      if (!reduced) ripples.push({ x: n.x * w, y: n.y * h, t0: performance.now() });
      onSelect(n); refresh();
    }
    canvas.addEventListener('pointermove', e => {
      const n = hit(e);
      if (n !== hover) { hover = n; canvas.style.cursor = n ? 'pointer' : 'default'; refresh(); }
    });
    canvas.addEventListener('pointerleave', () => { hover = null; refresh(); });
    canvas.addEventListener('click', e => { const n = hit(e); if (n) select(n.id); });

    return { start, stop, select };
  }

  ML.anim = { reduced, motion, initSky, welcomeIntro, enter, showView, reveal, typewriter, openEnvelope, createUniverse };
})();
