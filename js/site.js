/* Builds every page from data/mods.js. Pages say which one they are with <body data-page="...">. */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var MODS = window.MODS || [];
  var CATS = window.CATEGORIES || [{ id: "mods", title: "Mods", noun: "mod", badge: "Unofficial fan mod", soon: "" }];
  function catOf(m) { return CATS.find(function (c) { return c.id === (m.category || "mods"); }) || CATS[0]; }
  var page = document.body.dataset.page;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function url(path) { return esc(encodeURI(path)); }
  // A small tag beside an entry's name (`nameTag` in data/mods.js, e.g. "Expanded"); `nameTagNote`
  // is the text shown when the pointer rests on it.
  function nameTag(m) {
    if (!m.nameTag) return "";
    return ' <small class="name-tag"' + (m.nameTagNote ? ' title="' + esc(m.nameTagNote) + '"' : "") + '>' + esc(m.nameTag) + '</small>';
  }
  function fmtDate(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  var MARK = '<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><rect x="1.5" y="1.5" width="29" height="29" rx="8" fill="none" stroke="currentColor" stroke-width="3"/><path d="M7 10l3.2 12L16 13l5.8 9L25 10" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/></svg>';
  var ICON_DL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16"/></svg>';
  var ICON_PLAY = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 0l9 5-9 5z" fill="#fff"/></svg>';
  var ICON_PLAY_SM = '<svg viewBox="0 0 10 10" style="width:12px;height:12px" aria-hidden="true"><path d="M1 0l9 5-9 5z" fill="currentColor"/></svg>';

  /* Shared header and footer */
  function header() {
    var el = document.getElementById("site-header");
    if (!el) return;
    el.className = "site-header";
    el.innerHTML =
      '<div class="wrap">' +
        '<a class="brand" href="index.html">' + MARK +
          '<span class="brand-name">Wadeball<small>Mod Collection</small></span></a>' +
        '<nav class="nav" aria-label="Main">' +
          CATS.map(function (c) { return '<a href="index.html#' + esc(c.id) + '">' + esc(c.title) + '</a>'; }).join("") +
          '<a href="support.html"' + (page === "support" ? ' aria-current="page"' : "") + '>Support</a>' +
          (SITE.contactEmail ?
            '<div class="contact">' +
              '<button type="button" class="contact-btn" aria-expanded="false" aria-controls="contact-pop">Contact</button>' +
              '<div class="contact-pop" id="contact-pop" hidden>' +
                '<span>Email me at</span>' +
                '<a href="mailto:' + esc(SITE.contactEmail) + '">' + esc(SITE.contactEmail) + '</a>' +
                '<button type="button" class="btn copy-btn contact-copy">Copy address</button>' +
              '</div>' +
            '</div>' : "") +
        '</nav>' +
      '</div>';
    contactMenu(el);
  }

  // The Contact button opens a small box with the email address (a mail link plus a Copy button,
  // for PCs that have no mail app set up). Clicking elsewhere or pressing Escape closes it.
  function contactMenu(root) {
    var btn = root.querySelector(".contact-btn");
    if (!btn) return;
    var pop = root.querySelector(".contact-pop");
    var copy = root.querySelector(".contact-copy");
    function show(open) { pop.hidden = !open; btn.setAttribute("aria-expanded", open ? "true" : "false"); }
    btn.addEventListener("click", function (e) { e.stopPropagation(); show(pop.hidden); });
    pop.addEventListener("click", function (e) { e.stopPropagation(); });
    document.addEventListener("click", function () { show(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !pop.hidden) { show(false); btn.focus(); } });
    copy.addEventListener("click", function () {
      var done = function () { copy.textContent = "Copied"; setTimeout(function () { copy.textContent = "Copy address"; }, 2000); };
      if (navigator.clipboard) navigator.clipboard.writeText(SITE.contactEmail).then(done, done); else done();
    });
  }

  function footer() {
    var el = document.getElementById("site-footer");
    if (!el) return;
    var strip = page === "support" ? "" :
      '<section class="support-strip"><div class="wrap">' +
        '<p><strong>Enjoying the mods and games?</strong> They\'re free. If you want to support them, here\'s my Venmo.</p>' +
        '<a class="btn btn-ghost" href="support.html">Support my work</a>' +
      '</div></section>';
    el.innerHTML = strip +
      '<footer class="site-footer"><div class="wrap">' +
        '<span>&copy; ' + new Date().getFullYear() + ' ' + esc(SITE.name) + '. Fan-made mods and games, not affiliated with any game studio.</span>' +
        '<span><a href="index.html">Home</a> &middot; <a href="support.html">Support</a></span>' +
      '</div></footer>';
  }

  /* Home: one section of cards per category */
  function card(m) {
    var c = catOf(m);
    return '<a class="card" href="mod.html?id=' + encodeURIComponent(m.id) + '" style="--accent:' + esc(m.accent || "") + '">' +
      '<div class="card-media">' +
        '<img src="' + url(m.cover) + '" alt="" loading="lazy">' +
        (m.heroVideo ? '<video muted loop playsinline preload="none" data-src="' + url(m.heroVideo) + '"></video>' : "") +
      '</div>' +
      '<div class="card-body">' +
        '<div class="card-meta"><span class="tag tag-accent">' + esc(m.label || m.game) + '</span><span class="tag">v' + esc(m.version) + '</span></div>' +
        '<h3>' + esc(m.name) + nameTag(m) + '</h3>' +
        '<p>' + esc(m.pitch) + '</p>' +
        '<span class="card-cta">View ' + esc(c.noun) + ' &rarr;</span>' +
      '</div></a>';
  }

  function home() {
    var grid = document.getElementById("catalog");
    grid.innerHTML = CATS.map(function (c) {
      var items = MODS.filter(function (m) { return catOf(m) === c; });
      if (!items.length) return "";
      return '<section class="catalog-section" id="' + esc(c.id) + '">' +
        '<div class="grid-head"><h2>' + esc(c.title) + '</h2><span>' + items.length + " " + esc(c.noun) + (items.length === 1 ? "" : "s") + '</span></div>' +
        '<div class="mod-grid">' + items.map(card).join("") +
          (c.soon ? '<div class="card card-soon"><div><strong>More on the way</strong>' + esc(c.soon) + '</div></div>' : "") +
        '</div></section>';
    }).join("");
    var target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();

    // Hover preview on devices with a mouse
    if (reduceMotion || !window.matchMedia("(hover: hover)").matches) return;
    grid.querySelectorAll(".card").forEach(function (card) {
      var v = card.querySelector("video");
      if (!v) return;
      card.addEventListener("mouseenter", function () {
        if (!v.src) { v.src = v.dataset.src; v.addEventListener("playing", function () { v.classList.add("ready"); }, { once: true }); }
        v.play().catch(function () {});
      });
      card.addEventListener("mouseleave", function () { v.pause(); });
    });
  }

  /* Mod page */
  function modPage() {
    var id = new URLSearchParams(location.search).get("id");
    var m = MODS.find(function (x) { return x.id === id; });
    var main = document.getElementById("main");
    if (!m) {
      main.innerHTML = '<div class="wrap not-found"><h1>Not found</h1><p><a class="btn btn-ghost" href="index.html">Back to the home page</a></p></div>';
      return;
    }
    var c = catOf(m);
    document.title = (c.id === "mods" ? m.name + " for " + m.game : m.name) + " | " + SITE.name;
    if (m.accent) document.documentElement.style.setProperty("--accent", m.accent);

    var sections = [];
    var n = 0;
    function num() { n += 1; return '<span class="num">' + (n < 10 ? "0" + n : n) + '</span>'; }
    var nav = [];

    // The big title: the name's last word on its own coloured line. An entry can say how many
    // words go on that line with `titleTail` (e.g. 2 for "The Final / Earth 2").
    var words = m.name.split(" ");
    var tail = Math.max(1, Math.min(words.length - 1, m.titleTail || 1));
    var title = words.length > 1
      ? esc(words.slice(0, -tail).join(" ")) + "<br><span>" + esc(words.slice(-tail).join(" ")) + "</span>"
      : "<span>" + esc(m.name) + "</span>";

    // A download is a file (on this site or a .zip elsewhere, e.g. a GitHub Release),
    // a page elsewhere (e.g. a GitHub repo), or not out yet (empty url)
    // An entry with play: { url } runs in the browser instead: its button opens the game in a new tab.
    var dl = m.download || {};
    var play = m.play && m.play.url ? m.play : null;
    var external = /^https?:/.test(dl.url || "") && !/\.zip$/i.test(dl.url);
    var dlBtn = play
      ? '<a class="btn btn-primary" href="' + url(play.url) + '" target="_blank" rel="noopener">' + ICON_PLAY_SM + 'Play now' + (play.size ? ' <small>' + esc(play.size) + '</small>' : "") + '</a>'
      : !dl.url
      ? '<span class="btn btn-ghost" aria-disabled="true">Download coming soon</span>'
      : external
        ? '<a class="btn btn-primary" href="' + esc(dl.url) + '" target="_blank" rel="noopener">' + ICON_DL + 'Get it on GitHub</a>'
        : '<a class="btn btn-primary" href="' + url(dl.url) + '" download>' + ICON_DL + 'Download v' + esc(m.version) + (dl.size ? ' <small>' + esc(dl.size) + '</small>' : "") + '</a>';

    var hero =
      '<section class="mod-hero">' +
        (m.heroVideo
          ? '<video ' + (reduceMotion ? "" : "autoplay ") + 'muted loop playsinline poster="' + url(m.cover) + '" src="' + url(m.heroVideo) + '"></video>'
          : '<img src="' + url(m.cover) + '" alt="">') +
        '<div class="wrap">' +
          '<div class="card-meta"><span class="tag tag-accent">' + esc(m.label || m.game + " mod") + '</span><span class="tag">Version ' + esc(m.version) + '</span>' +
            (m.released ? '<span class="tag">' + esc(fmtDate(m.released)) + '</span>' : "") + '</div>' +
          '<h1>' + title + nameTag(m) + '</h1>' +
          '<p class="pitch">' + esc(m.pitch) + '</p>' +
          '<div class="hero-actions">' + dlBtn +
            (m.trailer ? '<a class="btn btn-ghost" href="#trailer">' + ICON_PLAY_SM + 'Watch the trailer</a>' : "") +
            (m.source ? '<a class="btn btn-ghost" href="' + esc(m.source) + '" target="_blank" rel="noopener">Source code</a>' : "") +
          '</div>' +
          (m.unofficial ? '<div class="unofficial-badge">' + esc(c.badge) + '</div>' : "") +
        '</div>' +
      '</section>';

    if (m.trailer) {
      nav.push(["trailer", "Trailer"]);
      sections.push('<section class="section" id="trailer"><div class="wrap"><h2>' + num() + 'Trailer</h2>' +
        '<div class="trailer-frame"><video controls playsinline preload="none" poster="' + url(m.trailer.poster) + '" src="' + url(m.trailer.video) + '"></video></div></div></section>');
    }

    if (m.features && m.features.length) {
      nav.push(["features", "Features"]);
      sections.push('<section class="section" id="features"><div class="wrap"><h2>' + num() + 'Features</h2><div class="features">' +
        m.features.map(function (f) { return '<div class="feature"><h3>' + esc(f.title) + '</h3><p>' + esc(f.text) + '</p></div>'; }).join("") +
        '</div></div></section>');
    }

    if (m.gallery && m.gallery.length) {
      nav.push(["gallery", "Gallery"]);
      sections.push('<section class="section" id="gallery"><div class="wrap"><h2>' + num() + 'Gallery</h2><div class="gallery">' +
        m.gallery.map(function (g, i) {
          return '<button class="shot" type="button" data-i="' + i + '"><figure style="margin:0">' +
            '<img src="' + url(g.poster || g.image) + '" alt="' + esc(g.caption) + '" loading="lazy">' +
            '<figcaption>' + (g.video ? '<span class="play-dot">' + ICON_PLAY + '</span>' : "") + esc(g.caption) + '</figcaption>' +
            '</figure></button>';
        }).join("") + '</div></div></section>');
    }

    nav.push(["download", play ? "Play" : "Download"]);
    sections.push('<section class="section" id="download"><div class="wrap"><h2>' + num() + (play ? 'Requirements &amp; play' : 'Requirements &amp; download') + '</h2><div class="two-col">' +
      '<ul class="list-check">' + (m.requirements || []).map(function (r) { return '<li>' + esc(r) + '</li>'; }).join("") + '</ul>' +
      '<div class="download-box"><span class="tag tag-accent" style="justify-self:start">Latest: v' + esc(m.version) + '</span>' +
        '<div class="file">' + esc(play ? (play.label || "Plays in your browser") : (dl.label || "")) + '</div>' +
        '<p class="muted">' + (play
          ? 'Nothing to install &middot; free'
          : (dl.size ? esc(dl.size) + ' &middot; ' : "") + (external || m.source ? 'Free and open source' : 'Free download')) +
          (m.released ? ' &middot; released ' + esc(fmtDate(m.released)) : "") + '</p>' +
        dlBtn + '</div>' +
      '</div></div></section>');

    if (m.install && m.install.length) {
      nav.push(["install", "Install"]);
      sections.push('<section class="section" id="install"><div class="wrap"><h2>' + num() + 'How to install</h2>' +
        '<ol class="steps">' + m.install.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("") + '</ol>' +
        (m.installNotes && m.installNotes.length ? '<ul class="notes">' + m.installNotes.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("") + '</ul>' : "") +
        '</div></section>');
    }

    if (m.controls && m.controls.length) {
      nav.push(["controls", "Controls"]);
      sections.push('<section class="section" id="controls"><div class="wrap"><h2>' + num() + 'Controls</h2>' +
        '<table class="controls"><tbody>' + m.controls.map(function (c) {
          var keys = String(c[0]).split(" / ").map(function (k) { return '<kbd>' + esc(k) + '</kbd>'; }).join(" / ");
          return '<tr><td>' + keys + '</td><td>' + esc(c[1]) + '</td></tr>';
        }).join("") + '</tbody></table></div></section>');
    }

    if (m.changelog && m.changelog.length) {
      nav.push(["changelog", "Changelog"]);
      sections.push('<section class="section" id="changelog"><div class="wrap"><h2>' + num() + 'Changelog</h2><div class="changelog">' +
        m.changelog.map(function (r, i) {
          return '<details class="release' + (i === 0 ? ' latest" open' : '"') + '><summary><b>v' + esc(r.version) + '</b><span>' + esc(fmtDate(r.date)) + '</span>' +
            (i === 0 ? '<span class="tag tag-accent">Latest</span>' : "") + '</summary>' +
            '<ul>' + r.notes.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul></details>';
        }).join("") + '</div>' +
        ((m.unofficial || m.credits) ? '<div class="disclaimer">' +
          (m.unofficial ? '<p><strong>Unofficial.</strong> ' + esc(m.unofficial) + '</p>' : "") +
          (m.credits ? '<p><strong>Credits.</strong> ' + esc(m.credits) + '</p>' : "") + '</div>' : "") +
        '</div></section>');
    }

    var subnav = '<nav class="subnav" aria-label="On this page"><div class="wrap">' +
      nav.map(function (x) { return '<a href="#' + x[0] + '">' + x[1] + '</a>'; }).join("") + '</div></nav>';

    main.innerHTML = hero + subnav + sections.join("");
    lightbox(m.gallery || []);
    // The page is built after load, so jump to a #section link ourselves
    var target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
  }

  function lightbox(items) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close">&times;</button><div class="lightbox-body"></div>';
    document.body.appendChild(box);
    var body = box.querySelector(".lightbox-body");
    var closeBtn = box.querySelector(".lightbox-close");

    function close() { box.classList.remove("open"); body.innerHTML = ""; document.body.style.overflow = ""; }
    function open(i) {
      var g = items[i];
      body.innerHTML = (g.video
        ? '<video controls autoplay muted loop playsinline poster="' + url(g.poster) + '" src="' + url(g.video) + '"></video>'
        : '<img src="' + url(g.image) + '" alt="' + esc(g.caption) + '">') +
        '<p>' + esc(g.caption) + '</p>';
      box.classList.add("open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }
    document.querySelectorAll(".shot").forEach(function (b) {
      b.addEventListener("click", function () { open(+b.dataset.i); });
    });
    closeBtn.addEventListener("click", close);
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && box.classList.contains("open")) close(); });
  }

  /* Support page */
  function support() {
    var s = SITE.support || {};
    document.querySelectorAll("[data-venmo-url]").forEach(function (a) { a.href = s.venmoUrl; });
    document.querySelectorAll("[data-venmo-user]").forEach(function (e) { e.textContent = s.venmoUser; });
    document.querySelectorAll("[data-venmo-name]").forEach(function (e) { e.textContent = s.venmoName; });
    var copy = document.getElementById("copy-venmo");
    if (copy) copy.addEventListener("click", function () {
      var done = function () { copy.textContent = "Copied " + s.venmoUser; setTimeout(function () { copy.textContent = "Copy username"; }, 2000); };
      if (navigator.clipboard) navigator.clipboard.writeText(s.venmoUser).then(done, done); else done();
    });
  }

  header();
  if (page === "home") home();
  if (page === "mod") modPage();
  if (page === "support") support();
  footer();
})();
