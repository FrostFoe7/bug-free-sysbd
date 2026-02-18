# Supabase Setup

## SQL Migrations

Run the SQL migration in your Supabase SQL Editor to sync Supabase Auth users with your database.

### Steps:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the contents of `supabase/migrations/20260218000000_create_user_sync_trigger.sql`
3. Click **Run**

This will:
- Create a trigger that automatically creates a `User` record when a new user signs up
- Create a trigger that updates the `User` email when auth email changes

## OAuth Providers (Optional)

To enable social login:

1. Go to **Authentication** → **Providers**
2. Enable **Google** or **GitHub**
3. Add your OAuth credentials
4. Update the redirect URL to: `https://your-domain.com/`

## Environment Variables

Make sure your `.env` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
