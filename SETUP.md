# Setup Guide — Year 11 Economics Scaffold
## (Do this at school on your Google account)

---

## What you need
- Your school Google account (open in Chrome at school)
- The folder of files (`econ-scaffold`)

---

## STEP 1 — Set up Google Apps Script (the "backend")

This is what stores student submissions in a Google Sheet.

1. Go to **[script.google.com](https://script.google.com)** and sign in with your school Google account
2. Click **"New project"** (top left)
3. A code editor opens. **Delete all the existing code** in the editor
4. Open the file `apps-script.gs` from this folder and **copy everything in it**
5. Paste it into the Apps Script editor
6. **Change the teacher password** — find the line that says:
   ```
   const TEACHER_PASSWORD = 'teacher2026';
   ```
   Replace `teacher2026` with a password only you know (e.g. your room number + year)
7. Click the **floppy disk icon** (Save) or press `Ctrl+S`
8. Give the project a name like `EconScaffold2026`

---

## STEP 2 — Deploy as a Web App

1. Click **"Deploy"** (top right) → **"New deployment"**
2. Click the gear icon ⚙️ next to "Type" → select **"Web app"**
3. Set the following:
   - **Description:** `Econ Scaffold 2026`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. Click **"Deploy"**
5. Google will ask you to **authorise** — click "Authorise access" → sign in → click "Allow"
6. You'll see a **Web App URL** — it looks like:
   `https://script.google.com/macros/s/XXXXXX.../exec`
7. **Copy this URL** — you'll need it in Step 3

---

## STEP 3 — Paste the URL into config.js

1. Open the file `config.js` from this folder in any text editor (Notepad, VS Code etc.)
2. Find this line:
   ```js
   SCRIPT_URL: 'YOUR_APPS_SCRIPT_URL_HERE',
   ```
3. Replace `YOUR_APPS_SCRIPT_URL_HERE` with the URL you just copied:
   ```js
   SCRIPT_URL: 'https://script.google.com/macros/s/XXXXXX.../exec',
   ```
4. Save the file

> **Optional:** Change the class code (default is `ECON2026`):
> ```js
> CLASS_CODE: 'ECON2026',
> ```

---

## STEP 4 — Publish to the internet (Netlify)

Students need a URL to open. Netlify is free and takes 2 minutes.

1. Go to **[netlify.com](https://netlify.com)** and create a free account (or sign in)
2. On the dashboard, look for **"Deploy manually"** or **"Sites"** → **"Add new site"** → **"Deploy manually"**
3. **Drag the entire `econ-scaffold` folder** onto the page
4. Wait ~10 seconds — Netlify gives you a URL like `https://jolly-mango-12345.netlify.app`
5. **Share this URL with your students!**

> 💡 You can set a custom name: on the site settings page, click "Change site name" and call it something like `yr11econ2026`
> → URL becomes: `https://yr11econ2026.netlify.app`

---

## STEP 5 — Share with students

Tell your students:
1. Go to the URL (e.g. `https://yr11econ2026.netlify.app`)
2. Enter their **full name**
3. Enter the **class code** — you give them this (default: `ECON2026`)
4. Fill in the scaffold and click **Submit** when done

---

## STEP 6 — Viewing student submissions (Teacher Dashboard)

### Option A — Teacher Dashboard (in the browser)
1. Go to your Netlify URL + `/teacher.html` (e.g. `https://yr11econ2026.netlify.app/teacher.html`)
2. Enter your teacher password (the one you set in Step 1)
3. See all student submissions, search by name, click to expand full details
4. Click **"Export CSV"** to download a spreadsheet of all responses

### Option B — Google Sheet directly
1. Go to [sheets.google.com](https://sheets.google.com) with your school account
2. Find the spreadsheet that was automatically created (named after your Apps Script project)
3. Every student submission appears as a new row, with all their answers in columns

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Students get "incorrect class code" | Check `CLASS_CODE` in `config.js` matches what you told them |
| Submissions not appearing | Check the `SCRIPT_URL` in `config.js` is correct |
| Teacher dashboard says "could not connect" | Make sure you're online and the Apps Script is deployed correctly |
| Need to reauthorise the Apps Script | Go back to script.google.com → Deploy → Manage deployments |

---

## Summary of files

| File | Purpose |
|---|---|
| `index.html` | Student login page |
| `scaffold.html` | The research scaffold students fill in |
| `teacher.html` | Teacher dashboard |
| `config.js` | ⚙️ **You edit this** — paste SCRIPT_URL and set CLASS_CODE |
| `apps-script.gs` | **Paste into Google Apps Script** — the backend |
| `style.css` | Styling (no need to touch) |
| `app.js` | Student app logic (no need to touch) |
| `teacher.js` | Teacher dashboard logic (no need to touch) |
