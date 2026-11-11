/*
  Blocksworld in the browser: the page side.

  1. Loading: fetches the game program and the "boot pack" with a loading bar, then shows Play.
  2. window.bwfs: the game's files. Assets come from packs held in memory or are fetched from the
     server when first needed; everything the player makes is kept in the browser (IndexedDB).
  3. Landscape: the game always shows sideways; a phone held upright gets a rotated picture.
  4. window.bwinput: finger touches, handed to the game in the game's own (landscape) coordinates.

  The Rust side of this is src/vfs.rs and src/web.rs.
*/
(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const stage = $('stage'), loader = $('loader'), barFill = $('bar-fill'), statusEl = $('status');
  const playBtn = $('play'), noteEl = $('note'), toastEl = $('toast');
  const params = new URLSearchParams(location.search);
  const DEBUG = params.has('debug');
  const log = (...a) => { if (DEBUG) console.log('[bw]', ...a); };

  // ------------------------------------------------------------------------------------------
  // The file store
  // ------------------------------------------------------------------------------------------
  const assets = new Map();   // 'assets/<path>' -> Uint8Array (packs and files fetched so far)
  const once = new Set();     // big one-time files: dropped from memory after the game read them
  const files = new Map();    // lower-case asset path -> its real spelling (the server is case-sensitive)
  const kids = new Map();     // lower-case folder -> Map(name -> 'f' | 'd')
  const user = new Map();     // 'user/<path>' -> { data: Uint8Array, t: ms }
  const stats = { sync: 0, syncBytes: 0, fetched: 0, laterPacks: 0 };
  const warming = new Set();  // asset files being fetched in the background (bwfs.ready)
  let laterPacks = [];        // packs fetched quietly once the menu is on screen
  let assetsV = '';
  let idb = null;
  let saveBroken = false;

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

  const rel = (path) => (path.startsWith('assets/') ? path.slice(7) : path === 'assets' ? '' : path);
  const realAsset = (path) => files.get(rel(path).toLowerCase());
  const assetUrl = (real) => 'assets/' + real.split('/').map(encodeURIComponent).join('/') + (assetsV ? '?v=' + assetsV : '');

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
    console.warn('[bw] could not save in this browser:', err);
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

  window.bwfs = {
    read(path) {
      if (path.startsWith('user/')) {
        const e = user.get(path);
        return e ? e.data : undefined;
      }
      let d = assets.get(path);
      if (d) {
        if (once.has(path)) { assets.delete(path); once.delete(path); }
        return d;
      }
      const real = realAsset(path);
      if (!real) return undefined;
      const key = 'assets/' + real;
      d = assets.get(key);
      if (d) return d;
      d = syncFetch(assetUrl(real));
      if (!d) return undefined;
      stats.sync++;
      stats.syncBytes += d.length;
      log('fetched on the spot:', real, d.length);
      assets.set(key, d);
      return d;
    },
    write(path, data) {
      if (!path.startsWith('user/')) return false;
      user.set(path, { data: data.slice(), t: Date.now() });   // copy: `data` is a view into the game's memory
      persist(path);
      askPersist();
      return true;
    },
    kind(path) {
      if (path === 'user' || path.startsWith('user/')) {
        if (user.has(path)) return 1;
        const pre = path + '/';
        for (const k of user.keys()) if (k.startsWith(pre)) return 2;
        return 0;
      }
      if (assets.has(path)) return 1;
      const r = rel(path).toLowerCase();
      if (files.has(r)) return 1;
      return kids.has(r) ? 2 : 0;
    },
    mtime(path) {
      const e = user.get(path);
      return e ? e.t : -1;
    },
    remove(path) {
      if (!path.startsWith('user/') || !user.has(path)) return false;
      user.delete(path);
      persist(path);
      return true;
    },
    rename(from, to) {
      if (!from.startsWith('user/') || !to.startsWith('user/')) return false;
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
      if (dir === 'user' || dir.startsWith('user/')) {
        const pre = dir + '/', seen = new Set();
        for (const [k, e] of user) {
          if (!k.startsWith(pre)) continue;
          const rest = k.slice(pre.length), cut = rest.indexOf('/');
          if (cut < 0) out.push(rest + '\tf\t' + e.t);
          else if (!seen.has(rest.slice(0, cut))) { seen.add(rest.slice(0, cut)); out.push(rest.slice(0, cut) + '\td\t-1'); }
        }
      } else {
        const m = kids.get(rel(dir).toLowerCase());
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
      d = assets.get('assets/' + real);
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
    // Are these asset files (one per line) in memory? Files that are not get fetched in the
    // background, and the game asks again on a later frame - no waiting inside a frame.
    ready(list) {
      let all = true;
      for (const path of list.split('\n')) {
        if (!path || assets.has(path)) continue;
        const real = realAsset(path);
        if (!real) continue;                       // the server has no such file: nothing to wait for
        const key = 'assets/' + real;
        if (assets.has(key)) continue;
        all = false;
        if (warming.has(key)) continue;
        warming.add(key);
        fetch(assetUrl(real))
          .then((r) => (r.ok ? r.arrayBuffer() : null))
          .then((buf) => { if (buf) assets.set(key, new Uint8Array(buf)); else files.delete(real.toLowerCase()); })
          .catch(() => { files.delete(real.toLowerCase()); })
          .finally(() => warming.delete(key));
      }
      return all;
    },
    gameStarted() {
      loader.classList.add('gone');
      setTimeout(() => { loader.style.display = 'none'; }, 400);
      log('game on screen; blocking fetches so far:', stats.sync);
      try { document.getElementById('bw-canvas').focus(); } catch (e) { /* keys work after the first click */ }
      loadLaterPacks();
    },
    stats,
    // for the test page / the console: what is saved in this browser
    userFiles: () => [...user.keys()],
  };

  // ------------------------------------------------------------------------------------------
  // Browser storage (IndexedDB): everything under user/ is loaded once and written through
  // ------------------------------------------------------------------------------------------
  function openDb() {
    return new Promise((res) => {
      let rq;
      try { rq = indexedDB.open('blocksworld', 1); } catch (e) { return res(null); }
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

  // Pack: "BWPK", u32 count, then per file { u16 name length, name, u32 size }, then all the data.
  function unpack(bytes, dropAfterRead) {
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) !== 'BWPK') throw new Error('bad pack file');
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
      const key = 'assets/' + name;
      assets.set(key, bytes.subarray(p, p + size));
      if (dropAfterRead) once.add(key);
      p += size;
    }
    return entries.length;
  }

  // Packs that are not needed for the menu (the small block textures) come in quietly afterwards.
  // A file the game needs before its pack has arrived is simply fetched by itself.
  async function loadLaterPacks() {
    for (const p of laterPacks) {
      try {
        const r = await fetch(p.url + '?v=' + p.v);
        if (!r.ok) continue;
        const n = unpack(await gunzip(new Uint8Array(await r.arrayBuffer())), false);
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
  const forceRotate = params.has('rotate');
  let rotated = false;

  function layout() {
    const w = window.innerWidth, h = window.innerHeight;
    rotated = forceRotate || (isTouch && h > w);
    if (rotated) {
      stage.style.width = h + 'px';
      stage.style.height = w + 'px';
      stage.style.transform = 'translate(' + w + 'px,0) rotate(90deg)';
    } else {
      stage.style.width = w + 'px';
      stage.style.height = h + 'px';
      stage.style.transform = '';
    }
    document.body.classList.toggle('upright', isTouch && h > w);
  }
  window.addEventListener('resize', layout);
  window.addEventListener('orientationchange', () => setTimeout(layout, 60));
  if (window.visualViewport) window.visualViewport.addEventListener('resize', layout);
  layout();

  async function goLandscape() {
    if (!isTouch || params.has('nofullscreen')) return;
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
    const w = window.innerWidth, h = window.innerHeight;
    return rotated ? [e.clientY / h, (w - e.clientX) / w] : [e.clientX / w, e.clientY / h];
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

  window.bwinput = {
    // All touch events since the last call, one per line: "<d|m|u|c> <finger id> <x> <y>"
    // (x and y are fractions of the stage's width and height).
    take() {
      if (!queue.length) return '';
      const s = queue.join('\n');
      queue.length = 0;
      return s;
    },
    isTouch: () => isTouch,
    rotated: () => rotated,
    // A phone has no keys for the game's text fields (world name, model name): ask with the browser's
    // own small text box, which brings up the phone's keyboard. Returns nothing when cancelled.
    askText() {
      let t = null;
      try { t = window.prompt('Type the name'); } catch (e) { t = null; }
      fingers.clear();
      queue.length = 0;
      return t === null ? undefined : String(t).slice(0, 60);
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
    // real sound from silence. bwAudioLevel() gives the loudest sample of the last moment (0 = silent).
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
    window.bwAudioLevel = () => {
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
    console.error('[bw]', what, err);
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
    const packs = info.packs.map((p) => ({ url: p.url, size: p.size, once: !!p.once, v: info.assets }));
    laterPacks = (info.later || []).map((p) => ({ url: p.url, v: info.assets }));
    progress.total = wasm.size + packs.reduce((s, p) => s + p.size, 0);
    showProgress();

    // saved worlds from this browser
    const userReady = openDb().then(async (db) => {
      idb = db;
      if (db) await loadUser(db);
      else noteEl.textContent = 'This browser will not keep your worlds after you close the tab (its storage is switched off, e.g. private browsing).';
    });

    let module, glue;
    try {
      const wasmReady = download(wasm).then((bytes) => WebAssembly.compile(bytes));
      const packsReady = Promise.all(packs.map((p) => download(p).then((bytes) => unpack(bytes, p.once))));
      // The glue code is loaded as text and imported from memory, so it works whatever file type the
      // web server reports for .js files.
      const glueReady = fetch(info.js + '?v=' + info.build)
        .then((r) => { if (!r.ok) throw new Error(info.js + ': the server answered ' + r.status); return r.text(); })
        .then((text) => import(URL.createObjectURL(new Blob([text], { type: 'text/javascript' }))));
      [module, glue] = await Promise.all([wasmReady, glueReady, packsReady, userReady]);
    } catch (e) {
      return fail('Loading failed. Check your connection and reload the page.', e);
    }
    const manifest = assets.get('assets/manifest.txt');
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
