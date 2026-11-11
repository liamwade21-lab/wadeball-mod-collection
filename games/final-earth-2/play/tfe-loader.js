/*
  The Final Earth 2 in the browser: the page side.

  1. Loading: fetches the game program and the "boot pack" with a loading bar, then shows Play.
  2. window.tfefs: the game's files. Game files come from packs held in memory or are fetched from the
     server when first needed; everything the player makes (saves/...) is kept in the browser (IndexedDB).
     A game file's key is exactly the path the game asks for, e.g. "assets/original/sprites.png".
  3. Landscape: the game always shows sideways; a phone held upright gets a rotated picture.
  4. window.tfeinput: finger touches, handed to the game in the game's own (landscape) coordinates.

  The Rust side of this is src/vfs.rs and src/web.rs.
*/
(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const stage = $('stage'), loader = $('loader'), barFill = $('bar-fill'), statusEl = $('status');
  const playBtn = $('play'), noteEl = $('note'), toastEl = $('toast');
  const params = new URLSearchParams(location.search);
  const DEBUG = params.has('debug');
  const log = (...a) => { if (DEBUG) console.log('[tfe]', ...a); };

  // ------------------------------------------------------------------------------------------
  // The file store
  // ------------------------------------------------------------------------------------------
  const assets = new Map();   // game path -> Uint8Array (packs and files fetched so far)
  const files = new Map();    // lower-case game path -> its real spelling (the server is case-sensitive)
  const kids = new Map();     // lower-case folder -> Map(name -> 'f' | 'd')
  const user = new Map();     // 'saves/<path>' -> { data: Uint8Array, t: ms }
  const stats = { sync: 0, syncBytes: 0, fetched: 0, laterPacks: 0 };
  const warming = new Set();  // game files being fetched in the background (tfefs.ready)
  let laterPacks = [];        // packs fetched quietly once the menu is on screen
  let assetsV = '';
  let idb = null;
  let saveBroken = false;

  const isSaves = (p) => p === 'saves' || p.startsWith('saves/');

  // The manifest lists every game file with its full path, one per line.
  function addManifest(text) {
    for (const line of text.split('\n')) {
      const p = line.trim();
      if (!p) continue;
      files.set(p.toLowerCase(), p);
      const parts = p.split('/');
      let dir = '';
      for (let i = 0; i < parts.length; i++) {
        const key = dir.toLowerCase();
        let m = kids.get(key);
        if (!m) kids.set(key, (m = new Map()));
        if (!m.has(parts[i])) m.set(parts[i], i === parts.length - 1 ? 'f' : 'd');
        dir = dir ? dir + '/' + parts[i] : parts[i];
      }
    }
  }

  // The real spelling of a game file the server has, or undefined.
  const realAsset = (path) => files.get(path.toLowerCase());
  const assetUrl = (real) => 'files/' + real.split('/').map(encodeURIComponent).join('/') + '?v=' + assetsV;

  // A blocking fetch, for the moments the game asks for a file it needs right now. Binary data
  // comes through the old "x-user-defined" text trick (a blocking request may not ask for bytes).
  function syncFetch(url) {
    const x = new XMLHttpRequest();
    try {
      x.open('GET', url, false);
      x.overrideMimeType('text/plain; charset=x-user-defined');
      x.send();
    } catch (e) {
      return null;
    }
    if (x.status !== 200) return null;
    const s = x.responseText, n = s.length, out = new Uint8Array(n);
    for (let i = 0; i < n; i++) out[i] = s.charCodeAt(i) & 0xff;
    return out;
  }

  function persist(path) {
    if (!idb) return;
    const e = user.get(path);
    try {
      const tx = idb.transaction('files', 'readwrite');
      const st = tx.objectStore('files');
      if (e) st.put({ data: e.data, t: e.t }, path);
      else st.delete(path);
      tx.onabort = tx.onerror = () => saveFailed(tx.error);
    } catch (err) {
      saveFailed(err);
    }
  }

  function saveFailed(err) {
    console.warn('[tfe] could not save in this browser:', err);
    if (!saveBroken) toast('Could not save in this browser (its storage is full or switched off).');
    saveBroken = true;
  }

  let askedPersist = false;
  function askPersist() {
    if (askedPersist) return;
    askedPersist = true;
    try {
      if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
    } catch (e) { /* not supported */ }
  }

  // ------------------------------------------------------------------------------------------
  // Picking a file from the device (the game's Import windows)
  // ------------------------------------------------------------------------------------------
  let pick = { state: 2, data: undefined, input: null, id: 0, off: null };

  function pickClear() {
    if (pick.off) pick.off();
    if (pick.input && pick.input.parentNode) pick.input.parentNode.removeChild(pick.input);
    pick = { state: 2, data: undefined, input: null, id: pick.id, off: null };
  }

  function pickStart(accept) {
    pickClear();
    const id = ++pick.id;
    const input = document.createElement('input');
    input.type = 'file';
    // Phones and tablets do not know the game's own file endings (.sav ...) and would grey out
    // every file, so only a PC's file window is narrowed down to them.
    input.accept = isMobile ? '' : String(accept || '');
    input.style.cssText = 'position:fixed;left:-1000px;top:0;width:1px;height:1px;opacity:0;pointer-events:none';
    document.body.appendChild(input);
    let reading = false, timer = 0;
    const cur = () => pick.id === id && pick.input === input;
    const onFocus = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (cur() && pick.state === 0 && !reading && !(input.files && input.files.length)) pick.state = 2;
      }, 1500);
    };
    const onCancel = () => { if (cur() && !reading) pick.state = 2; };
    const onChange = async () => {
      if (!cur()) return;
      const f = input.files && input.files[0];
      if (!f) { pick.state = 2; return; }
      reading = true;
      try {
        const bytes = new Uint8Array(await f.arrayBuffer());
        if (cur()) { pick.data = bytes; pick.state = 1; }
      } catch (e) {
        if (cur()) pick.state = 2;
      }
    };
    input.addEventListener('change', onChange);
    input.addEventListener('cancel', onCancel);
    window.addEventListener('focus', onFocus);
    pick = {
      state: 0, data: undefined, input, id,
      off: () => { clearTimeout(timer); window.removeEventListener('focus', onFocus); input.removeEventListener('change', onChange); input.removeEventListener('cancel', onCancel); },
    };
    try { input.click(); } catch (e) { pick.state = 2; }
  }

  window.tfefs = {
    read(path) {
      if (isSaves(path)) {
        const e = user.get(path);
        return e ? e.data : undefined;
      }
      let d = assets.get(path);
      if (d) return d;
      const real = realAsset(path);
      if (!real) return undefined;
      d = assets.get(real);
      if (d) return d;
      d = syncFetch(assetUrl(real));
      if (!d) return undefined;
      stats.sync++;
      stats.syncBytes += d.length;
      log('fetched on the spot:', real, d.length);
      assets.set(real, d);
      return d;
    },
    write(path, data) {
      if (!isSaves(path)) return false;
      user.set(path, { data: data.slice(), t: Date.now() });   // copy: `data` is a view into the game's memory
      persist(path);
      askPersist();
      return true;
    },
    kind(path) {
      if (isSaves(path)) {
        if (user.has(path)) return 1;
        const pre = path + '/';
        for (const k of user.keys()) if (k.startsWith(pre)) return 2;
        return 0;
      }
      if (assets.has(path)) return 1;
      const r = path.toLowerCase();
      if (files.has(r)) return 1;
      return kids.has(r) ? 2 : 0;
    },
    mtime(path) {
      const e = user.get(path);
      return e ? e.t : -1;
    },
    remove(path) {
      if (!isSaves(path) || !user.has(path)) return false;
      user.delete(path);
      persist(path);
      return true;
    },
    rename(from, to) {
      if (!isSaves(from) || !isSaves(to)) return false;
      const e = user.get(from);
      if (!e) return false;
      user.delete(from);
      user.set(to, e);
      persist(from);
      persist(to);
      return true;
    },
    list(dir) {
      const out = [];
      if (isSaves(dir)) {
        const pre = dir + '/', seen = new Set();
        for (const [k, e] of user) {
          if (!k.startsWith(pre)) continue;
          const rest = k.slice(pre.length), cut = rest.indexOf('/');
          if (cut < 0) out.push(rest + '\tf\t' + e.t);
          else if (!seen.has(rest.slice(0, cut))) { seen.add(rest.slice(0, cut)); out.push(rest.slice(0, cut) + '\td\t-1'); }
        }
      } else {
        const m = kids.get(dir.toLowerCase());
        if (m) for (const [name, kind] of m) out.push(name + '\t' + kind + '\t-1');
      }
      return out.join('\n');
    },
    // Bevy's pictures and sounds: memory first, else a normal (non-blocking) request.
    async fetch(path) {
      let d = assets.get(path);
      if (d) return d;
      const real = realAsset(path);
      if (!real) return null;
      d = assets.get(real);
      if (d) return d;
      try {
        const r = await fetch(assetUrl(real));
        if (!r.ok) return null;
        stats.fetched++;
        return new Uint8Array(await r.arrayBuffer());
      } catch (e) {
        return null;
      }
    },
    // Are these game files (one per line) in memory? Files that are not get fetched in the
    // background, and the game asks again on a later frame - no waiting inside a frame.
    ready(list) {
      let all = true;
      for (const path of list.split('\n')) {
        if (!path || assets.has(path)) continue;
        const real = realAsset(path);
        if (!real) continue;                       // the server has no such file: nothing to wait for
        if (assets.has(real)) continue;
        all = false;
        if (warming.has(real)) continue;
        warming.add(real);
        const missing = () => { files.delete(real.toLowerCase()); };
        fetch(assetUrl(real))
          .then((r) => (r.ok ? r.arrayBuffer() : null))
          .then((buf) => (buf ? gunzip(new Uint8Array(buf)) : null))
          .then((d) => {
            if (!d) return missing();
            assets.set(real, d);
          })
          .catch(missing)
          .finally(() => warming.delete(real));
      }
      return all;
    },
    gameStarted() {
      loader.classList.add('gone');
      setTimeout(() => { loader.style.display = 'none'; }, 400);
      log('game on screen; blocking fetches so far:', stats.sync);
      try { document.getElementById('tfe-canvas').focus(); } catch (e) { /* keys work after the first click */ }
      loadLaterPacks();
    },
    stats,
    // the device's local date as "YYYY-M-D" (no zero padding), e.g. "2026-11-11"
    localDate() {
      const d = new Date();
      return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    },
    locale: () => navigator.language || '',
    // Saves bytes as a file on the user's device. Returns true when the download was started.
    download(name, data) {
      try {
        const copy = data.slice();   // `data` is a view into the game's memory
        const url = URL.createObjectURL(new Blob([copy], { type: 'application/octet-stream' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = String(name || 'download');
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { if (a.parentNode) a.parentNode.removeChild(a); URL.revokeObjectURL(url); }, 4000);
        return true;
      } catch (e) {
        log('download failed', e);
        return false;
      }
    },
    // File chooser: pickStart(accept), then pickState() (0 waiting, 1 ready, 2 cancelled / not started),
    // then pickTake() for the bytes.
    pickStart,
    pickState: () => pick.state,
    pickTake() {
      const d = pick.state === 1 ? pick.data : undefined;
      pickClear();
      return d;
    },
    toggleFullscreen() {
      try {
        const el = document.documentElement;
        if (isFull()) {
          const p = document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen && document.webkitExitFullscreen();
          if (p && p.catch) p.catch(() => {});
        } else {
          const p = el.requestFullscreen ? el.requestFullscreen() : el.webkitRequestFullscreen && el.webkitRequestFullscreen();
          if (p && p.catch) p.catch(() => {});
        }
      } catch (e) { /* not supported */ }
    },
    isFullscreen: () => isFull(),
    // frame-time measuring (src/perf.rs): on with ?debug; the newest line is kept for tests
    perfOn: () => DEBUG,
    perfLine(line) { window.tfefs.perfLast = line; log(line); },
    perfLast: '',
    // for the test page / the console: what is saved in this browser
    userFiles: () => [...user.keys()],
  };

  function isFull() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }

  // ------------------------------------------------------------------------------------------
  // Browser storage (IndexedDB): everything under saves/ is loaded once and written through
  // ------------------------------------------------------------------------------------------
  function openDb() {
    return new Promise((res) => {
      let rq;
      try { rq = indexedDB.open('finalearth2', 1); } catch (e) { return res(null); }
      rq.onupgradeneeded = () => rq.result.createObjectStore('files');
      rq.onsuccess = () => res(rq.result);
      rq.onerror = rq.onblocked = () => res(null);
    });
  }

  function loadUser(db) {
    return new Promise((res) => {
      try {
        const rq = db.transaction('files').objectStore('files').openCursor();
        rq.onsuccess = () => {
          const c = rq.result;
          if (!c) return res();
          user.set(c.key, { data: new Uint8Array(c.value.data), t: c.value.t });
          c.continue();
        };
        rq.onerror = () => res();
      } catch (e) { res(); }
    });
  }

  // ------------------------------------------------------------------------------------------
  // Downloads with a loading bar
  // ------------------------------------------------------------------------------------------
  const progress = { total: 1, got: new Map() };
  function showProgress() {
    let sum = 0;
    for (const v of progress.got.values()) sum += v;
    const f = Math.max(0, Math.min(1, sum / progress.total));
    barFill.style.width = (f * 100).toFixed(1) + '%';
    statusEl.textContent = 'Loading ' + Math.round(f * 100) + '%  (' + (sum / 1048576).toFixed(1) + ' of ' + (progress.total / 1048576).toFixed(1) + ' MB)';
  }

  // The response body as a stream that counts the bytes for the bar.
  function counted(resp, id) {
    const reader = resp.body.getReader();
    let got = 0;
    return new ReadableStream({
      async pull(ctrl) {
        const { done, value } = await reader.read();
        if (done) return ctrl.close();
        got += value.length;
        progress.got.set(id, got);
        showProgress();
        ctrl.enqueue(value);
      },
      cancel: (r) => reader.cancel(r),
    });
  }

  // Test help (?debug only): how long the game is busy inside each frame, measured by the page.
  // tfePerf() gives the numbers since its last call: frames per second, busy milliseconds per frame
  // (average and worst), and the game's own newest line.
  if (DEBUG) {
    const realRaf = window.requestAnimationFrame.bind(window);
    const m = { frames: 0, busy: 0, worst: 0, since: performance.now() };
    window.requestAnimationFrame = (cb) => realRaf((t) => {
      const s = performance.now();
      try { cb(t); } finally {
        const d = performance.now() - s;
        m.frames++; m.busy += d; m.worst = Math.max(m.worst, d);
      }
    });
    window.tfePerf = () => {
      const now = performance.now(), secs = (now - m.since) / 1000;
      const out = { fps: +(m.frames / secs).toFixed(1), busyMs: +(m.busy / Math.max(1, m.frames)).toFixed(1), worstMs: +m.worst.toFixed(1), game: window.tfefs.perfLast };
      m.frames = 0; m.busy = 0; m.worst = 0; m.since = now;
      return out;
    };
  }

  const isGzip = (b) => b.length > 2 && b[0] === 0x1f && b[1] === 0x8b;

  async function gunzip(bytes) {
    if (!isGzip(bytes)) return bytes;   // the server already unpacked it
    const s = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Uint8Array(await new Response(s).arrayBuffer());
  }

  async function download(item) {
    const r = await fetch(item.url + '?v=' + item.v);
    if (!r.ok) throw new Error(item.url + ': the server answered ' + r.status);
    const raw = new Uint8Array(await new Response(counted(r, item.url)).arrayBuffer());
    return gunzip(raw);
  }

  // Pack: "TFPK", u32 count, then per file { u16 name length, name, u32 size }, then all the data.
  // A file is stored under its own name (the full game path).
  function unpack(bytes) {
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) !== 'TFPK') throw new Error('bad pack file');
    const n = dv.getUint32(4, true), td = new TextDecoder();
    let p = 8;
    const entries = [];
    for (let i = 0; i < n; i++) {
      const nl = dv.getUint16(p, true); p += 2;
      const name = td.decode(bytes.subarray(p, p + nl)); p += nl;
      const size = dv.getUint32(p, true); p += 4;
      entries.push([name, size]);
    }
    for (const [name, size] of entries) {
      assets.set(name, bytes.subarray(p, p + size));
      p += size;
    }
    return entries.length;
  }

  // Packs that are not needed for the menu come in quietly afterwards.
  // A file the game needs before its pack has arrived is simply fetched by itself.
  async function loadLaterPacks() {
    for (const p of laterPacks) {
      try {
        const r = await fetch(p.url + '?v=' + p.v);
        if (!r.ok) continue;
        const n = unpack(await gunzip(new Uint8Array(await r.arrayBuffer())));
        stats.laterPacks++;
        log('background pack loaded:', p.url, n, 'files');
      } catch (e) {
        log('background pack failed (files will be fetched one by one):', p.url, e);
      }
    }
  }

  // ------------------------------------------------------------------------------------------
  // Landscape: the stage is always wider than tall. A touch device held upright gets the stage
  // turned a quarter (its top along the screen's right edge), like the original on a phone.
  // ------------------------------------------------------------------------------------------
  const isTouch = params.has('touch') || navigator.maxTouchPoints > 0 || matchMedia('(pointer: coarse)').matches;
  // A phone or tablet (the game's phone mode, the turned picture, full screen on Play). A PC with a
  // touch screen is not one: fingers work there too, but the game keeps its PC layout.
  const isMobile = params.has('touch') || /Android|iPhone|iPad|iPod|Mobile|Silk|Kindle|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const forceRotate = params.has('rotate');
  let rotated = false;

  // The parts of the screen a phone covers with its camera island, rounded corners and home bar
  // ("safe area"). The page reaches under them (so nothing is white there), but the game's picture
  // stays clear of them: its buttons sit right at the picture's edges.
  // Test help: ?inset=top,right,bottom,left (in px) pretends to be such a phone.
  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;' +
    'padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';
  document.body.appendChild(probe);
  function insets() {
    if (params.has('inset')) {
      const v = params.get('inset').split(',').map((x) => parseFloat(x) || 0);
      return { t: v[0] || 0, r: v[1] || 0, b: v[2] || 0, l: v[3] || 0 };
    }
    const cs = getComputedStyle(probe), px = (x) => Math.max(0, parseFloat(x) || 0);
    return { t: px(cs.paddingTop), r: px(cs.paddingRight), b: px(cs.paddingBottom), l: px(cs.paddingLeft) };
  }

  // Where the game's picture is on the page: x, y of the free area's corner and its width and height.
  let area = { x: 0, y: 0, w: 1, h: 1 };
  function layout() {
    const w = window.innerWidth, h = window.innerHeight, i = insets();
    area = { x: i.l, y: i.t, w: Math.max(1, w - i.l - i.r), h: Math.max(1, h - i.t - i.b) };
    rotated = forceRotate || (isMobile && h > w);
    stage.style.left = stage.style.top = '0';
    if (rotated) {
      stage.style.width = area.h + 'px';
      stage.style.height = area.w + 'px';
      stage.style.transform = 'translate(' + (area.x + area.w) + 'px,' + area.y + 'px) rotate(90deg)';
    } else {
      stage.style.width = area.w + 'px';
      stage.style.height = area.h + 'px';
      stage.style.transform = 'translate(' + area.x + 'px,' + area.y + 'px)';
    }
    document.body.classList.toggle('upright', isMobile && h > w);
  }
  window.addEventListener('resize', layout);
  window.addEventListener('orientationchange', () => { setTimeout(layout, 60); setTimeout(layout, 400); });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', layout);
  layout();
  // a phone may report its covered edges a moment after the page opens (Home Screen app start)
  setTimeout(layout, 300);
  setTimeout(layout, 1200);

  // An iPhone's Safari does not let a page hide its bars. Started from the Home Screen the game has the
  // whole screen, so the loading screen says how to put it there (only in Safari on an iPhone or iPad).
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = navigator.standalone === true || matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches;
  if ((isIOS || params.has('iostip')) && !standalone) document.body.classList.add('ios-tip');

  async function goLandscape() {
    if (!isMobile || params.has('nofullscreen')) return;
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) await el.requestFullscreen({ navigationUI: 'hide' });
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } catch (e) { log('no fullscreen', e); }
    try {
      if (screen.orientation && screen.orientation.lock) await screen.orientation.lock('landscape');
    } catch (e) { log('no orientation lock (the picture is turned instead)', e); }
    layout();
  }

  // ------------------------------------------------------------------------------------------
  // Touches -> the game. The game gets them in stage (landscape) coordinates; the browser's own
  // touch handling (scrolling, zooming, long-press menus) is switched off on the stage.
  // ------------------------------------------------------------------------------------------
  const queue = [];
  const fingers = new Map();
  const touchAsMouse = params.has('touch');   // test help: the mouse acts as one finger

  // Where a touch is on the stage, as fractions (0..1 across, 0..1 down). The game multiplies them by
  // its own picture size, so nothing depends on how this browser counts pixels.
  function stagePoint(e) {
    const x = e.clientX - area.x, y = e.clientY - area.y;
    return rotated ? [y / area.h, (area.w - x) / area.w] : [x / area.w, y / area.h];
  }

  function onPointer(kind, e) {
    const finger = e.pointerType === 'touch' || e.pointerType === 'pen' || (touchAsMouse && e.pointerType === 'mouse');
    if (!finger) return;
    if (kind === 'd' && !stage.contains(e.target)) return;      // the loading screen keeps its own taps
    if (kind !== 'd' && !fingers.has(e.pointerId)) return;
    if (kind === 'm' && touchAsMouse && e.pointerType === 'mouse' && e.buttons === 0) return;
    const [x, y] = stagePoint(e);
    if (kind === 'd' || kind === 'u') wakeAudio();   // a tap is what lets the browser start the sound
    if (kind === 'd') fingers.set(e.pointerId, true);
    if (kind === 'u' || kind === 'c') fingers.delete(e.pointerId);
    queue.push(kind + ' ' + e.pointerId + ' ' + x.toFixed(5) + ' ' + y.toFixed(5));
    e.preventDefault();
    e.stopImmediatePropagation();   // the game's own (mouse) listeners never see finger events
  }
  window.addEventListener('pointerdown', (e) => onPointer('d', e), { capture: true, passive: false });
  window.addEventListener('pointermove', (e) => onPointer('m', e), { capture: true, passive: false });
  window.addEventListener('pointerup', (e) => onPointer('u', e), { capture: true, passive: false });
  window.addEventListener('pointercancel', (e) => onPointer('c', e), { capture: true, passive: false });
  for (const t of ['touchstart', 'touchmove', 'touchend', 'gesturestart', 'gesturechange', 'contextmenu', 'selectstart', 'dblclick']) {
    stage.addEventListener(t, (e) => e.preventDefault(), { passive: false });
  }

  window.tfeinput = {
    // All touch events since the last call, one per line: "<d|m|u|c> <finger id> <x> <y>"
    // (x and y are fractions of the stage's width and height).
    take() {
      if (!queue.length) return '';
      const s = queue.join('\n');
      queue.length = 0;
      return s;
    },
    isTouch: () => isTouch,
    isMobile: () => isMobile,
    rotated: () => rotated,
    // A phone has no keys for the game's text fields (city name, notes): ask with the browser's
    // own small text box, which brings up the phone's keyboard. Returns nothing when cancelled.
    askText(title, current) {
      let t = null;
      try { t = window.prompt(title || 'Type the text', current || ''); } catch (e) { t = null; }
      fingers.clear();
      queue.length = 0;
      return t === null ? undefined : String(t).slice(0, 200);
    },
  };

  // ------------------------------------------------------------------------------------------
  // Sound: browsers only let a page play sound after a tap or key press. Keep a list of the
  // page's audio outputs and wake them on the first input.
  // ------------------------------------------------------------------------------------------
  const audioContexts = [];
  for (const name of ['AudioContext', 'webkitAudioContext']) {
    const Real = window[name];
    if (!Real) continue;
    window[name] = new Proxy(Real, {
      construct(target, args) {
        const ctx = new target(...args);
        audioContexts.push(ctx);
        return ctx;
      },
    });
  }
  function wakeAudio() {
    for (const c of audioContexts) if (c.state === 'suspended') c.resume().catch(() => {});
  }
  if (DEBUG && window.AudioNode) {
    // Test help (?debug only): listen in on whatever is sent to the speakers, so a test can tell
    // real sound from silence. tfeAudioLevel() gives the loudest sample of the last moment (0 = silent).
    const realConnect = AudioNode.prototype.connect;
    const probes = new Map();
    AudioNode.prototype.connect = function (dest, ...rest) {
      if (dest && dest === (this.context && this.context.destination)) {
        let a = probes.get(this.context);
        if (!a) { a = this.context.createAnalyser(); a.fftSize = 2048; probes.set(this.context, a); }
        realConnect.call(this, a);
      }
      return realConnect.call(this, dest, ...rest);
    };
    window.tfeAudioLevel = () => {
      let peak = 0;
      for (const a of probes.values()) {
        const buf = new Float32Array(a.fftSize);
        a.getFloatTimeDomainData(buf);
        for (const v of buf) peak = Math.max(peak, Math.abs(v));
      }
      return { contexts: audioContexts.map((c) => c.state), peak };
    };
  }
  for (const t of ['pointerdown', 'pointerup', 'keydown', 'touchend']) window.addEventListener(t, wakeAudio, { capture: true });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) wakeAudio(); });

  // ------------------------------------------------------------------------------------------
  // Start
  // ------------------------------------------------------------------------------------------
  let toastTimer = 0;
  function toast(text) {
    toastEl.textContent = text;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 6000);
  }

  function fail(what, err) {
    console.error('[tfe]', what, err);
    loader.style.display = '';
    loader.classList.remove('gone');
    loader.classList.add('failed');
    statusEl.textContent = what;
    noteEl.textContent = err && err.message ? err.message : String(err || '');
    playBtn.style.display = 'none';
  }

  async function boot() {
    if (typeof WebAssembly !== 'object' || typeof DecompressionStream !== 'function' || !document.createElement('canvas').getContext('webgl2')) {
      return fail('This browser is too old to run the game.', 'It needs WebGL 2 and WebAssembly. Try a current Chrome, Edge, Firefox or Safari.');
    }
    statusEl.textContent = 'Loading...';
    let info;
    try {
      const r = await fetch('boot.json', { cache: 'no-cache' });
      if (!r.ok) throw new Error('boot.json: the server answered ' + r.status);
      info = await r.json();
    } catch (e) {
      return fail('The game files could not be found.', e);
    }
    assetsV = info.assets || '';
    const wasm = { url: info.wasm.url, size: info.wasm.size, v: info.build };
    const packs = info.packs.map((p) => ({ url: p.url, size: p.size, v: info.assets }));
    laterPacks = (info.later || []).map((p) => ({ url: p.url, v: info.assets }));
    progress.total = wasm.size + packs.reduce((s, p) => s + p.size, 0);
    showProgress();

    // saved cities from this browser
    const userReady = openDb().then(async (db) => {
      idb = db;
      if (db) await loadUser(db);
      else noteEl.textContent = 'This browser will not keep your cities after you close the tab (its storage is switched off, e.g. private browsing).';
    });

    let module, glue;
    try {
      const wasmReady = download(wasm).then((bytes) => WebAssembly.compile(bytes));
      const packsReady = Promise.all(packs.map((p) => download(p).then((bytes) => unpack(bytes))));
      // The glue code is loaded as text and imported from memory, so it works whatever file type the
      // web server reports for .js files.
      const glueReady = fetch(info.js + '?v=' + info.build)
        .then((r) => { if (!r.ok) throw new Error(info.js + ': the server answered ' + r.status); return r.text(); })
        .then((text) => import(URL.createObjectURL(new Blob([text], { type: 'text/javascript' }))));
      [module, glue] = await Promise.all([wasmReady, glueReady, packsReady, userReady]);
    } catch (e) {
      return fail('Loading failed. Check your connection and reload the page.', e);
    }
    const manifest = assets.get('manifest.txt');
    if (manifest) addManifest(new TextDecoder().decode(manifest));
    barFill.style.width = '100%';
    statusEl.textContent = 'Ready';
    log('saved files in this browser:', user.size);

    const start = async () => {
      playBtn.disabled = true;
      playBtn.textContent = 'Starting...';
      statusEl.textContent = 'Starting the game...';
      wakeAudio();
      await goLandscape();
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));   // let "Starting" paint
      try {
        await glue.default({ module_or_path: module });
      } catch (e) {
        // Bevy leaves its start function by throwing on purpose; anything else is a real error.
        if (!String(e && e.message ? e.message : e).includes("Using exceptions for control flow")) fail('The game stopped with an error.', e);
      }
    };
    playBtn.style.display = '';
    playBtn.addEventListener('click', start, { once: true });
    if (params.has('autostart')) start();
  }

  window.addEventListener('error', (e) => {
    const m = String(e.message || '');
    if (m.includes('unreachable') || m.includes('RuntimeError') || m.includes('panicked')) fail('The game stopped with an error. Reload the page to start again.', m);
  });

  boot();
})();
