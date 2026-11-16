# Timothy Miller — Developer Portfolio

A static, Windows 11-style desktop portfolio for **Timothy Miller** ([@MrCubeZA](https://github.com/MrCubeZA)). Plain HTML, CSS and JavaScript — no build step, no framework, no server.

The live design is a working desktop: open, drag, minimise, maximise and close windows; a Start menu; a taskbar and desktop icons. The flagship project is **Tomus**, a free, ad-free Android reader that is still in development (source stays private — showcase only, no repository link). Featured coursework below it is the **Offline Shopping App** and the **Netflix Clone**. A simpler stacked layout is used on narrow screens so the content still reads on a phone.

Intended host: [GitHub Pages](https://pages.github.com/) at `https://mrcubeza.github.io` (the repo has not been created yet — files are ready to push when approved).

## Files

```
index.html      Desktop shell and all windows
style.css       Visual Studio / Windows 11 / neon look
app.js          Window manager, Start menu, rendering
projects.js     Project list — add a project by adding one entry
assets/         Favicon, Open Graph image, headshot, CV PDF, ERD, Tomus stylized brand art
site.webmanifest
```

## Preview locally

Open `index.html` in a browser, or use the Live Server extension in Visual Studio Code so the page reloads as you save.

## How to add a project

1. Add one object to the `PROJECTS` array in `projects.js`.

```js
{
  id: "my-new-app",                 // unique, used in the URL-less window state
  name: "My New App",
  featured: false,                  // true = Featured badge
  flagship: false,                  // true = largest card first; VS Start launches this write-up
  short: "One-line summary for the card.",
  description: "Full paragraph for the project window.",
  highlights: ["Optional bullet 1", "Optional bullet 2"],
  planned: ["Optional — not yet built"],
  status: "Optional status line, e.g. In development.",
  tech: ["C#", ".NET MAUI"],
  repo: "https://github.com/MrCubeZA/MyNewApp",  // omit this key if the repo is private
  image: "assets/images/my-screenshot.png",      // optional
  imageCaption: "Optional caption under the image.",
  cardImage: "assets/images/my-card.jpg",        // optional flagship / card art
  iconImage: "assets/images/my-icon.png",        // optional icon artwork
  note: "Optional note, e.g. if the source is private.",
  icon: "MN",                       // two letters on the card art
  iconClass: "i-shop"               // one of: i-tomus, i-shop, i-flix, i-dev, i-game, i-ttt, i-pr
}
```

2. Drop any screenshot or diagram into `assets/images/` and point `image` at it.
3. Team / non-code work goes in `TEAM_PROJECTS` in the same file (name, description, area).
4. Save and refresh. The Projects window, Visual Studio Solution Explorer, `Profile.cs` view and the mobile layout all update from this file. You do not need to edit `index.html`.

Only add a `repo` link when the repository is public. Private repos should use `note` instead, so visitors are not sent to a 404.

## How to update other content

| Change | Where |
|---|---|
| About / education / experience copy | `index.html` — the About window and the matching mobile `<section>` |
| Skills lists | `index.html` — Skills window and the shorter mobile Skills section |
| Contact links | `index.html` — Contact window and the mobile Contact section |
| Video editing blurb or YouTube URL | `index.html` — Video Editing window and the mobile Video section |
| CV PDF | Replace `assets/Timothy-Miller-CV-2026.pdf` (keep the same filename, or update every `href`) |
| Headshot | Replace `assets/images/timothy-miller.jpg` and the small Start-menu crop `timothy-miller-sm.jpg` |
| Site title, description, social preview | `<head>` of `index.html`, plus `assets/og-image.png` and `site.webmanifest` |

## Hosting on GitHub Pages

1. Create a public repository named `MrCubeZA.github.io`.
2. Push these files to the `main` branch (site root, not a `docs/` folder).
3. In the repo: **Settings → Pages → Build and deployment**, set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. After a minute the site is at `https://mrcubeza.github.io`.

Every later update is: edit locally, `git add .`, `git commit`, `git push`. Pages redeploys on its own.

The Open Graph tags already use `https://mrcubeza.github.io/`. If you host under a different URL, update the canonical and `og:` / `twitter:` tags in `index.html`.

## Credits

Design is based on the approved Windows 11 / Visual Studio 2022 mockup (variant C). The Offline Shopping App ERD is from the public [OfflineShoppingApp](https://github.com/MrCubeZA/OfflineShoppingApp) repository. Tomus visuals on the site are stylized brand art in the app’s documented purple and gold palette — not device screenshots, and not a link to any private repository.
