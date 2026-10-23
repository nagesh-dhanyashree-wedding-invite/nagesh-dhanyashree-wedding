# Nagesh & Dhanyashree — Wedding Invitation

Live at https://nagesh-dhanyashree-wedding-invite.github.io

## Folders
- `index.html`: page structure only (about 5 KB)
- `css/style.css`: the stylesheet the browser loads (compiled from the SCSS)
- `scss/`: the source styles. `_variables.scss` holds colours and fonts
- `js/data.js`: all text, dates, venues and photo paths. Edit invitation content here
- `js/app.js`, `music.js`, `form.js`, `main.js`: behaviour
- `assets/img`, `assets/audio`: photos and music as normal files

## Changing styles
Edit files in `scss/`, then run `npm install` once and `npm run build:css`.
If you edit `css/style.css` directly, a later SCSS build will overwrite those edits.

## Publishing on GitHub Pages (same URL)
The repository must be named `nagesh-dhanyashree-wedding-invite.github.io`.
1. Back up the current repo (Code > Download ZIP on GitHub).
2. Add file > Upload files, drag in everything inside this folder
   (the `css`, `scss`, `js`, `assets` folders, `index.html`, `.nojekyll`), then Commit.
3. Wait 1-2 minutes and hard-refresh the site.
`index.html` sits at the repo root, so the URL does not change.

Test locally: run `python3 -m http.server` in this folder and open http://localhost:8000
(double-clicking index.html can block some features).
