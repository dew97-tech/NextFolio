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
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
AUTH_SECRET=your-secret-key-here
BLOB_READ_WRITE_TOKEN=vercel_blob_token_here
```

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "feat: Complete blog admin with HTML rendering and modern UI"
git push origin main
```

### 2. Set Up Vercel Postgres Database
1. Go to Vercel Dashboard → Storage → Create Database
2. Select "Postgres"
3. Copy the `DATABASE_URL` connection string
4. Add to Environment Variables

### 3. Configure Environment Variables on Vercel
1. Go to Project Settings → Environment Variables
2. Add all three variables:
   - `DATABASE_URL` (from Vercel Postgres)
   - `AUTH_SECRET` (generate with: `openssl rand -base64 32`)
   - `BLOB_READ_WRITE_TOKEN` (from Vercel Blob Storage)

### 4. Deploy
- Vercel will auto-deploy from GitHub
- Or manually: `vercel --prod`

### 5. Run Database Migrations
After first deployment:
```bash
# In Vercel project settings, add build command:
prisma generate && prisma db push && next build
```

Or run manually via Vercel CLI:
```bash
vercel env pull .env.production
npx prisma db push
```

### 6. Seed Initial Admin User
Run the seed script to create admin account:
```bash
npx prisma db seed
```

## Post-Deployment Checklist
- [ ] Database connected successfully
- [ ] Admin login works at `/auth/signin`
- [ ] Can create/edit/delete blog posts
- [ ] Image uploads work
- [ ] Blog posts display correctly
- [ ] Dark mode works properly

## Default Admin Credentials
- Email: `admin@example.com`
- Password: `admin123`

**⚠️ IMPORTANT: Change these credentials immediately after first login!**

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
