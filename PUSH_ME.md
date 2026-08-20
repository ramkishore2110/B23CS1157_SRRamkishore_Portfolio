# Push this to GitHub — B23CS1157

This folder is already named correctly. Do **not** rename it, and do **not**
submit this zip to Classroom — the assignment asks for a GitHub Pages URL only.
The zip is just a delivery method to get the files onto your machine.

## 1. Create the repository

Go to https://github.com/new

- **Repository name:** `B23CS1157_SRRamkishore_Portfolio`
- **Visibility:** Public  ← required, or your teacher can't open it
- Do **not** tick "Add a README" — this folder already has one

## 2. Push

Open a terminal inside this folder and run:

```bash
git init
git add .
git commit -m "Personal portfolio - Web Technology Assignment 1"
git branch -M main
git remote add origin https://github.com/ramkishore2110/B23CS1157_SRRamkishore_Portfolio.git
git push -u origin main
```

If it asks for a password: GitHub no longer accepts your account password.
Generate a token at Settings → Developer settings → Personal access tokens →
Tokens (classic) → Generate new token → tick `repo` → use that token as the
password.

## 3. Turn on GitHub Pages

Repo → **Settings** → **Pages** (left sidebar)
→ Source: **Deploy from a branch**
→ Branch: `main`, folder: `/ (root)` → **Save**

Wait about a minute. Your live URL:

```
https://ramkishore2110.github.io/B23CS1157_SRRamkishore_Portfolio/
```

## 4. Check before you submit

- [ ] `index.html` is at the repo root — if it sits inside a subfolder, Pages 404s
- [ ] Live URL opens in a **private/incognito** window (proves the repo is public)
- [ ] F12 → Console tab → **zero errors** (console errors cost Part B marks)
- [ ] Narrow the window → hamburger menu opens and closes
- [ ] Click a filter chip, then "Read more" on a project card
- [ ] Submit the contact form empty → inline errors, no page reload
- [ ] Toggle the theme, refresh → your choice persists
- [ ] Star a project, refresh → it stays starred
- [ ] Resume download link works
- [ ] Open it on your phone

## 5. Submit

1. Paste the **GitHub Pages URL** into Google Classroom (not the repo URL, and no zip)
2. Copy the same link into the shared Excel file for the class

Due: 13th August 2026.
