# Deploying Anime Filler Checklist (animefillerchecklist.com)

Everything in this `site/` folder is the whole website — plain static HTML, CSS, and JS.
No build step, no framework. Upload it as-is.

## Step 0 — Get your free Web3Forms key (2 minutes, do this BEFORE uploading)
The request form on the site (`/request-a-show/`) needs a free access key so submissions can reach your inbox.
1. Go to **web3forms.com** and enter **colematecki@gmail.com** — they email you an access key (free plan is plenty).
2. Open `request-a-show/index.html` from this folder in any text editor (or edit it later in the GitHub web UI).
3. Find the text `YOUR_WEB3FORMS_ACCESS_KEY`, replace it with your key, and save.
That's the only edit the site needs. Submissions from the form then go straight to that Gmail inbox.
Scout watches that inbox and brings each request to Cole for a yes/no before anything is added to the site.
(The custom 404 page, the hero banner, and the favicons need no setup — they work automatically once the files are uploaded.)

## Step 1 — Create the GitHub repo
1. Go to github.com and sign in.
2. Click **+** (top right) → **New repository**.
3. Name it `animefillerchecklist`, leave it **Public**, do NOT add a README (this folder already has everything).
4. Click **Create repository**.
5. On the new repo page, click **uploading an existing file**.
6. Drag in **everything inside this `site/` folder** — `index.html`, `robots.txt`, `sitemap.xml`,
   the `assets` folder, and every show/policy folder (`bleach-filler-list`, `about`, etc.).
   Drag the folders themselves, not just loose files — the folder names are the page URLs.
   (You can leave this `DEPLOY.md` file out of the upload; it does no harm if it goes in.)
7. Click **Commit changes**.

## Step 2 — Import to Vercel
1. Go to vercel.com and sign in with GitHub.
2. Click **Add New → Project**.
3. Find `animefillerchecklist` in the list and click **Import**.
4. Framework Preset: choose **Other** (or leave it — it's a static site).
   Root Directory: `./` — Build Command: leave empty — Output Directory: leave empty/default.
5. Click **Deploy**. After a minute the site is live on a `*.vercel.app` address — open it and click around.

## Step 3 — Connect animefillerchecklist.com
1. In Vercel: open the project → **Settings → Domains** → type `animefillerchecklist.com` → **Add**.
   Vercel will also offer the `www` version — add/accept that too, redirecting to the plain domain.
2. Vercel will show you a DNS record to create (usually an **A record**: name `@`, value `76.76.21.21`,
   and/or a **CNAME** for `www`). Use exactly what Vercel shows on your screen — it is the source of truth.
3. Go to **Cloudflare** (where the domain was bought) → select `animefillerchecklist.com` → **DNS → Records** → **Add record**:
   - Type **A**, Name `@`, IPv4 address = the value Vercel showed, Proxy status: **DNS only** (grey cloud) — keep the proxy OFF for Vercel.
   - If Vercel asks for `www`: Type **CNAME**, Name `www`, Target `cname.vercel-dns.com` (or what Vercel shows), also **DNS only**.
4. Back in Vercel, the domain will flip to **Valid** once DNS propagates (usually minutes, can take a few hours).
   HTTPS turns on automatically — no certificate steps needed.

## Step 4 — After it's live
- Open https://animefillerchecklist.com and each show page once on your phone.
- Next steps Scout is already tracking in the launch plan: Google Search Console + sitemap submission,
  then the AdSense application (the ad slots are already marked in the code, empty until approval).

## Updating later
Edit files in the GitHub repo (or ask Scout for an updated folder) → Vercel redeploys automatically on every commit.
