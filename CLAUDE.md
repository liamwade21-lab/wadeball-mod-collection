# Wadeball's Mod Collection (website)

Liam's free mods and games site. Plain HTML/CSS/JS, no build step, no backend.
Live at https://liamwade21-lab.github.io/wadeball-mod-collection/ (GitHub Pages,
public repo liamwade21-lab/wadeball-mod-collection; pushing to `main` publishes it).

## How it's put together
- `data/mods.js` is the only file you normally edit: site name, Venmo details,
  `CATEGORIES` (home page sections: Mods, Games) and every entry in `MODS`.
- Each entry's `category` picks its section. Files live in `mods/<id>/` or `games/<id>/`.
- `js/site.js` builds the home page, each entry's page (`mod.html?id=<id>`) and the support page.
- A `download.url` can be a file on the site or a .zip elsewhere (shows "Download vX"), another
  https page (shows "Get it on GitHub"), or empty (shows "Download coming soon").
  Optional `source` adds a "Source code" button.
- An entry with `play: { url, label, size }` runs in the browser instead of being downloaded: its
  button says "Play now" and opens `url` in a new tab (Blocksworld is the first one).
- Blocksworld (`games/blocksworld/`): `media/` holds the cover and pictures. `play/` is the game itself
  (about 357 MB, 26,800 files) and is MADE by `Build Web Version.bat` in `Downloads\blocksworld-rust` -
  never edit files in `play/` by hand, rebuild instead (the page files live in that project's `web\`
  folder). After a rebuild, update `play.size` in data/mods.js if the start-up download changed
  (the build prints it). Its pictures are screenshots of the rebuilt game: Liam decided on 2026-11-10
  that the original game's art, sounds and music are fine to use for this entry (the game was free and
  was shut down), which is the one exception to the "no official art" rule below.
- Sandbox Engine's repo is source only. New versions: zip `target\release\spaceengine-rs.exe`
  into `Sandbox Engine/`, publish it as a GitHub Release on liamwade21-lab/Sandbox-Engine (ask first),
  then update version, download url/size and changelog in data/mods.js.

- `games/blocksworld/play/community/` (about 145 MB, 22,400 small files) is the game's community worlds
  and models: every one players published on the fan server, copied from the archive on this PC by the same
  .bat (only the public parts; e-mail addresses are taken out; nothing from the archive's players' folders).
  They are other players' creations and show their player names, as the original game did.

## Preview
Launch config `wadeball-site` in `Desktop\.claude\launch.json` (port 8642; a copy is in
`Documents\Work\.claude\launch.json` for sessions started from that folder). The browser caches
`data/mods.js`, so reload without the cache after edits.

`.gitattributes` keeps git from changing line endings inside `games/blocksworld/play/` (leave it).
The web build shortens this PC's folder paths inside the game program (`C:\Users\<name>` becomes `~`),
so the public file does not carry them.

To try Blocksworld locally: preview the site, open Games > Blocksworld > Play now. Page options for
testing are listed in `Downloads\blocksworld-rust\CLAUDE.md` ("Browser version").

## Rules
- Ask Liam before every push: the repo and site are public.
- Size: GitHub Pages allows 1 GB per published site, GitHub refuses single files over 100 MB, and there is
  a soft limit of 100 GB of traffic a month (GitHub's "GitHub Pages limits" page, read 2026-11-10). The site
  is about 390 MB with Blocksworld and its community worlds, its biggest file 13 MB. One first visit to the
  game downloads about 26 MB (24 MB + the 1.5 MB community list), so the traffic limit is roughly 4,000
  first-time players a month. Every rebuild of the game that gets pushed adds its changed files
  (about 13 MB for the game program) to the repository's history, so don't push every small rebuild.
- Don't open or read anything in `Desktop\SpaceEngine Rust Port Version 2` (Liam's rule).
- No official logos or art for fan projects; each keeps an "unofficial" note.
- No Steam Workshop field (Liam removed it).
- The features grid is 3 columns: keep each entry's feature count a multiple of 3.
- Keep media small: each video under ~15 MB, pictures ~50-150 KB. ffmpeg is at
  `%APPDATA%\Python\Python312\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe`.
- Sandbox Engine footage (Videos\1107.mp4) is 4:3 inside a 16:9 frame: crop `1440:1030:240:8`.
