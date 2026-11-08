# Wadeball's Mod Collection

Plain static site: open `index.html` in a browser, or upload the whole folder to any static host.

## Adding a mod or game

1. Make a folder `mods/<id>/` (or `games/<id>/`) with the zip and a `media/` folder (cover image, clips, trailer).
2. Open `data/mods.js`, copy the template at the bottom into the `MODS` list and fill it in.
   Set `category` to `"mods"` or `"games"`. New sections go in `CATEGORIES` at the top.

That's it: the home page gets a new card in that section, and the entry gets its own page at `mod.html?id=<id>`.

## Video tips

Keep web copies small (720p, a few MB per clip; trailers under ~15 MB). With the bundled ffmpeg:

    ffmpeg -i clip.mp4 -an -vf "scale=1280:-2,fps=30" -c:v libx264 -crf 26 -movflags +faststart media/clip.mp4

## Files

- `data/mods.js` - every mod, plus the site name and Venmo details
- `js/site.js` - builds the pages from the data
- `css/style.css` - the look (each mod's `accent` colours its own page)
- `index.html`, `mod.html`, `support.html` - page shells
