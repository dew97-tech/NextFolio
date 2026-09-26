# Deployment Guide - Portfolio with Blog Admin

## Prerequisites Completed ✅
- Prisma configured with PostgreSQL
- NextAuth.js authentication setup
- Vercel Blob storage for images
- Admin dashboard with CRUD operations
- HTML blog rendering

## Environment Variables Needed on Vercel

### Required Variables:
```
# Supabase -> Project Settings -> Database -> Connection Strings
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require
DIRECT_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require
AUTH_SECRET=your-secret-key-here
BLOB_READ_WRITE_TOKEN=vercel_blob_token_here
CRON_SECRET=your-cron-secret-here
```

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "feat: Complete blog admin with HTML rendering and modern UI"
git push origin main
```

### 2. Set Up Supabase Postgres Database
1. Create a project at [supabase.com](https://supabase.com) (region: Singapore or Mumbai for lowest latency from Bangladesh)
2. Project Settings → Database → Connection Strings
3. Copy the **Transaction Mode** URL (port `6543`) → `DATABASE_URL`
4. Copy the **Session / Direct Mode** URL (port `5432`) → `DIRECT_URL`

### 3. Configure Environment Variables on Vercel
1. Go to Project Settings → Environment Variables
2. Add all variables:
   - `DATABASE_URL` (Supabase transaction pooler, port `6543`)
   - `DIRECT_URL` (Supabase direct connection, port `5432`)
   - `AUTH_SECRET` (generate with: `openssl rand -base64 32`)
   - `BLOB_READ_WRITE_TOKEN` (from Vercel Blob Storage)
   - `CRON_SECRET` (protects `/api/cron/generate-blog`)

### 4. Deploy
- Vercel will auto-deploy from GitHub
- Or manually: `vercel --prod`

### 5. Run Database Migrations
After first deployment:
```bash
# Locally, with DIRECT_URL set in .env:
npx prisma migrate deploy
```

Migrations are committed under `prisma/migrations/`.

If the database already existed before migrations were introduced (created via
`prisma db push`), mark the baseline as applied **once**, then deploy:
```bash
npx prisma migrate resolve --applied 0_init
npx prisma migrate deploy
```

### 6. First Admin Sign-In

There is no seed script and no default account.

- **Empty `User` table** → set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in Vercel
  *before* your first visit to `/auth/signin`. The first matching sign-in
  creates the admin. Clear `ADMIN_PASSWORD` afterwards to close that path.
- **Populated `User` table** → sign in with your existing credentials.

## Post-Deployment Checklist
- [ ] Database connected successfully
- [ ] Admin login works at `/auth/signin`
- [ ] Can create/edit/delete blog posts
- [ ] Image uploads work
- [ ] Blog posts display correctly
- [ ] Dark mode works properly

## Troubleshooting

### Prisma Client Not Generated
Run: `npx prisma generate`

### Database Connection Issues
- Check `DATABASE_URL` format
- Ensure SSL mode is enabled
- Verify database is accessible

### Build Failures
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify `postinstall` script runs

## Files Modified for Deployment
- `package.json` - Added postinstall script
- `vercel.json` - Build configuration
- `prisma/schema.prisma` - Database schema
