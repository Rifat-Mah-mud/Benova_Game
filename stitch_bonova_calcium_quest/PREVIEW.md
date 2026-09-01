# Bonova Calcium Quest — Client Preview

Static HTML screens connected for a clickable walkthrough. No backend required.

## Preview flow

1. **Sign Up** → Create Account or “Log In” link → **Login**
2. **Login** → Log In → **Home**
3. **Home** → Start Game → **Gameplay**
4. **Gameplay** → Back (header) → **Home** · Tap anywhere (not food) → **Level Up**
5. **Level Up** → Continue → **Session Summary**
6. **Session Summary** → Home → **Home** · Play Again → **Gameplay**

**Start here:** open `index.html` (lands on Sign Up).

## Share with your client

You do **not** need GitHub, but it is one good option.

### Option A — Zip and send (fastest)

1. Zip the `stitch_bonova_calcium_quest` folder.
2. Send the zip (email, Drive, Dropbox, etc.).
3. Client unzips and opens `index.html` in a browser.

If images or fonts look broken over `file://`, use Option B or C instead.

### Option B — Free hosting (recommended)

**Netlify Drop** (no account required):

1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `stitch_bonova_calcium_quest` folder onto the page.
3. Share the URL Netlify gives you (e.g. `https://random-name.netlify.app`).

**Vercel / Cloudflare Pages** — same idea: upload the folder, get a public link.

### Option C — GitHub Pages

1. Create a GitHub repo and push this project.
2. **Settings → Pages →** Source: deploy from branch `main`, folder `/` (or root).
3. Share `https://<username>.github.io/<repo>/` (client opens `index.html` or the root URL).

### Option D — Local preview (for you)

From this folder:

```bash
npx --yes serve .
```

Then open the URL shown (usually `http://localhost:3000`).

## Files involved

| Screen | File |
|--------|------|
| Entry | `index.html` |
| Sign Up | `sign_up/code.html` |
| Login | `login/code.html` |
| Home | `home_start/code.html` |
| Gameplay | `main_gameplay_screen/code.html` |
| Level Up | `level_up_celebration/code.html` |
| Session Summary | `session_summary/code.html` |

Navigation logic: `shared/preview-nav.js` (static preview only, not production game logic).
