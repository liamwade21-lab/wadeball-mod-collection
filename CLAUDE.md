# Wadeball's Mod Collection (website)

Liam's free mods and games site. Plain HTML/CSS/JS, no build step, no backend.
Live at https://liamwade21-lab.github.io/wadeball-mod-collection/ (GitHub Pages,
public repo liamwade21-lab/wadeball-mod-collection; pushing to `main` publishes it).

## How it's put together
- `data/mods.js` is the only file you normally edit: site name, Venmo details,
  `CATEGORIES` (home page sections: Mods, Games) and every entry in `MODS`.
- Each entry's `category` picks its section. Files live in `mods/<id>/` or `games/<id>/`.
- `js/site.js` builds the home page, each entry's page (`mod.html?id=<id>`) and the support page.
- A `download.url` can be a file on the site, a full https link (shows "Get it on GitHub"),
  or empty (shows "Download coming soon").

## Preview
Launch config `wadeball-site` in `Desktop\.claude\launch.json` (port 8642). The browser caches
`data/mods.js`, so reload without the cache after edits.

## Rules
- Ask Liam before every push: the repo and site are public.
- Don't open or read anything in `Desktop\SpaceEngine Rust Port Version 2` (Liam's rule).
- No official logos or art for fan projects; each keeps an "unofficial" note.
- No Steam Workshop field (Liam removed it).
- The features grid is 3 columns: keep each entry's feature count a multiple of 3.
- Keep media small: each video under ~15 MB, pictures ~50-150 KB. ffmpeg is at
  `%APPDATA%\Python\Python312\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe`.
- Sandbox Engine footage (Videos\1107.mp4) is 4:3 inside a 16:9 frame: crop `1440:1030:240:8`.
