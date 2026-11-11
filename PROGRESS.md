# Progress

## Now (2026-11-10)
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
- Blocksworld: play-test the live game on the PC and on a real phone (list in
  `Downloads\blocksworld-rust\PROGRESS.md`) and report what feels wrong.
- Sandbox Engine install steps (optional; the section stays hidden until added).
- Check the "Mods built in" feature wording.

## Next
- Blocksworld fixes after Liam's play-test: rebuild with `Build Web Version.bat`, check in the local
  preview, then ask before pushing again.
- Add install steps and fix the "Mods built in" wording when Liam provides them.
