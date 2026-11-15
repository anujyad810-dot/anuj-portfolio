# Supabase Setup & Configuration Guide — Anuj Yadav Portfolio

This guide walks you through connecting your portfolio to a free Supabase project, executing the database schema, enabling Row Level Security (RLS), setting up storage buckets, and assigning your administrator account.

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in or create a free account.
2. Click **"New Project"**.
3. Fill in the project details:
   - **Name:** `anuj-portfolio` (or any name you prefer)
   - **Database Password:** Choose a strong password and save it safely.
   - **Region:** Choose a region close to your target audience (e.g., `South Asia (Mumbai)` or `East US`).
4. Click **"Create new project"** and wait about 1–2 minutes for provisioning.

---

## Step 2: Run Database SQL Scripts

In your Supabase project dashboard, click on the **SQL Editor** tab (icon `>_` in the left sidebar).

Execute the provided SQL files in the following exact order:

### 1. `supabase/schema.sql`
- Click **"New query"**.
- Copy and paste the entire contents of `supabase/schema.sql`.
- Click **"Run"** (Ctrl+Enter / Cmd+Enter).
- *Result:* Creates all tables (`admin_users`, `settings`, `projects`, `skill_groups`, `skills`, `project_skills`, `experience`, `education`, `certificates`, `messages`) and updated_at triggers.

### 2. `supabase/policies.sql`
- Open a new query in the SQL Editor.
- Copy and paste the entire contents of `supabase/policies.sql`.
- Click **"Run"**.
- *Result:* Enables strict Row Level Security (RLS) across all tables with the `is_admin()` security definer function. Public visitors have read-only access to published items and insert-only on messages.

### 3. `supabase/storage.sql`
- Open a new query in the SQL Editor.
- Copy and paste the entire contents of `supabase/storage.sql`.
- Click **"Run"**.
- *Result:* Creates the `portfolio-media` and `resume` public storage buckets with authenticated admin-only upload and deletion policies.

### 4. `supabase/seed.sql` (Initial Data)
- Open a new query in the SQL Editor.
- Copy and paste the entire contents of `supabase/seed.sql`.
- Click **"Run"**.
- *Result:* Populates your portfolio with initial data (Anuj Yadav, B.Tech CSE at MITS Gwalior, Technical Lead at ML Research Club, MUN Club, 3 sample projects, and 19 technology skills).

---

## Step 3: Create Your Administrator Account

1. In the Supabase dashboard, click **Authentication** in the left sidebar.
2. Click **Users** → **"Add user"** → **"Create user"**.
3. Enter:
   - **Email:** e.g. `anujyad810@gmail.com`
   - **Password:** Choose a secure password for your admin portal.
   - Toggle **"Auto Confirm User?"** to **ON**.
4. Click **"Create user"**.
5. Once created, copy the **User UID** (a UUID string like `12345678-abcd-...`).
6. Go back to the **SQL Editor**, open a new query, and run:
   ```sql
   INSERT INTO admin_users (id) VALUES ('<PASTE-YOUR-COPIED-USER-UID-HERE>');
   ```
7. Verify by running:
   ```sql
   SELECT * FROM admin_users;
   ```

*Security Note:* To prevent unauthorized registrations, go to **Authentication** → **Providers** → **Email** and turn **"Allow new users to sign up"** to **OFF**.

---

## Step 4: Obtain API Credentials & Configure Environment

1. In Supabase, click **Project Settings** (gear icon at the bottom of the sidebar) → **API**.
2. Find the **Project URL** and the **Project API keys**:
   - `Project URL`: e.g. `https://xyzcompany.supabase.co`
   - `anon / public key`: e.g. `eyJhbGciOiJIUzI1NiIsInR5cCI6...`
3. In your local project directory `anuj-portfolio`, open `.env.local` (or copy `.env.example` to `.env.local`):
   ```env
   VITE_SUPABASE_URL=https://xyzcompany.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

---

## Step 5: Test the Admin Login

1. Run the local dev server:
   ```bash
   npm run dev
   ```
2. Navigate to `http://localhost:5173/admin/login`.
3. Sign in using your administrator email and password.
4. You will be redirected to `/admin` with full control over projects, skills, settings, and media!
