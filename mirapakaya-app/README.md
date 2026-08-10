# Mirapakaya Kitchen — Website + Admin Panel + Database

A live website with an admin panel that saves menu/business changes to a real
database (Vercel Postgres). No coding needed after setup.

## What's inside
- `/` — public website, pulls the menu live from the database
- `/admin` — password-protected admin panel to edit business info & menu
- Vercel Postgres — stores everything

## Deploy steps (one-time setup)

### 1. Push this code to GitHub
Create a new GitHub repo and push this folder's contents to it.
(In VS Code: `git init`, `git add .`, `git commit -m "init"`, then push to a
new repo — or just drag the folder into GitHub Desktop.)

### 2. Import into Vercel
- Go to vercel.com → **Add New → Project**
- Import the GitHub repo you just created
- Framework will auto-detect as **Next.js** — leave defaults, click **Deploy**
  (first deploy will succeed but the site will show "Database not set up yet" — that's expected, continue below)

### 3. Add a Postgres database
- In your new Vercel project → **Storage** tab → **Create Database** → choose **Postgres**
- Connect it to this project (Vercel does this automatically, and adds the
  `POSTGRES_URL` etc. environment variables for you — you don't type these in yourself)

### 4. Add your admin login details
- Project → **Settings → Environment Variables**, add:
  - `ADMIN_PASSWORD` → the password you'll use to log into `/admin`
  - `ADMIN_SECRET` → any long random string (mash the keyboard) — keeps your login secure
- Click **Save**, then go to **Deployments** and **Redeploy** the latest deployment
  (so it picks up the new environment variables)

### 5. Create the database tables (one-time)
Visit this URL once in your browser (replace with your real domain and password):

```
https://YOUR-SITE.vercel.app/api/init-db?key=YOUR_ADMIN_PASSWORD
```

You should see `{"ok":true,"message":"Database ready."}`. This also fills in
some sample menu items to start with.

### 6. You're live
- Visit `https://YOUR-SITE.vercel.app` — your public site, pulling from the database
- Visit `https://YOUR-SITE.vercel.app/admin` — log in with `ADMIN_PASSWORD`,
  edit business info and manage the menu. Changes save instantly and show up
  on the public site right away — no code, no redeploying.

## Local development (optional)
If you want to run this on your own computer first:
```
npm install
```
Copy `.env.example` to `.env.local` and fill in real values, plus a
`POSTGRES_URL` (get one free from vercel.com/storage or neon.tech), then:
```
npm run dev
```
Visit `http://localhost:3000/api/init-db?key=YOUR_ADMIN_PASSWORD` once, then
`http://localhost:3000`.

## Notes
- The heat guide on the homepage automatically shows your 3 spiciest dishes.
- Deleting a menu item is permanent — there's no undo.
- Keep `ADMIN_PASSWORD` and `ADMIN_SECRET` private — anyone with the password
  can edit your site.
