# David Dew Mallick

Portfolio and editorial blog for David Dew Mallick, a software engineer in Dhaka, Bangladesh. Built with Next.js 16, Prisma, and Supabase, and deployed on Vercel.

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

**Live:** [davidmallick.dev](https://davidmallick.dev)

## Overview

The site serves two purposes. It presents a professional portfolio, and it runs a blog with its own administration and an automated drafting pipeline.

The home page, case studies, and published articles are prerendered with a daily revalidation. The blog listing, search, and dashboard render on request, and drafts and search results are kept out of search indexes.

## Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16, App Router, React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 with a CSS-first theme |
| Database | PostgreSQL on Supabase, Prisma 5 |
| Authentication | Auth.js (NextAuth v5) with bcrypt password hashing |
| Editor | Tiptap |
| File storage | Vercel Blob |
| Hosting | Vercel, functions pinned to the `sin1` region |

## Features

**Portfolio**

- Hero, experience timeline, and project cards built from typed data in `src/data`
- Two long-form case studies at `/work/bridgebooks` and `/work/augmenta`
- Skills, education, publications, awards, and a downloadable CV

**Blog**

- Listing with search and pagination, plus article pages with reading progress
- RSS feed, XML sitemap, and per-article structured data
- Publication date recorded separately from draft creation date

**Administration**

- Authenticated dashboard for creating, editing, publishing, and deleting posts
- Rich text editor with thumbnail upload to Vercel Blob
- Draft queue with a manual trigger for the generation pipeline

**Automation**

- A daily cron drafts one article from live trend feeds, a curated topic bank, and Search Console queries
- Each draft is validated for length, structure, keyword use, and link targets before it is stored
- Drafts remain unpublished, and generation pauses once three are awaiting review

## Getting started

Requires Node.js 20.9 or newer and a PostgreSQL database.

```bash
git clone https://github.com/dew97-tech/NextFolio.git
cd NextFolio
npm install
cp .env.example .env
```

Fill in `.env`, then apply the migrations and start the development server:

```bash
npx prisma migrate deploy
npm run dev
```

The site runs at http://localhost:3000.

There is no default account. While the user table is empty, an admin is created on the first sign-in only when the submitted credentials match `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Clear `ADMIN_PASSWORD` afterwards to disable that path.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Pooled connection used by the application at runtime, port 6543 |
| `DIRECT_URL` | Direct connection used only by the Prisma CLI for migrations, port 5432 |
| `AUTH_SECRET` | Session signing key |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | First-admin bootstrap, disabled once cleared |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, without a trailing slash |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob access for thumbnail uploads |
| `OPENCODE_GO_API_KEY` | Model access for article generation |
| `CRON_SECRET` | Protects the generation endpoint |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` | Search Console reads |
| `GSC_PROPERTY` | Search Console property, for example `sc-domain:example.com` |

`DEPLOYMENT.md` covers how each value is obtained.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check without emitting |
| `npm run check:dashes` | Fails on em or en dashes in source |
| `npm run strip:dashes` | Rewrites em and en dashes in source |
| `npm run og` | Regenerates the Open Graph image |

## Project structure

```
src/
  app/
    (site)/       Public pages: home, blog, and case studies
    admin/        Authenticated dashboard and post editor
    api/          Auth, upload, and cron route handlers
    lib/          Server actions, Prisma client, generation, Google APIs
    ui/           Client components for the blog and admin interface
  components/     Portfolio sections
  data/           Typed resume and case study content
prisma/           Schema and migrations
scripts/          Maintenance scripts
```

## Deployment

Pushes to `main` deploy to production on Vercel. The build applies pending migrations before the Next.js build, and functions run in the `sin1` region alongside the database. The complete procedure, including DNS and environment configuration, is documented in `DEPLOYMENT.md`.

## Documentation

| Document | Contents |
| --- | --- |
| `DEPLOYMENT.md` | Deployment steps, environment setup, and troubleshooting |
| `DESIGN.md` | Design system: palette, typography, shape, structure, and copy rules |

## License

Released under the MIT License. Copyright (c) 2026 David Dew Mallick.
