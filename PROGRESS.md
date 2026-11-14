# Progress

## Now (2026-11-13)
- Pushed 2026-11-13 (Liam said "Yes, push it"): a "Contact" button at the top right, beside Support (Liam's request). It
  opens a small box with his email (`SITE.contactEmail` in `data/mods.js`) as a mail link plus a "Copy address"
  button; clicking elsewhere or Escape closes it. Changed: `data/mods.js`, `js/site.js` (`header()` +
  `contactMenu()`), `css/style.css` (`.contact*`, and a tighter header on phones so it still fits at 360 px).
  Checked in the local preview at PC width, 375 px and 360 px (no sideways scrolling).
- Pushed 2026-11-13 (Liam gave the go: "push to github and release on the wadeball collection website"): Sandbox Engine
  1.2.0. The entry in `data/mods.js` points at the GitHub Release v1.2.0 zip (610.2 MB), with a feature card for the new
  Skate 3 physics mod, its screenshot second in the gallery (`games/sandbox-engine/media/skate3.jpg`, from a test run,
  1280x720), the changelog, Electronic Arts in the unofficial note, EA and the Skate 3 Rust Engine (GPL-3.0) in the
  credits, and the GPL v3.0 in the open-source card (Sandbox Engine is GPL since 1.2.0).
- Pushed 2026-11-12 (commit b4ef0488; Liam asked for it; live site checked): a screenshot of Sandbox Engine 1.1.0's sandbox
  (`games/sandbox-engine/media/sandbox.jpg`: the gravity gun holding a barrel among props in the Canterbury Plains) is first in
  its gallery. Taken in a test run of the game at 1680x1202, shrunk to 1280x916 like the others.
- Pushed 2026-11-12 (commit ccbce703; Liam asked for the release and the site update): Sandbox Engine 1.1.0. The entry in
  `data/mods.js` points at the GitHub Release v1.1.0 zip (592.4 MB: the exe plus its `assets` folder), with a feature card
  for the new Garry's Mod-style sandbox on Earth, the changelog, an extra requirement (unzip the whole thing), Valve in
  the unofficial note, and credits for Valve's and Megaton Rainfall's content.
- Pushed 2026-11-12 (commit 4fb27e56; Liam said "Yes, publish it"; live site checked): Blocksworld 1.3.1 = his "fix the things that are still not fixed":
  four more tile conditions and the first-person look stick. `data/mods.js` (1.3.1, changelog) and a rebuilt
  `games/blocksworld/play/`. Block.Clone (a fan-mod tile) could not be rebuilt: no definition exists anywhere.
- Pushed 2026-11-12 (commit 691f02ec; Liam gave the go beforehand for this task; live site checked): Blocksworld 1.3.0 = his report "can't move the
  free camera with WASD, can't drag anything like the OG game, most community levels are buggy and softlocked".
  Dragging objects in play mode is new, WASD flies again (right mouse button held, as in the original), and taps in
  first-person community levels reach the buttons now. Changed: the rebuilt `games/blocksworld/play/` (game program,
  `blocksworld.js`, `boot.json`; start-up size unchanged, 24 MB) and the entry in `data/mods.js` (version 1.3.0,
  changelog, two control lines). Details: `Downloads\blocksworld-rust\PROGRESS.md`, "Round 4".
- Pushed 2026-11-12 (Liam gave the OK to push it together with the report): The Final Earth 2 1.0.4 =
  his third iPhone report. Tapping an Expansion warning icon opened its window and the same tap
  pressed the window's X (same corner), so it closed at once. Now the window stays open and a
  tap on an Expansion window always goes to the window. Changed: the rebuilt
  `games/final-earth-2/play/` (boot.json, finalearth2.js, game.wasm.bin) and the entry in
  `data/mods.js` (version 1.0.4, changelog line; start-up size unchanged). Details:
  `Documents\Work\TheFinalEarth2Rust\PROGRESS.md`. Not checked on the live site or a real
  iPhone (Liam tests that himself).
- Pushed 2026-11-11 (Liam said "Publish"): The Final Earth 2 1.0.3 = his second iPhone report.
  Expansion windows wider than the phone's screen (Diplomacy, Research, Trade...) were cut off at
  both sides; they are now drawn smaller so the whole window fits. Changed: the rebuilt
  `games/final-earth-2/play/` and the entry in `data/mods.js` (version 1.0.3, changelog line).
  Details: `Documents\Work\TheFinalEarth2Rust\PROGRESS.md`.
- Pushed 2026-11-11 (Liam: "Fix this and you already have my approval to publish"): The Final
  Earth 2 1.0.2 = his first iPhone report fixed. With the Expansion on, its warning icons sat on
  top of the materials list on a phone; they now stay in the top-right corner, clear of the game's
  own panels. Changed: the rebuilt `games/final-earth-2/play/` and the entry in `data/mods.js`
  (version 1.0.2, changelog line). Details: `Documents\Work\TheFinalEarth2Rust\PROGRESS.md`.
- Pushed 2026-11-11 (Liam said "Publish this now"): The Final Earth 2 1.0.1 = a small gold "Expanded"
  tag beside the game's name (Liam's request). Changed: `js/site.js` (new optional `nameTag` /
  `nameTagNote`), `css/style.css` (`.name-tag`), the entry in `data/mods.js` (version 1.0.1,
  changelog line, an "Expanded" feature card, still 9 cards) and the rebuilt
  `games/final-earth-2/play/` (the tag is on the game's title screen and loading page too).
  Checked in the local preview: home card (tag beside the name on wide screens, under it on narrow
  cards), the entry page at PC and phone width, the game's loading page and title screen.
- NEW, pushed 2026-11-11 (Liam said "Publish it"): The Final Earth 2 1.0.0 in the Games section
  (`mod.html?id=final-earth-2`), the second entry that plays in the browser. "Play now" opens
  `games/final-earth-2/play/` in a new tab.
- Files added / changed: `games/final-earth-2/media/` (cover + 6 pictures),
  `games/final-earth-2/play/` (19 MB, 22 files, made by `Build Web Version.bat` in
  `Documents\Work\TheFinalEarth2Rust`), the entry in `data/mods.js` (version 1.0.0, 9 features,
  controls, the unofficial note), one line in `.gitattributes`, and `js/site.js` (new optional
  `titleTail` for the big title's second line).
- Checked in the local preview: the home page card, the entry's page (Play now, 9 features, 6
  pictures, no broken pictures), the game starts, a city survives a page reload, sound, and touch at
  phone size. Details: `Documents\Work\TheFinalEarth2Rust\PROGRESS.md`, "Browser version".
- The whole site is about 410 MB now (was 390 MB; limit about 1,000 MB).
- Every later push still needs Liam's OK first.

## Earlier (2026-11-10)
- Pushed 2026-11-10 (Liam gave the go beforehand): Blocksworld 1.2.0 - big community worlds run many times
  faster, gear stays on animated characters, a bigger close button on phones. Only the game program and the
  page changed in `games/blocksworld/play/`; details in `Downloads\blocksworld-rust\PROGRESS.md`, "Round 3".
- Pushed 2026-11-10 (Liam said "Publish it"): support page reworded, short and plain: the site is free, "If you want to support my
  mods and games, here's my Venmo", no pressure. The strip above the footer on the other pages
  (`js/site.js`) says the same. Keep this tone (Liam's rule): no personal details, no asking.
- Pushed 2026-11-10 (Liam said "Publish it" again): Blocksworld 1.1.0. He had tested 1.0 on his iPhone
  and reported four things (details in `Downloads\blocksworld-rust\PROGRESS.md`, "Round 2"):
  - Community worlds and models now work in the browser: `games/blocksworld/play/community/` holds every
    published world (15,669) and model (6,707) from the fan-server archive, each as one small packed file
    (145 MB, about 22,400 files), plus the list. Players' e-mail addresses are taken out.
  - Phones: the game keeps clear of the camera island; it can be added to the Home Screen to run full
    screen (an iPhone's Safari cannot hide its bars for a page); Reset Camera button moved to the bottom.
  - `data/mods.js`: version 1.1.0, 12 features, a Home Screen line in the requirements, changelog, credits.
  - The site is now about 390 MB in about 26,900 files (limit about 1,000 MB).
  - Checked in the local preview at phone size: menu, a community world plays, a model is saved, the entry's
    page shows 1.1.0.
- NEW, pushed 2026-11-10 (Liam said "Publish it"): Blocksworld in the Games section
  (`mod.html?id=blocksworld`). It is the first entry that plays in the browser: its "Play now" button opens
  `games/blocksworld/play/` in a new tab. Cover + 6 pictures in `games/blocksworld/media/`
  (screenshots of the rebuilt game), 9 features, controls, the unofficial note.
  - `js/site.js` learned one new thing for it: an entry with `play: { url, label, size }` shows
    "Play now" instead of a download button, and its section is called "Requirements & play".
  - `games/blocksworld/play/` (about 210 MB, 4,400 files) is made by `Build Web Version.bat` in
    `Downloads\blocksworld-rust`. Don't edit it by hand.
  - Checked in the local preview: home page card, the entry's page, Play now, the game's menu, building,
    playing, saving and finding the world again after a reload, sound, and touch at phone size.
  - The whole site is about 245 MB now (was 32 MB). GitHub Pages allows about 1 GB.
- Live: Viltrumite Powers 1.4.0 (Mods).
- Live since 2026-11-08: Axiom from WALL-E 1.0.0 (Mods, SpaceEngine), from Desktop\The Axiom Mod.
  Download = that project's dist\AxiomWallE-1.0.0.zip (an AxiomWallE folder for SpaceEngine\addons);
  cover + 3 gallery renders from its tools/render_preview.py (our own renders, no film art).
  It's also on the Steam Workshop, but the site has no Workshop field (Liam's rule).
- Live: a Games section with Sandbox Engine 1.0.1 (cover + 9 pictures from
  Videos\1107.mp4, 6 features, requirements, changelog).
- Sandbox Engine source is public at https://github.com/liamwade21-lab/Sandbox-Engine. The repo
  is source only (target/ is gitignored); the playable game is a GitHub Release. The site's Download
  button points at the 1.0.1 zip; "Source code" points at the repo.

## Waiting on Liam
- The Final Earth 2 1.0.0: play-test the live game on the iPhone (list in
  `Documents\Work\TheFinalEarth2Rust\PROGRESS.md`, "Browser version") and report what feels wrong.
- Blocksworld 1.1.0: play-test the live game on the iPhone (list in
  `Downloads\blocksworld-rust\PROGRESS.md`) and report what feels wrong.
- Sandbox Engine install steps (optional; the section stays hidden until added).
- Check the "Mods built in" feature wording.

## Next
- Blocksworld fixes after Liam's play-test: rebuild with `Build Web Version.bat`, check in the local
  preview, then ask before pushing again.
- Add install steps and fix the "Mods built in" wording when Liam provides them.
