# S R Ramkishore — Personal Portfolio

Submission for **23CSB40B Web Technology, Assignment 1** (S7 CSE, MBCET).
Vanilla HTML5, CSS3 and JavaScript. No frameworks, no libraries, no build step.

## Run it

Open `index.html` in a browser. That's it — nothing to install, nothing to build.
For a local server:

```bash
python3 -m http.server 8000
```

## Deploy on GitHub Pages

1. Create a **public** repo named `B23CS1157_SRRamkishore_Portfolio`.
2. Push these files to `main` (index.html must sit at the repo root, not inside a folder).
3. Settings → Pages → Source: `Deploy from a branch` → Branch `main`, folder `/ (root)` → Save.
4. Wait a minute, then open `https://<username>.github.io/<repo>/`.
5. Hard-refresh (Ctrl+Shift+R) and check the browser console is clean before submitting.

## No external dependencies

Vanilla HTML5, CSS3 and JavaScript throughout. No frameworks, no libraries, no
build step, no CDN requests, and no webfont downloads — typography uses system
font stacks so the page renders identically offline and from a fresh clone. The
only outbound links are your own GitHub, LinkedIn, `mailto:` and `tel:`.

## Structure

```
index.html                  semantic page structure
css/style.css               design tokens, layout, responsive rules
js/script.js                data, DOM rendering, events, validation, storage
images/                     portrait + project artwork
RESUME_S_R_RAMKISHORE.pdf   downloadable resume
```

## Where each requirement lives

| Req | Component | Where |
|---|---|---|
| A1–A3 | Semantic structure, all six sections | `index.html` — `header`, `nav`, `main`, `section`, `article`, `aside`, `footer` |
| A4 | Lists — `ul` tools, `ol` learning path, `dl` skill/proficiency | Skills section |
| A5 | Tables | Internships and Education sections |
| A6 | Project cards, internal + external links | Projects section (rendered by JS) |
| A7 | `mailto:`, `tel:`, resume download | Contact section |
| A8 | Embedded image | Hero portrait + project artwork |
| A9 | Flexbox/Grid, box-sizing, sticky nav, fixed scroll-to-top, hover, shadows | `css/style.css` §3, §5, §11 |
| A10 | Media queries at 900px / 720px / 480px | `css/style.css` §12 |
| B1 | `projects` array of objects → DOM-rendered cards | `js/script.js` §1, §5 |
| B2 | Hamburger nav, theme switch, tech filter, project modal | `js/script.js` §2, §5, §6, §7 |
| B3 | Regex validation, inline messages, no reload | `js/script.js` §8 |
| B4 | `localStorage` — theme **and** saved projects | `js/script.js` §2, §3 |
| B5 | `const`/`let`, arrow functions, template literals, `map`/`filter`/`flatMap`, destructuring, spread | throughout |

## Design note

Crimson on near-black. Anton for display type, Space Grotesk for reading, IBM Plex
Mono for labels and data. Structure is carried by hairlines rather than boxes, and
the accent never appears twice the same way — a top rule on a panel, a left rule
on the tagline, a wipe across a button, an edge drawn along a card on hover, a
solid band behind the ticker.

Dark is the default; the theme toggle offers a bone-white inversion that keeps the
same crimson, and the choice persists in `localStorage`.
