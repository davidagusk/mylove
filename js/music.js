/* music.js — pemutar musik persisten. Tidak pernah memutar sebelum ada interaksi
 * pengguna (play() dipanggil dari tombol "Enter My Universe"). File yang hilang
 * ditangani dengan pesan, bukan error. */
(() => {
  'use strict';
  const ML = (window.MyLove = window.MyLove || {});
  const tracks = (ML.data && ML.data.music) || [];
  const $ = id => document.getElementById(id);
  const player = $('player'), toggle = $('pl-toggle'), title = $('pl-title'), status = $('pl-status');
  const vol = $('pl-volume'), repeatBtn = $('pl-repeat'), nextBtn = $('pl-next');

  const audio = new Audio();
  audio.preload = 'none';
  let index = 0, repeat = false;
  const missing = new Set();

  const store = {
    get(k, d) { try { const v = localStorage.getItem('mylove:' + k); return v === null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('mylove:' + k, v); } catch (e) { /* storage diblokir: abaikan */ } }
  };
  const say = msg => { status.textContent = msg; };

  function load(i) {
    index = i;
    const t = tracks[i];
    title.textContent = t ? t.title : 'Belum ada musik';
    if (!t) { say('Tambahkan lagu di data.js'); return; }
    audio.src = t.src;
    audio.loop = repeat && tracks.length === 1;
    say(missing.has(i) ? 'File musik belum ditambahkan' : 'Siap diputar');
  }

  function markMissing() {
    if (missing.has(index)) return;
    missing.add(index);
    say('File musik belum ditambahkan');
    if (ML.toast) ML.toast(`Musik belum ada. Taruh file di ${tracks[index].src}`);
  }

  function play() {
    if (!tracks.length) { if (ML.toast) ML.toast('Belum ada lagu di data.js'); return Promise.resolve(); }
    if (missing.has(index) && tracks.length > 1) next(true);
    return audio.play().catch(err => {
      if (err && err.name === 'NotAllowedError') say('Ketuk play untuk memutar');
      else markMissing();
    });
  }
  const pause = () => audio.pause();

  function next(auto) {
    if (tracks.length < 2) return;
    const wasPlaying = !audio.paused || auto === true;
    load((index + 1) % tracks.length);
    if (wasPlaying) audio.play().catch(markMissing);
  }

  audio.addEventListener('play', () => { player.dataset.playing = 'true'; toggle.setAttribute('aria-label', 'Jeda musik'); say('Sedang diputar'); });
  audio.addEventListener('pause', () => { player.dataset.playing = 'false'; toggle.setAttribute('aria-label', 'Putar musik'); if (!missing.has(index)) say('Dijeda'); });
  audio.addEventListener('error', markMissing);
  audio.addEventListener('ended', () => {
    if (tracks.length < 2) return;
    if (index === tracks.length - 1 && !repeat) return;
    next(true);
  });

  toggle.addEventListener('click', () => (audio.paused ? play() : pause()));
  nextBtn.hidden = tracks.length < 2;
  nextBtn.addEventListener('click', () => next());
  repeatBtn.addEventListener('click', () => {
    repeat = !repeat;
    repeatBtn.setAttribute('aria-pressed', String(repeat));
    audio.loop = repeat && tracks.length === 1;
  });
  vol.addEventListener('input', () => { audio.volume = +vol.value; store.set('volume', vol.value); });

  vol.value = store.get('volume', '0.6');
  audio.volume = +vol.value;
  player.dataset.playing = 'false';
  load(0);

  ML.music = { play, pause };
})();
