# Chidem Sabuncu portfolio

A static site in plain HTML, CSS and JavaScript. No build step, no dependencies.

- `index.html`: content and structure
- `styles.css`: colours, type and layout
- `script.js`: opening animation, section highlight in the side nav, copy-email button
- `img/`: your photo

## Preview on your computer

Double-click `index.html`, or run `python3 -m http.server` in this folder and open http://localhost:8000.

## Publish on GitHub Pages

1. On GitHub, create a **public** repository named `chidems.github.io` (your username, then `.github.io`).
2. Upload `index.html`, `styles.css`, `script.js` and the whole `img` folder to the root of the repository (drag them into the web uploader, or use `git add`, `git commit` and `git push`).
3. In the repository, open **Settings, then Pages**. Under **Build and deployment**, set Source to **Deploy from a branch**, pick the `main` branch and the `/ (root)` folder, and save.
4. After a minute or two the site is live at https://chidems.github.io.

The footer link "Read the source" points to `https://github.com/chidems/chidems.github.io`, so it works once step 1 is done.

## Things to update

- **Photo:** replace `img/chidem.jpg` (keep a 3:4 portrait crop, about 360 by 480 pixels).
- **Project links:** add a link line like the QuestUp one when a project has a public repository.
- **Colours and font:** they live at the top of `styles.css`.
- **Opening animation:** it plays once per visit and is skipped for visitors who turn on reduced motion. Click or press any key to skip it. To replay it while testing, open the page in a new tab.
