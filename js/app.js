/* app.js — membaca data.js, merender semua halaman, router, overlay, hitung mundur. */
(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const ML = window.MyLove;
  const { data, anim } = ML;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const icons = () => {
    if (window.lucide) window.lucide.createIcons();
  };
  const ic = (name, fb = "") => `<i data-lucide="${name}" aria-hidden="true">${fb}</i>`;
  const setText = (el, t) => {
    if (el && el.textContent !== t) el.textContent = t;
  };
  const pad = (v) => String(v).padStart(2, "0");
  const empty = (msg) => `<p class="empty">${esc(msg)}</p>`;
  const paras = (t) =>
    esc(t)
      .split(/\n{2,}/)
      .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
      .join("");

  /* ---------- toast ---------- */
  let toastTimer;
  ML.toast = (msg) => {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-show"), 4500);
  };

  /* ---------- waktu (selalu Asia/Jakarta) ---------- */
  const DAY = 864e5;
  const fmt = new Intl.DateTimeFormat("en-US", { timeZone: data.timezone, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" });
  // Uji coba: buka index.html?now=2027-06-01T08:00 untuk berpura-pura ini waktu Jakarta tersebut (+07:00, Jakarta tanpa DST).
  const nowParam = new URLSearchParams(location.search).get("now");
  const fake = nowParam ? Date.parse(nowParam + "+07:00") : NaN;
  const skew = isNaN(fake) ? 0 : fake - Date.now();

  function jakartaNow() {
    const p = {};
    for (const x of fmt.formatToParts(new Date(Date.now() + skew))) p[x.type] = +x.value;
    return { y: p.year, m: p.month, d: p.day, h: p.hour, mi: p.minute, s: p.second, ms: Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) };
  }
  const dateMs = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  const idDate = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const longDate = (iso) => idDate.format(new Date(dateMs(iso)));
  const isoOf = (ms) => new Date(ms).toISOString().slice(0, 10);
  const dayOfYear = (n) => Math.min(365, Math.floor((Date.UTC(n.y, n.m - 1, n.d) - Date.UTC(n.y, 0, 1)) / DAY) + 1);

  function sinceParts(n) {
    const [sy, sm, sd] = data.dates.relationship.split("-").map(Number);
    const start = Date.UTC(sy, sm - 1, sd);
    if (n.ms < start) return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    let months = (n.y - sy) * 12 + (n.m - sm);
    // shortcut: tanggal > 28 bisa meluap di bulan pendek; aman untuk tanggal 19.
    if (Date.UTC(sy, sm - 1 + months, sd) > n.ms) months--;
    const rest = n.ms - Date.UTC(sy, sm - 1 + months, sd);
    return { months, days: Math.floor(rest / DAY), hours: Math.floor((rest % DAY) / 36e5), minutes: Math.floor((rest % 36e5) / 6e4), seconds: Math.floor((rest % 6e4) / 1e3), total: Math.floor((n.ms - start) / DAY) };
  }
  function nextDate(iso, n) {
    const [, m, d] = iso.split("-").map(Number);
    let y = n.y,
      t = Date.UTC(y, m - 1, d);
    if (t + DAY <= n.ms) t = Date.UTC(++y, m - 1, d);
    return { y, t, today: n.ms >= t && n.ms < t + DAY };
  }
  const split = (ms) => ({ days: Math.floor(ms / DAY), hours: Math.floor((ms % DAY) / 36e5), minutes: Math.floor((ms % 36e5) / 6e4), seconds: Math.floor((ms % 6e4) / 1e3) });
  const greeting = (h) => (h >= 4 && h < 11 ? "Selamat pagi" : h >= 11 && h < 15 ? "Selamat siang" : h >= 15 && h < 18 ? "Selamat sore" : "Selamat malam");

  const SINCE = [
    ["months", "bulan"],
    ["days", "hari"],
    ["hours", "jam"],
    ["minutes", "menit"],
    ["seconds", "detik"],
  ];
  const COUNT = [
    ["days", "hari"],
    ["hours", "jam"],
    ["minutes", "menit"],
    ["seconds", "detik"],
  ];
  const unitsHTML = (list) => list.map(([k, l]) => `<div class="unit"><b data-u="${k}">00</b><span>${l}</span></div>`).join("");
  function updateUnits(box, vals) {
    for (const k in vals) {
      const b = box.querySelector(`[data-u="${k}"]`);
      if (b) setText(b, pad(vals[k]));
    }
  }

  const specialDefs = {
    birthday: { icon: "cake", title: `Ulang Tahun ${data.couple.partnerShort}`, iso: data.dates.birthday, label: () => "", celebrate: `Selamat ulang tahun, ${data.couple.partnerShort}! 🎂` },
    anniversary: { icon: "heart", title: "Hari Jadi Kita", iso: data.dates.relationship, label: (k) => `Hari jadi ${k} tahun`, celebrate: "Selamat hari jadi, sayang! 💛" },
  };
  const specialCard = (key) => `<article class="glass card special reveal" data-special="${key}">
      <div class="special__head"><span class="special__icon">${ic("sparkles")}</span>
        <div><h3 class="card__title">${esc(specialDefs[key].title)}</h3><p class="muted" data-sp="when"></p></div></div>
      <div class="units" data-sp="units">${unitsHTML(COUNT)}</div>
      <p class="special__today" data-sp="today" hidden></p></article>`;

  function updateSpecial(card, n) {
    const def = specialDefs[card.dataset.special],
      nx = nextDate(def.iso, n);
    setText($("[data-sp=when]", card), `${longDate(isoOf(nx.t))} · ${def.label(nx.y - +def.iso.slice(0, 4))}`);
    const units = $("[data-sp=units]", card),
      today = $("[data-sp=today]", card);
    units.hidden = nx.today;
    today.hidden = !nx.today;
    if (nx.today) setText(today, def.celebrate);
    else updateUnits(units, split(nx.t - n.ms));
    card.classList.toggle("is-today", nx.today);
  }

  /* ---------- foto / video dengan placeholder ---------- */
  const PH_SVG = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/></svg>';
  const placeholder = (kind, src) => `<span class="ph">${PH_SVG}<b>${kind === "video" ? "Video" : "Foto"} belum ditambahkan</b><small>${esc(src)}</small></span>`;

  function mountPhoto(box) {
    const { src, alt = "", kind = "image" } = box.dataset;
    const isV = kind === "video";
    const m = document.createElement(isV ? "video" : "img");
    m.addEventListener(isV ? "loadeddata" : "load", () => box.classList.remove("is-loading"), { once: true });
    m.addEventListener(
      "error",
      () => {
        box.classList.remove("is-loading");
        box.classList.add("is-missing");
        box.innerHTML = placeholder(kind, src);
      },
      { once: true },
    );
    if (isV) {
      m.muted = true;
      m.playsInline = true;
      m.preload = "metadata";
      m.setAttribute("aria-hidden", "true");
    } else {
      m.alt = alt;
      m.loading = "lazy";
      m.decoding = "async";
    }
    m.src = isV ? `${src}#t=0.1` : src;
    box.append(m);
    box.removeAttribute("data-src");
  }
  const photoBox = (src, alt, kind = "image") => `<span class="photo is-loading" data-src="${esc(src)}" data-alt="${esc(alt)}" data-kind="${kind}"></span>`;

  const TILTS = [-2.4, 1.8, -1.2, 2.6, -1.8, 1.2];
  function polaroid(m, i) {
    const v = m.type === "video";
    return `<button type="button" class="polaroid reveal" style="--tilt:${TILTS[i % TILTS.length]}deg;--d:${(i % 6) * 70}ms" data-mem="${esc(m.id)}" aria-label="Buka ${v ? "video" : "foto"}: ${esc(m.caption)}">
      ${photoBox(m.src, "", v ? "video" : "image")}
      ${v ? '<span class="play-badge" aria-hidden="true">▶</span>' : ""}
      <span class="polaroid__cap"><span>${esc(m.caption)}</span>${m.date ? `<small>${longDate(m.date)}</small>` : ""}</span></button>`;
  }
  function fillGallery(box, list, emptyMsg) {
    box.innerHTML = list.length ? list.map(polaroid).join("") : empty(emptyMsg);
    $$(".photo[data-src]", box).forEach(mountPhoto);
    box.addEventListener("click", (e) => {
      const b = e.target.closest("[data-mem]");
      if (b)
        openLightbox(
          list,
          list.findIndex((m) => m.id === b.dataset.mem),
        );
    });
  }

  /* ---------- render halaman ---------- */
  function renderWelcome() {
    document.title = `${data.site.name} — untuk ${data.couple.partnerShort}`;
    setText($(".welcome__eyebrow"), `Untuk ${data.couple.partner}`);
    setText($(".welcome__tagline"), data.site.tagline);
    $(".welcome__message").innerHTML = data.welcome.lines.map((l) => `<p>${esc(l)}</p>`).join("");
    setText($(".welcome__sign"), data.welcome.sign);
    $$("[data-tagline]").forEach((e) => setText(e, data.site.tagline));
    setText($("#footer-text"), `Dibuat dengan cinta oleh ${data.couple.creator} untuk ${data.couple.partner}`);
  }

  function renderHome() {
    $("[data-since]").innerHTML = unitsHTML(SINCE);
    setText($("#since-sub"), `Sejak ${longDate(data.dates.relationship)}`);
    $("#home-specials").innerHTML = specialCard("birthday") + specialCard("anniversary");
    $("#special-cards").innerHTML = specialCard("birthday") + specialCard("anniversary");
    const byNewest = [...data.memories].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    fillGallery($("#latest-memories"), byNewest.slice(0, 3), "Belum ada kenangan. Tambahkan di data.js.");
  }

  function renderDaily(n) {
    const list = data.reasons.filter(Boolean),
      box = $("#daily-text");
    if (!list.length) {
      box.textContent = "Pesan cinta hari ini belum ditulis.";
      return;
    }
    const doy = dayOfYear(n);
    setText(box, list[(doy - 1) % list.length]);
    setText($("#daily-day"), `Hari ke-${doy} · ${longDate(isoOf(n.ms))}`);
  }

  function renderStory() {
    const box = $("#story-list");
    if (!data.story.length) {
      box.innerHTML = `<li>${empty("Cerita kita belum ditulis.")}</li>`;
      return;
    }
    box.innerHTML = data.story
      .map(
        (e, i) => `<li class="tl-item reveal${i % 2 ? " is-right" : ""}">
      <span class="tl-dot" aria-hidden="true"></span>
      <article class="glass tl-card">
        ${e.date ? `<time datetime="${esc(e.date)}">${longDate(e.date)}</time>` : ""}
        <h3>${esc(e.title)}</h3><p>${esc(e.text)}</p>
        ${e.image ? photoBox(e.image, e.title) : ""}
      </article></li>`,
      )
      .join("");
    $$(".photo[data-src]", box).forEach(mountPhoto);
  }

  const ENV_SVG = '<svg class="letter-card__env" viewBox="0 0 64 44" aria-hidden="true"><rect x="1" y="1" width="62" height="42" rx="4" fill="#1d2a44" stroke="#D6B477" stroke-opacity=".5"/><path d="M2 3l30 22L62 3" fill="none" stroke="#D6B477" stroke-opacity=".7"/><path d="M32 33c-4-3-6-5-6-7.5a3 3 0 0 1 6-.5 3 3 0 0 1 6 .5c0 2.500-2 4.500-6 7.500z" fill="#D6B477"/></svg>';
  function renderLetters() {
    const box = $("#letters-grid");
    box.innerHTML = data.letters.length
      ? data.letters
          .map(
            (l, i) => `<button type="button" class="letter-card reveal" style="--d:${i * 80}ms" data-letter="${esc(l.id)}">
      ${ENV_SVG}<span class="letter-card__kicker">${esc(l.kicker)}</span><span class="letter-card__title">${esc(l.title)}</span><span class="letter-card__hint">${esc(l.hint || "")}</span></button>`,
          )
          .join("")
      : empty("Belum ada surat.");
    box.addEventListener("click", (e) => {
      const b = e.target.closest("[data-letter]");
      if (b) openLetter(data.letters.find((l) => l.id === b.dataset.letter));
    });
  }

  function renderMemories() {
    fillGallery(
      $("#photo-grid"),
      data.memories.filter((m) => m.type !== "video"),
      "Belum ada foto. Tambahkan di data.js.",
    );
    fillGallery(
      $("#video-grid"),
      data.memories.filter((m) => m.type === "video"),
      "Belum ada video. Tambahkan di data.js.",
    );
  }

  function renderReasons(n) {
    const doy = dayOfYear(n);
    const items = data.reasons.map((t, i) => (t ? { day: i + 1, t } : null)).filter(Boolean);
    setText($("#reasons-progress"), `${items.length} dari 365 alasan sudah ditulis`);
    $("#reasons-bar").style.width = `${(items.length / 365) * 100}%`;
    const tail = items.length < 365 ? `<article class="glass reason is-tail reveal"><p>…dan sisa alasannya masih ditulis, satu per satu.</p></article>` : "";
    $("#reasons-list").innerHTML = items.length
      ? items
          .map(
            (r) => `<article class="glass reason reveal${r.day === doy ? " is-today" : ""}" style="--d:${(r.day % 6) * 60}ms">
      <span class="reason__no" aria-label="Hari ke-${r.day}">${pad(r.day)}</span>${r.day === doy ? '<span class="badge">Hari ini</span>' : ""}<p>${esc(r.t)}</p></article>`,
          )
          .join("") + tail
      : empty("Belum ada alasan. Tambahkan di data.js.");
  }

  let universe;
  function renderUniverse() {
    const u = data.universe;
    const nodes = [{ id: "david", special: true, name: data.couple.creator, ...u.david }, { id: "rahmah", special: true, name: data.couple.partnerShort, ...u.rahmah }, ...u.stars.map((s) => ({ ...s, name: s.title }))];
    $("#star-chips").innerHTML = nodes.map((n) => `<li><button type="button" class="chip" data-star="${esc(n.id)}" aria-pressed="false">${esc(n.name)}</button></li>`).join("");
    $("#star-chips").addEventListener("click", (e) => {
      const b = e.target.closest("[data-star]");
      if (b) universe.select(b.dataset.star);
    });
    universe = anim.createUniverse($("#universe-canvas"), { nodes, onSelect: showStar });
  }
  function showStar(n) {
    const panel = $("#star-panel");
    setText($("#star-kicker"), n.special ? "Bintang istimewa" : "Bintang kenangan");
    setText($("#star-name"), n.name);
    setText($("#star-message"), n.message);
    $$("#star-chips [data-star]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.star === n.id)));
    panel.classList.remove("is-pop");
    void panel.offsetWidth;
    panel.classList.add("is-pop");
  }

  function renderFuture(n) {
    const list = data.future.letters,
      box = $("#future-letters");
    box.innerHTML = list.length
      ? list
          .map((l) => {
            const t = dateMs(l.unlock);
            if (n.ms >= t) return `<details class="glass future-letter is-open reveal"><summary>${ic("mail-open")}<span><b>${esc(l.title)}</b><small>Terbuka sejak ${longDate(l.unlock)}</small></span></summary><div class="future-letter__body">${paras(l.text)}</div></details>`;
            const days = Math.ceil((t - n.ms) / DAY);
            return `<div class="glass future-letter is-locked reveal">${ic("lock")}<span><b>${esc(l.title)}</b><small>Terbuka ${longDate(l.unlock)} · ${days} hari lagi</small></span></div>`;
          })
          .join("")
      : empty("Belum ada surat masa depan.");
    $("#dreams-list").innerHTML = data.future.dreams.length
      ? data.future.dreams
          .map(
            (d, i) => `<article class="glass dream reveal" style="--d:${i * 80}ms">
      ${d.sample ? '<span class="badge">Contoh</span>' : ""}<h4>${esc(d.title)}</h4><p>${esc(d.text)}</p></article>`,
          )
          .join("")
      : empty("Belum ada mimpi yang ditulis.");
    icons();
    anim.reveal(box.closest("[data-view]"));
  }

  /* ---------- overlay (surat & lightbox) ---------- */
  let activeOverlay = null,
    lastFocus = null;
  const lb = { root: $("#lightbox"), media: $("#lb-media"), cap: $("#lb-caption"), date: $("#lb-date"), count: $("#lb-count"), prev: $("#lb-prev"), next: $("#lb-next") };
  const letterRoot = $("#letter-overlay");
  let lbList = [],
    lbIndex = 0,
    letterToken = 0,
    typer = null,
    envAnim = null;

  function openOverlay(root, focusEl) {
    lastFocus = document.activeElement;
    root.hidden = false;
    activeOverlay = root;
    document.body.classList.add("no-scroll");
    focusEl.focus({ preventScroll: true });
  }
  function closeOverlay() {
    if (!activeOverlay) return;
    const r = activeOverlay;
    r.hidden = true;
    activeOverlay = null;
    document.body.classList.remove("no-scroll");
    if (r === letterRoot) {
      letterToken++;
      if (typer) typer.cancel();
      if (envAnim) envAnim.kill();
    }
    if (r === lb.root) lb.media.innerHTML = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  document.addEventListener("keydown", (e) => {
    if (!activeOverlay) return;
    if (e.key === "Escape") {
      closeOverlay();
      return;
    }
    if (activeOverlay === lb.root && lbList.length > 1 && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      lbShow(lbIndex + (e.key === "ArrowRight" ? 1 : -1));
      return;
    }
    if (e.key === "Tab") {
      const f = $$('button,[href],input,video[controls],[tabindex]:not([tabindex="-1"])', activeOverlay).filter((x) => !x.disabled && x.getClientRects().length);
      if (!f.length) return;
      const first = f[0],
        last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  $$("[data-close]").forEach((b) => b.addEventListener("click", closeOverlay));

  function lbShow(i) {
    lbIndex = (i + lbList.length) % lbList.length;
    const m = lbList[lbIndex],
      v = m.type === "video";
    lb.media.innerHTML = "";
    const node = document.createElement(v ? "video" : "img");
    if (v) {
      node.controls = true;
      node.playsInline = true;
      node.preload = "metadata";
    } else {
      node.alt = m.caption;
      node.decoding = "async";
    }
    node.addEventListener(
      "error",
      () => {
        lb.media.innerHTML = `<div class="photo is-missing lightbox__ph">${placeholder(v ? "video" : "image", m.src)}</div>`;
      },
      { once: true },
    );
    node.src = m.src;
    lb.media.append(node);
    setText(lb.cap, m.caption);
    setText(lb.date, m.date ? longDate(m.date) : "");
    setText(lb.count, `${lbIndex + 1} / ${lbList.length}`);
    lb.prev.hidden = lb.next.hidden = lbList.length < 2;
  }
  function openLightbox(list, i) {
    if (i < 0) return;
    lbList = list;
    lbShow(i);
    openOverlay(lb.root, $(".overlay__close", lb.root));
  }
  lb.prev.addEventListener("click", () => lbShow(lbIndex - 1));
  lb.next.addEventListener("click", () => lbShow(lbIndex + 1));

  function openLetter(l) {
    if (!l) return;
    const token = ++letterToken,
      skip = $("#letter-skip"),
      body = $("#letter-typed"),
      paper = $("#letter");
    setText($("#letter-kicker"), l.kicker);
    setText($("#letter-title"), l.title);
    $("#letter-sr").textContent = l.text;
    $("#letter-ghost").textContent = l.text;
    body.textContent = "";
    skip.hidden = true;
    openOverlay(letterRoot, $(".overlay__close", letterRoot));
    envAnim = anim.openEnvelope($("#envelope"), paper);
    envAnim.done.then(() => {
      if (token !== letterToken) return;
      skip.hidden = false;
      typer = anim.typewriter(body, l.text, {
        onProgress: (p) => {
          if (paper.scrollHeight > paper.clientHeight) paper.scrollTop = (paper.scrollHeight - paper.clientHeight) * p;
        },
        onDone: () => {
          skip.hidden = true;
        },
      });
    });
  }
  $("#letter-skip").addEventListener("click", () => {
    if (typer) typer.finish();
    $("#letter").focus({ preventScroll: true });
  });

  /* ---------- router ---------- */
  const views = $$("[data-view]"),
    links = $$(".site-nav a");
  let entered = false,
    current = null;

  function show(id, focusHeading) {
    if (id === current) return;
    current = id;
    views.forEach((v) => {
      v.hidden = v.id !== id;
    });
    links.forEach((a) => {
      if (a.hash === "#" + id) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    const view = $("#" + id);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (id === "universe") universe.start();
    else universe.stop();
    anim.reveal(view);
    anim.showView(view);
    if (focusHeading) {
      const h = $("h2", view);
      if (h) h.focus({ preventScroll: true });
    }
    setNav(false);
  }
  function route(initial) {
    if (!entered) return;
    const id = (location.hash || "#home").slice(1);
    show(views.some((v) => v.id === id) ? id : "home", !initial);
  }

  const nav = $("#site-nav"),
    navBtn = $("#nav-toggle");
  function setNav(open) {
    nav.dataset.open = String(open);
    navBtn.setAttribute("aria-expanded", String(open));
    navBtn.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  }
  navBtn.addEventListener("click", () => setNav(nav.dataset.open !== "true"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !activeOverlay) setNav(false);
  });
  window.matchMedia("(min-width:1180px)").addEventListener("change", () => setNav(false));

  /* ---------- tick tiap detik ---------- */
  let lastDay = null;
  function tick() {
    const n = jakartaNow(),
      s = sinceParts(n);
    $$("[data-since]").forEach((c) => updateUnits(c, s));
    $$("[data-since-total]").forEach((e) => setText(e, `${s.total.toLocaleString("id-ID")} hari bersama`));
    $$("[data-special]").forEach((c) => updateSpecial(c, n));
    setText($("#home-title"), `${greeting(n.h)}, ${data.couple.partnerShort}.`);
    if (lastDay !== n.d) {
      lastDay = n.d;
      renderDaily(n);
      renderReasons(n);
      renderFuture(n);
    }
  }

  /* ---------- mulai ---------- */
  function onEnter() {
    const btn = $("#enter-btn");
    btn.disabled = true;
    ML.music.play(); // harus di dalam handler klik (aturan autoplay browser)
    anim.enter($("#welcome"), $("#app"), () => {
      entered = true;
      route(true);
    });
  }

  function init() {
    renderWelcome();
    renderHome();
    renderStory();
    renderLetters();
    renderMemories();
    renderUniverse();
    anim.initSky($("#sky"));
    tick();
    icons();
    anim.reveal();
    setInterval(tick, 1000);
    window.addEventListener("hashchange", () => route(false));
    $("#enter-btn").addEventListener("click", onEnter);

    const btn = $("#enter-btn");
    btn.disabled = true;
    const fontsReady = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]) : Promise.resolve();
    fontsReady
      .then(() =>
        anim.welcomeIntro({
          eyebrow: $(".welcome__eyebrow"),
          letters: $$(".logo__char"),
          ornament: $(".logo__ornament"),
          rule: $(".welcome__rule"),
          tagline: $(".welcome__tagline"),
          lines: $$(".welcome__message p"),
          sign: $(".welcome__sign"),
          button: btn,
        }),
      )
      .then(() => {
        btn.disabled = false;
      });
    setTimeout(() => {
      btn.disabled = false;
    }, 15000); // jaring pengaman jika animasi macet
  }
  init();
})();
