# David Dew Mallick - Portfolio & Blog CMS

[![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel)](https://vercel.com/)

A highly animated, responsive, and performance-optimized portfolio website built with Next.js 16, featuring a complete blog CMS with admin dashboard, dark/light mode support, and SEO optimization.

**Live Demo:** [https://davidmallick.dev](https://davidmallick.dev)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack & Architecture](#tech-stack--architecture)
- [Project Structure](#project-structure)
- [Component Documentation](#component-documentation)
- [Database Schema](#database-schema)
- [API Routes](#api-routes)
- [Authentication System](#authentication-system)
- [Styling & Design System](#styling--design-system)
- [SEO Configuration](#seo-configuration)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Dependencies](#dependencies)
- [Development Guidelines](#development-guidelines)

---

## Overview

This portfolio website serves as both a professional showcase and a content management system. It demonstrates modern full-stack development practices with a focus on:

- **Performance**: Static Site Generation (SSG) for lightning-fast page loads
- **Accessibility**: WCAG-compliant semantic HTML and keyboard navigation
- **SEO**: Comprehensive metadata, structured data, and sitemap generation
- **Developer Experience**: TypeScript for type safety, ESLint for code quality
- **User Experience**: Smooth animations, responsive design, and dark/light mode

### Why This Architecture?

The project uses **Next.js App Router** with a hybrid rendering strategy:
- **Static Generation** for portfolio sections (Hero, Experience, Projects) ensuring fast loads
- **Server Components** for blog listing and detail pages with database queries
- **Server Actions** for admin CRUD operations, eliminating API boilerplate
- **Client Components** only where interactivity is needed (animations, forms, theme toggle)

This approach minimizes JavaScript bundle size while maintaining full interactivity where required.

---

## Key Features

### Portfolio Sections

#### 1. Hero Section
- Animated entrance with staggered text reveals using Framer Motion
- Professional introduction with role and brief bio
- Call-to-action buttons linking to work section and downloadable CV
- Responsive typography scaling

#### 2. Experience Timeline
- Chronological work history with expandable project details
- Each role includes:
  - Company name, location, and employment dates
  - Project descriptions with technical context
  - Key achievements with bullet points
- Smooth scroll-triggered animations

#### 3. Projects Showcase
- Grid layout displaying featured projects from experience
- Each card features:
  - Project title and company
  - Detailed description
  - Key achievements list
- Hover effects with subtle lift animations

#### 4. Skills & Education
- Technical skills displayed as animated badges
- Education timeline with institutions and GPAs
- Publications section with IEEE paper links
- Organized by categories (Languages, Frameworks, Methodologies)

#### 5. Awards & Honors
- Grid layout of achievements
- Each award card includes:
  - Title
  - Detailed description
  - Visual icon representation

### Blog System

#### Public Blog
- **Listing Page** (`/blog`):
  - Search functionality with debounced input (300ms)
  - Pagination (6 posts per page) with smart page number generation
  - Post cards with thumbnail, title, description, date, and tags
  - Responsive grid layout

- **Post Detail Page** (`/blog/[slug]`):
  - Server-rendered HTML content
  - Publication date and reading time
  - Tag display
  - SEO-optimized meta tags per post
  - Back navigation

#### Admin Dashboard
- **Protected Routes**: All `/admin/*` routes require authentication
- **Dashboard Home** (`/admin`):
  - Statistics overview (total posts, published/unpublished counts)
  - Data table with all posts
  - Quick actions (Edit, Delete, Publish/Unpublish)
  - Create new post button

- **Post Editor** (`/admin/new` and `/admin/edit/[id]`):
  - Full-featured form with Zod validation
  - Rich HTML content editing
  - Image upload with Vercel Blob integration
  - Thumbnail preview
  - SEO fields (title, description, slug)
  - Tag management
  - Publish/draft toggle
  - Reading time calculation

### Interactive Features

#### Custom Cursor Trail
- Animated cursor following mouse movement (desktop only)
- Expands on hover over clickable elements
- Smooth spring physics using Framer Motion
- Disabled on mobile/touch devices

#### Dark/Light Mode
- System preference detection
- Manual toggle with animated sun/moon icons
- Persistent preference storage
- Smooth transitions between themes
- Sage green color palette adapts to both modes

#### Navigation
- Fixed header with scroll detection
- Background blur effect on scroll
- Mobile hamburger menu with slide-down animation
- Smooth scroll to anchor sections
- Active section highlighting

---

## Tech Stack & Architecture

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.3 | React framework with App Router, Server Components, and Server Actions |
| **React** | 19.2.0 | UI library with concurrent features |
| **React DOM** | 19.2.0 | DOM rendering |
| **TypeScript** | 5.x | Static type checking |

### Database & ORM

| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | 13+ | Relational database for blog posts and user data |
| **Prisma** | 5.22.0 | Type-safe ORM with schema management |
| **@prisma/client** | 5.22.0 | Database client with auto-generated types |

**Why PostgreSQL + Prisma?**
- Prisma provides type-safe database queries with auto-completion
- Schema migrations and version control
- Connection pooling optimized for serverless environments
- Excellent Next.js integration

### Authentication

| Technology | Version | Purpose |
|------------|---------|---------|
| **NextAuth.js** | 5.0.0-beta.30 | Authentication with Credentials provider |
| **bcryptjs** | 3.0.3 | Password hashing with salt rounds |

**Auth Flow:**
1. Credentials provider accepts email/password
2. Password verified with bcryptjs
3. Session stored in PostgreSQL via Prisma adapter
4. JWT strategy for stateless authentication
5. Middleware protects admin routes

### Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **@tailwindcss/postcss** | 4.x | PostCSS plugin for Tailwind v4 |
| **tailwindcss-animate** | 1.0.7 | Animation utilities |
| **tailwind-merge** | 3.4.0 | Merge Tailwind classes without conflicts |
| **clsx** | 2.1.1 | Conditional class name construction |

**Why Tailwind CSS v4?**
- Just-in-Time (JIT) compiler for fast builds
- CSS-first configuration with `@theme inline`
- Built-in dark mode support
- Excellent developer experience with IntelliSense

### Animations

| Technology | Version | Purpose |
|------------|---------|---------|
| **Framer Motion** | 12.23.24 | Production-ready animation library |

**Animation Patterns:**
- `initial`/`animate` for entrance animations
- `whileInView` for scroll-triggered reveals
- `useSpring` for physics-based cursor movement
- `AnimatePresence` for mount/unmount animations
- Staggered children animations for lists

### Icons

| Technology | Version | Purpose |
|------------|---------|---------|
| **Lucide React** | 0.554.0 | Modern icon library (primary) |
| **Heroicons** | 2.2.0 | Additional icons |

### Storage

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vercel Blob** | 2.0.0 | Serverless file storage for blog thumbnails |

**Upload Flow:**
1. Client selects image
2. Image validated (type, size)
3. Uploaded to Vercel Blob via API route
4. URL stored in database
5. Image served from CDN

### Forms & Validation

| Technology | Version | Purpose |
|------------|---------|---------|
| **Zod** | 4.1.12 | Schema validation for forms |
| **React Hook Form** | (implicit) | Form state management via Server Actions |

### Utilities

| Technology | Version | Purpose |
|------------|---------|---------|
| **use-debounce** | 10.0.6 | Debounce hook for search input |
| **next-themes** | 0.4.6 | Theme management with system preference |

---

## Project Structure

```
portfolio/
├── .next/                      # Next.js build output (generated)
├── .prisma/                    # Prisma generated client
├── .vercel/                    # Vercel deployment config
├── prisma/
│   └── schema.prisma          # Database schema definition
├── public/                     # Static assets
│   ├── *.png                  # Favicons and icons
│   ├── *.svg                  # UI icons
│   ├── David_Mallick_CV.pdf   # Downloadable resume
│   └── google*.html           # Search console verification
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (routes)/
│   │   │   ├── admin/        # Admin dashboard
│   │   │   │   ├── page.tsx              # Dashboard home
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx          # Create post
│   │   │   │   ├── edit/
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx      # Edit post
│   │   │   │   └── layout.tsx            # Admin layout
│   │   │   ├── api/
│   │   │   │   ├── auth/
│   │   │   │   │   └── [...nextauth]/
│   │   │   │   │       └── route.ts      # NextAuth handlers
│   │   │   │   └── upload/
│   │   │   │       └── route.ts          # Image upload API
│   │   │   ├── auth/
│   │   │   │   └── signin/
│   │   │   │       └── page.tsx          # Login page
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx              # Blog listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx          # Post detail
│   │   │   ├── lib/
│   │   │   │   ├── prisma.ts             # Prisma singleton
│   │   │   │   ├── actions.ts            # Auth actions
│   │   │   │   └── admin-actions.ts      # CRUD operations
│   │   │   └── ui/
│   │   │       ├── blog-search.tsx       # Search component
│   │   │       ├── blog-pagination.tsx   # Pagination
│   │   │       ├── delete-post-button.tsx
│   │   │       ├── login-form.tsx
│   │   │       └── post-form.tsx         # Post editor
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Portfolio homepage
│   │   ├── loading.tsx         # Global loading state
│   │   ├── globals.css         # Global styles & Tailwind
│   │   ├── robots.ts           # Robots.txt generation
│   │   └── sitemap.ts          # Sitemap generation
│   ├── components/
│   │   ├── awards.tsx          # Awards section
│   │   ├── cursor-trail.tsx    # Custom cursor
│   │   ├── experience.tsx      # Work experience
│   │   ├── footer.tsx          # Site footer
│   │   ├── hero.tsx            # Hero section
│   │   ├── navbar.tsx          # Navigation
│   │   ├── projects.tsx        # Projects grid
│   │   ├── skills.tsx          # Skills & education
│   │   ├── theme-provider.tsx  # Theme context
│   │   └── ui/
│   │       └── theme-toggle.tsx
│   ├── data/
│   │   └── resume.ts           # Portfolio data
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   ├── auth.ts                 # NextAuth config
│   ├── auth.config.ts          # Auth route protection
│   └── middleware.ts           # Route middleware
├── .env                        # Environment variables
├── .env.local                  # Local environment
├── .gitignore
├── DEPLOYMENT.md              # Deployment guide
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies
├── postcss.config.mjs         # PostCSS configuration
├── system_prompt.md           # AI blog writing prompt
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── vercel.json                # Vercel deployment config
```

---

## Component Documentation

### Layout Components

#### `src/app/layout.tsx`
**Purpose**: Root layout wrapping all pages

**Key Features**:
- SEO metadata with OpenGraph, Twitter Cards, JSON-LD
- ThemeProvider wrapper for dark/light mode
- Geist font integration (Sans + Mono)
- Structured data for Google rich snippets

**Metadata Includes**:
- Page title and description
- Keywords for SEO
- Author and creator information
- OpenGraph images and site name
- Twitter card configuration
- Google site verification
- Multi-size favicon links

**JSON-LD Schema** (Person):
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "David Dew Mallick",
  "jobTitle": "Software Engineer",
  "url": "https://davidmallick.dev",
  "sameAs": ["GitHub", "LinkedIn"],
  "worksFor": {"name": "JB Connect Ltd."}
}
```

#### `src/app/admin/layout.tsx`
**Purpose**: Admin dashboard layout

**Features**:
- Sticky header with navigation
- Sign out functionality
- Containerized content area
- Authentication-guarded wrapper

---

### Portfolio Section Components

#### `src/components/hero.tsx`
**Purpose**: Landing section with introduction

**Animations**:
- Staggered text reveal using `motion.div` with delay offsets
- Fade-in from bottom (`y: 20` → `y: 0`)
- Opacity transition (`0` → `1`)
- Duration: 0.5s with 0.1s stagger

**Content**:
- Name with period accent
- Professional role
- Brief bio
- Two CTAs: "View Work" (anchor link) and "Download CV" (PDF)

#### `src/components/experience.tsx`
**Purpose**: Work history timeline

**Data Structure**:
- Reads from `src/data/resume.ts`
- Each job includes: company, role, dates, location, projects
- Projects have descriptions and achievement lists

**UI Pattern**:
- Vertical timeline layout
- Company info card with hover effects
- Expandable/collapsible project details
- Location and date badges

**Animations**:
- Scroll-triggered reveals (`whileInView`)
- Staggered entrance for each job card
- Smooth transitions between states

#### `src/components/projects.tsx`
**Purpose**: Featured projects showcase

**Data Source**: Filters projects from experience data marked as featured

**Layout**:
- Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- Project cards with:
  - Title and company attribution
  - Detailed description
  - Key achievements (bullet list)
- Hover effect: subtle lift (`translateY(-4px)`)

#### `src/components/skills.tsx`
**Purpose**: Technical skills, education, and publications

**Sections**:
1. **Languages & Frameworks**: JavaScript, React, Next.js, PHP, Laravel
2. **Methodologies**: Agile
3. **Education Timeline**: 
   - BRAC University (B.Sc. CSE, 2018-2022)
   - St. Gregory's High School (HSC, 2016-2018)
   - St. Gregory's High School (SSC, 2006-2016)
4. **Publications**:
   - IEEE papers on Bangla spelling correction
   - Multilingual text classification

**Design**:
- Skills displayed as animated badges
- Education cards with institution logos
- Publication cards with external links

#### `src/components/awards.tsx`
**Purpose**: Honors and achievements display

**Awards**:
- Dean's List Achievements
- Presentation Award
- Runner Up Trophy
- Attendance Record

**Layout**: 2-column responsive grid with card-based design

#### `src/components/navbar.tsx`
**Purpose**: Site navigation

**Features**:
- Fixed position (top: 0)
- Scroll detection for background blur
- Desktop: Horizontal nav with hover underlines
- Mobile: Hamburger menu with slide-down animation
- Active section highlighting

**State Management**:
- `isOpen`: Mobile menu toggle
- `scrolled`: Background effect trigger
- `mounted`: Hydration-safe window access

**Links**:
- Experience
- Projects
- Skills
- Blog

#### `src/components/footer.tsx`
**Purpose**: Site footer with social links

**Content**:
- Copyright notice with dynamic year
- Social links: GitHub, LinkedIn, Email
- "Available for new opportunities" badge

**Design**:
- Minimalist design
- Centered content
- Icon buttons with hover effects

---

### UI/UX Components

#### `src/components/cursor-trail.tsx`
**Purpose**: Custom animated cursor (desktop only)

**Technical Implementation**:
- `useMotionValue` for cursor position tracking
- `useSpring` for physics-based smoothing (damping: 25, stiffness: 700)
- Event listener on `window.mousemove`
- Pointer detection via `window.getComputedStyle()

**Design**:
- 32px circular cursor with border
- Mix-blend-mode: difference
- Expands to 1.5x on clickable elements
- Hidden on mobile (`hidden md:block`)

**Performance**:
- `will-change: transform` optimization
- RequestAnimationFrame via Framer Motion
- Cleanup on unmount

#### `src/components/theme-provider.tsx`
**Purpose**: Theme context wrapper

**Props**:
- `attribute="class"`: Applies theme via CSS class
- `defaultTheme="system"`: Respects OS preference
- `enableSystem`: System preference detection
- `disableTransitionOnChange`: Prevents flash

**Why next-themes?**
- Prevents flash of wrong theme
- Handles system preference changes
- Stores preference in localStorage
- Works with Tailwind dark mode

#### `src/components/ui/theme-toggle.tsx`
**Purpose**: Theme switcher button

**Implementation**:
- `useTheme` hook from next-themes
- `mounted` state to prevent hydration mismatch
- Animated sun/moon icons using Framer Motion
- Scale and rotation transitions

**Accessibility**:
- `aria-label="Toggle theme"`
- Focus ring on keyboard navigation

---

### Blog Components

#### `src/app/blog/page.tsx`
**Purpose**: Blog listing page

**Data Fetching**:
- Server Component fetches posts from Prisma
- Supports search and pagination query params
- Only published posts shown to public

**Features**:
- Search input with debouncing
- Pagination (6 posts per page)
- Post cards with thumbnail, title, description, date
- Tags display
- "Read more" links

**SEO**:
- Dynamic metadata based on page
- Canonical URL

#### `src/app/blog/[slug]/page.tsx`
**Purpose**: Individual blog post page

**Data Fetching**:
- `generateStaticParams`: Pre-renders all posts at build time
- Fetches post by slug from database
- NotFound page for invalid slugs

**Content Rendering**:
- HTML content rendered via `dangerouslySetInnerHTML`
- Styled with Tailwind typography classes
- Thumbnail image
- Publication date and reading time
- Tags list

**SEO**:
- Dynamic title and description
- OpenGraph images per post

#### `src/app/ui/blog-search.tsx`
**Purpose**: Search input component

**Implementation**:
- Client Component with `useState` and `useEffect`
- Debounced input (300ms) using `use-debounce`
- URL query param sync with `useRouter`
- Search icon and clear button

**UX**:
- Real-time feedback
- Loading state during debounce
- Keyboard accessible

#### `src/app/ui/blog-pagination.tsx`
**Purpose**: Pagination controls

**Algorithm**:
- Smart page number generation
- Shows: First page, current neighborhood, last page
- Ellipsis for skipped ranges
- Previous/Next navigation

**Props**:
- `currentPage`: Active page number
- `totalPages`: Total available pages
- `baseUrl`: URL prefix for links

---

### Admin Components

#### `src/app/admin/page.tsx`
**Purpose**: Admin dashboard

**Authentication**:
- Checks session via `auth()`
- Redirects to sign-in if unauthenticated

**Features**:
- Statistics cards (Total Posts, Published, Drafts)
- Data table with all posts
- Action buttons: Edit, Delete, Publish/Unpublish
- Create new post CTA

**Data Fetching**:
- Server Component fetches all posts
- Calculates statistics

#### `src/app/admin/new/page.tsx`
**Purpose**: Create new post wrapper

**Function**:
- Simple wrapper around `PostForm`
- No initial data (create mode)

#### `src/app/admin/edit/[id]/page.tsx`
**Purpose**: Edit post wrapper

**Function**:
- Fetches post by ID
- Passes post data to `PostForm` (edit mode)
- NotFound if post doesn't exist

#### `src/app/ui/post-form.tsx`
**Purpose**: Post creation/editing form

**Fields**:
- Title (text input)
- Slug (auto-generated from title, editable)
- Description (textarea)
- Content (textarea for HTML)
- Thumbnail (image upload)
- Tags (comma-separated input)
- Read Time (auto-calculated, editable)
- Published (checkbox)

**Image Upload**:
- Client-side file selection
- Uploads to `/api/upload`
- Vercel Blob storage
- Preview before save

**Validation**:
- Zod schema validates all fields
- Slug uniqueness check
- Required field validation

**Actions**:
- Create: Calls `createPost` Server Action
- Update: Calls `updatePost` Server Action
- Success: Redirects to admin dashboard

#### `src/app/ui/delete-post-button.tsx`
**Purpose**: Delete confirmation button

**UX**:
- Confirmation dialog before deletion
- Loading state during deletion
- Success/error feedback
- Redirects after deletion

**Action**: Calls `deletePost` Server Action

#### `src/app/ui/login-form.tsx`
**Purpose**: Admin login form

**Fields**:
- Email input
- Password input (masked)
- Submit button with loading state

**Validation**:
- Client-side: Required fields
- Server-side: Credentials verification via `authenticate` action

**Error Handling**:
- Displays authentication errors
- Rate limiting awareness

---

### Utility Components

#### `src/lib/utils.ts`
**Purpose**: Utility functions

**Exports**:
```typescript
export function cn(...inputs: ClassValue[]): string
```

**Function**: Merges Tailwind classes with `clsx` and `tailwind-merge`
- Handles conditional classes
- Resolves conflicting Tailwind utilities
- Returns final className string

**Usage**:
```typescript
className={cn("base-class", isActive && "active-class", className)}
```

---

## Database Schema

### Prisma Models

#### User Model
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // Hashed with bcryptjs
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

**Purpose**: Admin user accounts for blog management

#### Account Model (NextAuth)
```prisma
model Account {
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@id([provider, providerAccountId])
}
```

**Purpose**: OAuth account linking (extensible for future OAuth providers)

#### Session Model (NextAuth)
```prisma
model Session {
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

**Purpose**: Active user sessions stored in database

#### VerificationToken Model (NextAuth)
```prisma
model VerificationToken {
  identifier String
  token      String
  expires    DateTime
  @@id([identifier, token])
}
```

**Purpose**: Email verification tokens (for future email features)

#### Post Model (Blog)
```prisma
model Post {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  description String
  content     String   @db.Text  // HTML content
  published   Boolean  @default(false)
  date        DateTime @default(now())
  readTime    String   // e.g., "5 min read"
  tags        String[] // Array of tags
  thumbnail   String?  // Vercel Blob URL
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Purpose**: Blog posts with full content management

**Fields Explained**:
- `slug`: URL-friendly identifier (e.g., "my-first-post")
- `content`: Full HTML content of the post
- `published`: Visibility toggle (draft vs. published)
- `date`: Publication date (can be future-dated)
- `tags`: Array for categorization
- `thumbnail`: Cover image URL from Vercel Blob

---

## API Routes

### Authentication Route

#### `src/app/api/auth/[...nextauth]/route.ts`
**Path**: `/api/auth/[...nextauth]`

**Methods**: GET, POST

**Handler**: NextAuth.js configured in `src/auth.ts`

**Flow**:
1. Client sends credentials to this route
2. NextAuth validates via authorize callback
3. Session created and stored
4. JWT returned to client

### Upload Route

#### `src/app/api/upload/route.ts`
**Path**: `/api/upload`

**Method**: POST

**Authentication**: Requires active session

**Request Body**:
```typescript
{
  filename: string;
  contentType: string;  // e.g., "image/jpeg"
}
```

**Response**:
```typescript
{
  url: string;          // Vercel Blob URL
  downloadUrl: string;  // Direct download URL
  pathname: string;     // Blob pathname
}
```

**Implementation**:
```typescript
export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename, contentType } = await request.json();
  
  const blob = await put(filename, request.body, {
    contentType,
    access: "public",
  });

  return Response.json(blob);
}
```

**Security**:
- Authentication check prevents unauthorized uploads
- Content type validation
- Public access for serving images

---

## Authentication System

### Architecture

The project uses **NextAuth.js v5** (Auth.js) with:
- **Provider**: Credentials (email/password)
- **Strategy**: JWT (JSON Web Tokens)
- **Session Storage**: PostgreSQL via Prisma adapter
- **Password Hashing**: bcryptjs with 10 salt rounds

### Configuration

#### `src/auth.ts`

**Credentials Provider**:
```typescript
Credentials({
  name: "credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" }
  },
  async authorize(credentials) {
    // 1. Find user by email
    // 2. Verify password with bcrypt.compare()
    // 3. Return user object or null
  }
})
```

**Auto-Setup Feature**:
- On first run, creates admin user automatically
- Checks if any users exist in database
- If not, creates user with default credentials
- Seeds initial blog post about MEO/SEO

**Callbacks**:
- `session`: Adds user ID to session
- `jwt`: Persists user data in token

### Route Protection

#### `src/auth.config.ts`

**Protected Routes**:
```typescript
{
  pages: {
    signIn: "/auth/signin"  // Custom login page
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      
      if (isOnAdmin && !isLoggedIn) {
        return false;  // Redirect to sign-in
      }
      return true;
    }
  }
}
```

#### `src/middleware.ts`

**Implementation**:
```typescript
export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/admin/:path*"]  // Protect all /admin routes
};
```

**Why Middleware?**
- Runs at edge (fast)
- Protects routes before page render
- Consistent with NextAuth v5 patterns

### Server Actions

#### `src/app/lib/actions.ts`

**authenticate()**:
```typescript
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials";
        default:
          return "Something went wrong";
      }
    }
    throw error;
  }
}
```

**Usage**: Called from login form for server-side authentication

### Admin Actions

#### `src/app/lib/admin-actions.ts`

All actions require authentication (checked via `auth()`)

**createPost(formData)**:
- Validates data with Zod schema
- Creates post in database
- Revalidates `/blog` page
- Redirects to admin dashboard

**updatePost(id, formData)**:
- Validates data
- Updates existing post
- Revalidates affected pages
- Redirects to admin

**deletePost(id)**:
- Deletes post by ID
- Revalidates `/blog`
- Returns success/error status

**Why Server Actions?**
- No API route boilerplate
- Automatic CSRF protection
- Type-safe data flow
- Built-in cache revalidation

---

## Styling & Design System

### Color Palette

The project uses a **Sage Green** color scheme that works in both light and dark modes.

#### Light Mode
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-cream` | `#F1F3E0` | Page background |
| `--color-sage-light` | `#D2DCB6` | Light accents |
| `--color-sage-medium` | `#A1BC98` | Secondary elements |
| `--color-sage-dark` | `#778873` | Primary buttons, links |

#### Dark Mode
| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#0a0f0a` | Page background |
| Cards | `#111611` | Card backgrounds |
| Text | `#e8ebe8` | Primary text |
| Muted | `#9ca39c` | Secondary text |

### Typography

**Font Family**: Geist (Sans + Mono)
- Modern, clean sans-serif
- Excellent readability at all sizes
- Monospace variant for code

**Scale**:
- Hero: `text-5xl md:text-7xl`
- H2: `text-3xl md:text-4xl`
- Body: `text-base`
- Small: `text-sm`

### Spacing System

Uses Tailwind's default spacing scale with container padding:
- Container: `container mx-auto px-4 md:px-6`
- Section gap: `gap-16 md:gap-24`
- Card padding: `p-6 md:p-8`

### Animation Patterns

**Entrance Animations**:
```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, delay: index * 0.1 }}
```

**Scroll Reveals**:
```typescript
initial={{ opacity: 0, y: 50 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-100px" }}
transition={{ duration: 0.6 }}
```

**Hover Effects**:
```typescript
whileHover={{ y: -4 }}
transition={{ duration: 0.2 }}
```

### Component Patterns

**Card Design**:
```typescript
className="bg-card rounded-lg p-6 md:p-8 border border-border shadow-sm
           hover:shadow-md transition-shadow"
```

**Button Variants**:
- Primary: `bg-primary text-primary-foreground hover:bg-primary/90`
- Secondary: `bg-secondary text-secondary-foreground hover:bg-secondary/80`
- Ghost: `hover:bg-accent hover:text-accent-foreground`

### Tailwind Configuration

**v4 Features Used**:
```css
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  /* ... more theme mappings */
}
```

**Custom Properties** (globals.css):
```css
:root {
  --color-cream: #F1F3E0;
  --color-sage-light: #D2DCB6;
  --color-sage-medium: #A1BC98;
  --color-sage-dark: #778873;
}
```

---

## SEO Configuration

### Metadata (layout.tsx)

**Base Configuration**:
```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://davidmallick.dev"),
  title: {
    default: "David Dew Mallick | Software Engineer",
    template: "%s | David Dew Mallick"
  },
  description: "Portfolio of David Dew Mallick...",
  keywords: ["Software Engineer", "Next.js", "React", "AI", ...],
  authors: [{ name: "David Dew Mallick" }],
  creator: "David Dew Mallick",
  // ... more
};
```

**OpenGraph**:
- Type: `website`
- Locale: `en_US`
- Site name included
- Title and description per page

**Twitter Cards**:
- Card type: `summary_large_image`
- Creator handle: `@dew97_tech`
- Optimized for social sharing

### JSON-LD Structured Data

**Person Schema**:
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "David Dew Mallick",
  "jobTitle": "Software Engineer",
  "url": "https://davidmallick.dev",
  "sameAs": [
    "https://github.com/dew97-tech",
    "https://www.linkedin.com/in/david-dew-mallick-618a6223b/"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "JB Connect Ltd."
  }
}
```

**Benefits**:
- Google Knowledge Graph inclusion
- Rich snippets in search results
- Improved click-through rates

### Sitemap Generation

**Dynamic Sitemap** (`src/app/sitemap.ts`):
- Homepage with priority 1.0
- All published blog posts with priority 0.8
- Updates `lastModified` with post dates
- Change frequency: monthly

### Robots.txt

**Configuration** (`src/app/robots.ts`):
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://davidmallick.dev/sitemap.xml",
  };
}
```

### Favicon Strategy

Multiple sizes for different platforms:
- `favicon.ico`: Browser tabs
- `favicon-16x16.png`: Legacy browsers
- `favicon-32x32.png`: Standard favicon
- `apple-touch-icon.png`: iOS home screen (180x180)
- `android-chrome-192x192.png`: Android (192x192)
- `android-chrome-512x512.png`: Android splash (512x512)

### Google Search Console

Verification file: `public/google1347225d93216c33.html`

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Database (Supabase: pooled runtime + direct migrations)
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require
DIRECT_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require

# Authentication
AUTH_SECRET=your-secret-key-here-minimum-32-characters

# Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_token_here
```

### Variable Descriptions

#### DATABASE_URL
**Purpose**: Pooled PostgreSQL connection string used by the app at runtime.

**Format**: `postgresql://username:password@hostname:6543/database?pgbouncer=true&connection_limit=1&sslmode=require`

**Setup**:
1. Create a project on [Supabase](https://supabase.com)
2. Project Settings -> Database -> Connection Strings -> **Transaction Mode** (port `6543`)
3. Keep `pgbouncer=true&connection_limit=1`; serverless functions create many short-lived connections
4. Ensure `sslmode=require` is present

#### DIRECT_URL
**Purpose**: Direct (non-pooled) PostgreSQL connection used **only** by the Prisma CLI for migrations.

**Format**: `postgresql://username:password@hostname:5432/database?sslmode=require`

**Setup**:
1. Project Settings -> Database -> Connection Strings -> **Session / Direct Mode** (port `5432`)
2. DDL statements (migrations) cannot run through the transaction pooler, so Prisma needs this separate URL
3. Not used by the application at runtime

**Why SSL?**
- Encrypts data in transit
- Required by most managed PostgreSQL providers
- Prevents man-in-the-middle attacks

#### AUTH_SECRET
**Purpose**: NextAuth.js session signing key

**Generation**:
```bash
openssl rand -base64 32
```

**Security**:
- Minimum 32 characters
- Keep secret - never commit to version control
- Rotating requires all users to re-login

#### BLOB_READ_WRITE_TOKEN
**Purpose**: Vercel Blob storage authentication

**Setup**:
1. Go to Vercel Dashboard → Storage → Blob
2. Create new Blob store
3. Copy read/write token

**Permissions**:
- Read: Public access to images
- Write: Admin-only via API route

---

## Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher (or pnpm/yarn)
- **PostgreSQL**: 13 or higher (local or cloud)
- **Git**: For version control

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your database credentials and secrets
```

4. **Initialize the database**:
```bash
# Generate Prisma client
npx prisma generate

# Apply committed migrations (uses DIRECT_URL)
npx prisma migrate deploy

# (Optional) Seed initial data
npx prisma db seed
```

> **Existing databases created before migrations were introduced:** mark the
> baseline as already applied once, then deploy the remaining migrations.
> ```bash
> npx prisma migrate resolve --applied 0_init
> npx prisma migrate deploy
> ```

5. **Run the development server**:
```bash
npm run dev
```

6. **Open in browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

### Development Workflow

**Available Scripts**:

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Type checking
npm run typecheck

# Database operations
npx prisma studio          # Open Prisma Studio GUI
npx prisma migrate dev     # Create + apply a migration (local development)
npx prisma migrate deploy  # Apply committed migrations (production)
npx prisma generate        # Regenerate client
```

**First sign-in**

There is no default account. If the `User` table is **empty**, an admin is
created only when the submitted credentials match `ADMIN_EMAIL` **and**
`ADMIN_PASSWORD` from your environment variables (see `src/auth.ts` →
`bootstrapAdmin`). Set both before your first sign-in, then clear
`ADMIN_PASSWORD` to disable that path permanently.

Against a populated database, sign in normally with your own credentials.

---

## Deployment

### Vercel Deployment

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

2. **Import to Vercel**:
- Go to [vercel.com](https://vercel.com)
- Click "Add New Project"
- Import from GitHub
- Select your repository

3. **Configure Environment Variables**:
Add these in Vercel Dashboard → Project Settings → Environment Variables:
- `DATABASE_URL` (Supabase transaction pooler, port `6543`)
- `DIRECT_URL` (Supabase direct connection, port `5432`)
- `AUTH_SECRET`
- `BLOB_READ_WRITE_TOKEN`

4. **Deploy**:
- Vercel will auto-deploy on every push to main
- Or trigger manual deployment

5. **Post-Deployment**:
- Visit Vercel Dashboard → Storage
- Set up PostgreSQL database if not done
- Run migrations:
  ```bash
  vercel env pull .env.production
  npx prisma migrate deploy
  ```

### Build Configuration

**Vercel Config** (`vercel.json`):
```json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

**Why this build command?**
- Generates Prisma client before build
- Ensures database types are available
- Prevents build-time type errors

### Custom Domain (Optional)

1. Go to Vercel Dashboard → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `metadataBase` in `layout.tsx`:
   ```typescript
   metadataBase: new URL("https://yourdomain.com")
   ```

---

## Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.0.3 | React framework with App Router |
| `react` | 19.2.0 | UI library |
| `react-dom` | 19.2.0 | DOM rendering |
| `@prisma/client` | 5.22.0 | Database ORM client |
| `prisma` | 5.22.0 | Database schema management |
| `next-auth` | 5.0.0-beta.30 | Authentication |
| `bcryptjs` | 3.0.3 | Password hashing |
| `@vercel/blob` | 2.0.0 | Image storage |
| `framer-motion` | 12.23.24 | Animations |
| `tailwindcss` | 4.x | CSS framework |
| `@tailwindcss/postcss` | 4.x | Tailwind PostCSS plugin |
| `tailwindcss-animate` | 1.0.7 | Animation utilities |
| `tailwind-merge` | 3.4.0 | Class merging |
| `clsx` | 2.1.1 | Conditional classes |
| `lucide-react` | 0.554.0 | Icons |
| `@heroicons/react` | 2.2.0 | Additional icons |
| `next-themes` | 0.4.6 | Theme management |
| `zod` | 4.1.12 | Schema validation |
| `use-debounce` | 10.0.6 | Debounce hook |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | 5.x | Type checking |
| `@types/node` | 20.x | Node.js types |
| `@types/react` | 19.x | React types |
| `@types/react-dom` | 19.x | React DOM types |
| `eslint` | 9.x | Linting |
| `eslint-config-next` | 16.0.3 | Next.js ESLint rules |

### Why These Dependencies?

**Core Stack**:
- Next.js 16: Latest features, App Router, Server Actions
- React 19: Concurrent features, improved performance
- TypeScript: Type safety, better DX

**Database**:
- Prisma: Type-safe queries, migrations, excellent Next.js integration
- PostgreSQL: Reliable, scalable, ACID-compliant

**Authentication**:
- NextAuth.js v5: Secure, flexible, supports multiple providers
- bcryptjs: Industry-standard password hashing

**Styling**:
- Tailwind CSS v4: JIT compilation, CSS-first config, excellent performance
- Framer Motion: Production-ready, declarative animations

**Utilities**:
- Zod: TypeScript-first validation with great error messages
- Lucide: Modern, consistent icon set

---

## Development Guidelines

### Code Style

**TypeScript**:
- Strict mode enabled
- Explicit return types on exported functions
- No `any` types (enforced by ESLint)

**Components**:
- Use Server Components by default
- Mark Client Components with `"use client"` when needed
- Props interface defined separately

**Naming Conventions**:
- Components: PascalCase (e.g., `Hero.tsx`)
- Utilities: camelCase (e.g., `cn.ts`)
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case (e.g., `blog-search.tsx`)

**Imports**:
- Use path aliases: `@/components`, `@/lib`
- Group imports: React, third-party, local
- Sort alphabetically within groups

### Performance Best Practices

**Images**:
- Use Next.js `<Image />` component when possible
- Optimize images before upload
- Use appropriate formats (WebP, AVIF)

**Fonts**:
- Use `next/font` for automatic optimization
- Preload critical fonts
- Use font-display: swap

**Data Fetching**:
- Use Server Components for database queries
- Implement caching with `revalidatePath()`
- Use `generateStaticParams` for dynamic routes

**Animations**:
- Use `will-change` sparingly
- Prefer `transform` and `opacity` (GPU accelerated)
- Disable animations for `prefers-reduced-motion`

### Accessibility

**Requirements**:
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Color contrast ratio ≥ 4.5:1

**Testing**:
- Use keyboard-only navigation
- Test with screen readers
- Validate with axe-core or Lighthouse

### Security

**Authentication**:
- Never store passwords in plain text
- Use CSRF protection (built into Server Actions)
- Implement rate limiting

**Input Validation**:
- Validate all user inputs with Zod
- Sanitize HTML content
- Escape output to prevent XSS

**Environment Variables**:
- Never commit `.env` files
- Use different secrets for dev/prod
- Rotate secrets periodically

### Git Workflow

**Commit Messages**:
```
feat: Add new feature
fix: Fix bug in component
docs: Update documentation
style: Format code
refactor: Restructure without changing behavior
test: Add tests
chore: Update dependencies
```

**Branching**:
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `fix/*`: Bug fixes

---

## License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2026 David Dew Mallick

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Support & Contact

**Developer**: David Dew Mallick

**Email**: david.dew.mallick@gmail.com

**GitHub**: [github.com/dew97-tech](https://github.com/dew97-tech)

**LinkedIn**: [linkedin.com/in/david-dew-mallick-618a6223b/](https://www.linkedin.com/in/david-dew-mallick-618a6223b/)

**Issues**: If you find any bugs or have feature requests, please open an issue on GitHub.

---

## Acknowledgments

- **Next.js Team** for the incredible framework
- **Vercel** for hosting and database services
- **Tailwind Labs** for Tailwind CSS
- **Framer** for the animation library
- **Prisma** for the excellent ORM
- **Auth.js** for authentication solutions

---

**Built with passion and lots of coffee** ☕
