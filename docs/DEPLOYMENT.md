# Netlify Deployment Guide — Anuj Yadav Portfolio

Deploying your portfolio to Netlify takes less than 3 minutes. The repository already includes a pre-configured `netlify.toml` file that handles client-side routing redirects and build publishing.

---

## Method 1: Git-Connected Continuous Deployment (Recommended)

### Step 1: Push Project to GitHub

1. Initialize git and commit the files (if not already done):
   ```bash
   cd anuj-portfolio
   git init
   git add .
   git commit -m "feat: complete developer portfolio with VS Code shell and admin portal"
   ```
2. Create a new repository on your GitHub account (`github.com/new`), for example `anuj-portfolio`.
3. Add remote and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/anujyad810-dot/anuj-portfolio.git
   git push -u origin main
   ```

---

### Step 2: Connect Repository to Netlify

1. Log into your [Netlify](https://app.netlify.com) dashboard.
2. Click **"Add new site"** → **"Import an existing project"**.
3. Select **GitHub** and authorize access to your repository.
4. Select `anuj-portfolio`.

---

### Step 3: Configure Build Settings

Netlify will automatically detect settings from `netlify.toml`:
- **Build command:** `npm run build`
- **Publish directory:** `dist`

---

### Step 4: Add Environment Variables in Netlify

Before triggering the first build, add your production Supabase keys:
1. In the Netlify setup screen (or under **Site configuration** → **Environment variables**), click **"Add a variable"**:
   - `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOi...`
2. Click **"Deploy anuj-portfolio"**.

---

### Step 5: Custom Domain / Netlify Subdomain

1. Once deployed, Netlify assigns a URL like `https://funny-name-1234.netlify.app`.
2. Under **Site configuration** → **Domain management**, click **"Change site name"** and choose your preferred name (e.g. `anuj-yadav.netlify.app` or `anuj-portfolio.netlify.app`).
3. You can also connect a custom domain (e.g. `anujyadav.dev`) with free automatic SSL.

---

## Method 2: Manual Deploy via Netlify CLI

If you prefer to deploy without GitHub:
```bash
# 1. Install Netlify CLI globally
npm install -g netlify-cli

# 2. Build the project
npm run build

# 3. Deploy
netlify deploy --prod
```
When prompted for publish directory, enter `dist`.

---

## Verifying Post-Deployment Checks

- [ ] Public root `https://your-site.netlify.app/` loads the VS Code editor shell.
- [ ] Navigating to `/admin` prompts for your credentials.
- [ ] Adding a project in `/admin/projects` updates the file tree and terminal immediately.
- [ ] `./contact.sh` sends messages to `/admin/messages`.
- [ ] Recruiter Mode toggle in the title bar toggles smoothly.
