# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a production-ready full-stack application called "maskmail" built with Next.js 15 and Cloudflare's edge infrastructure. It features a modular architecture with D1 databases, R2 storage, and Better Auth for authentication.

## Development Commands

### Essential Development Setup
```bash
# Two-terminal setup (recommended for HMR)
pnpm run wrangler:dev    # Terminal 1: D1 database access
pnpm run dev            # Terminal 2: Next.js with HMR

# Single command development (no HMR)
pnpm run dev:cf

# Remote development with production resources
pnpm run dev:remote
```

### Database Operations
```bash
# Generate and apply migrations
pnpm run db:generate                    # Generate migration
pnpm run db:generate:named "name"       # Named migration
pnpm run db:migrate:local               # Apply to local D1
pnpm run db:migrate:preview             # Apply to preview D1
pnpm run db:migrate:prod                # Apply to production D1

# Database management
pnpm run db:studio                      # Drizzle Studio GUI
pnpm run db:studio:local                # Drizzle Studio with local config
pnpm run db:inspect:local               # List local tables
pnpm run db:inspect:preview             # List preview tables  
pnpm run db:inspect:prod                # List production tables
pnpm run db:reset:local                 # Reset local database

# Cloudflare secret management
pnpm run cf:secret                      # Add secrets to Cloudflare Workers
```

### Build and Deployment
```bash
# Build for Cloudflare Workers
pnpm run build:cf                       # Production build
pnpm run preview:cf                     # Preview build

# Deploy to environments
pnpm run deploy                         # Production deployment
pnpm run deploy:preview                 # Preview deployment
pnpm run deploy:cf                      # Alternative production deploy

# Type generation (required after wrangler.jsonc changes)
pnpm run cf-typegen                     # Generate Cloudflare types
```

### Code Quality
```bash
pnpm run lint                           # Format and lint code with Biome
```

### Development Order
1. **First-time setup**: `cf-typegen` → `db:migrate:local` → `build:cf`
2. **Daily development**: Two terminals with `wrangler:dev` and `dev`
3. **After schema changes**: `db:generate` → `db:migrate:local`
4. **After wrangler.jsonc changes**: `cf-typegen`

## Architecture Overview

### Modular Structure
The project uses a feature-based module architecture:
```
src/modules/
├── auth/                    # Authentication module
│   ├── actions/            # Server actions
│   ├── components/         # UI components
│   ├── models/             # TypeScript types
│   ├── schemas/            # Database schemas
│   └── utils/              # Auth utilities
├── todos/                  # Todo management module
│   ├── actions/            # Server actions
│   ├── components/         # UI components
│   ├── models/             # TypeScript types
│   ├── schemas/            # Database schemas
│   └── utils/              # Todo utilities
└── dashboard/              # Dashboard module
```

### Key Architectural Patterns
- **Server Actions**: Modern data mutations with automatic revalidation
- **React Server Components**: Optimal performance with server-side rendering
- **Type Safety**: End-to-end TypeScript from database to UI
- **Module Isolation**: Each feature module is self-contained

### Data Flow
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Authentication**: Better Auth with Google OAuth
- **Storage**: Cloudflare R2 for object storage
- **Caching**: Next.js built-in caching + Cloudflare edge caching

## Environment Configuration

### Required Environment Variables (.dev.vars)
```bash
# Cloudflare Configuration
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_D1_TOKEN=your-api-token
CLOUDFLARE_R2_URL=your-r2-url

# Authentication
BETTER_AUTH_SECRET=your-random-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Cloudflare Resources (wrangler.jsonc)
- **D1 Database**: `maskmail_db` (binding name)
- **R2 Bucket**: `maskmail_bucket` (binding name)
- **Compatibility Flags**: `nodejs_compat`, `global_fetch_strictly_public`

## Cloudflare Integration

### @opennextjs/cloudflare Usage
The project uses the OpenNext.js adapter for Cloudflare Workers. Key patterns:
- `getCloudflareContext()` for accessing Cloudflare bindings
- Dynamic auth instance creation to avoid top-level async issues
- Environment-specific configuration for dev/prod

### Development Environment Notes
- **Local development**: Requires Wrangler running for D1 access
- **Environment variables**: Use `.dev.vars` for local development
- **Production secrets**: Use Cloudflare Workers Secrets

## Authentication System

### Better Auth Configuration
- Supports email/password and Google OAuth
- Uses `nextCookies()` plugin for Next.js integration
- Session management with secure cookies
- Social login with proper redirect URIs

### Authentication Patterns
```typescript
// Server-side auth check
export async function requireAuth(): Promise<AuthUser> {
    const user = await getCurrentUser();
    if (!user) throw new Error("Authentication required");
    return user;
}

// Client-side auth actions
export const authClient = createAuthClient({
    baseURL: process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : window.location.origin
});
```

### Auth Utilities
- `getCurrentUser()`: Get authenticated user or null
- `requireAuth()`: Get user or throw error
- `isAuthenticated()`: Check if user is authenticated
- `getSession()`: Get session information

## Database Schema Management

### Drizzle ORM Patterns
- Schema definitions in `src/modules/*/schemas/`
- Type-safe queries with full TypeScript support
- Migration files in `src/drizzle/`
- Use `drizzle-zod` for form validation schemas

### Common Database Operations
```typescript
// Get database connection
export async function getDb() {
    const { env } = await getCloudflareContext();
    return drizzle(env.maskmail_db, { schema });
}

// Type-safe inserts/updates
await db.insert(todos).values(todoData).returning();
```

## Database Binding Names

**Important**: The current configuration uses:
- Database binding: `maskmail_db` (not `next_cf_app`)
- R2 bucket binding: `maskmail_bucket` (not `next_cf_app_bucket`)

When working with Cloudflare bindings, use the correct names:
```typescript
// Database access
const db = drizzle(env.maskmail_db, { schema });

// R2 storage access
const result = await env.maskmail_bucket.put(key, data);
```

## Project-Specific Patterns

### R2 File Upload
The project includes R2 storage functionality in `src/lib/r2.ts`:
- Upload files with metadata
- Generate public URLs
- Handle file retrieval

### Todo Management
- Categories with color coding
- Priority levels and status tracking
- Image attachments support
- Due date management

### Dashboard Layout
- Authentication-protected routes
- User-specific data filtering
- Responsive design patterns

### Utilities
- `cn()`: Class name merging utility from `src/lib/utils.ts`
- Biome configuration for code formatting
- Drizzle configuration for database management

## Common Issues and Solutions

### Development Environment Issues
- **"Cannot read properties of undefined (reading 'call')"**: This occurs when `getCloudflareContext()` can't access Cloudflare bindings. Solution: Run `pnpm run wrangler:dev` in a separate terminal before `pnpm run dev`.

### Database Migration Issues
- **Migration conflicts**: Use `pnpm run db:reset:local` to reset local database
- **Type errors after schema changes**: Run `pnpm run cf-typegen` to regenerate types

### Authentication Issues
- **Google OAuth not working**: Verify redirect URIs in Google Cloud Console
- **Session issues**: Check `BETTER_AUTH_SECRET` is properly set

## Deployment

### GitHub Actions Configuration
The project includes automated CI/CD with:
- Preview deployments for PRs
- Production deployments on main branch
- Database migrations and backups
- Health checks and failure notifications

### Environment-specific URLs
- **Preview**: `maskmail-preview.effendi-official.workers.dev`
- **Production**: `maskmail.cc`

### Database Scripts
All database scripts use the correct database name `maskmail-db`:
- Local development: `maskmail-db --local`
- Preview environment: `maskmail-db --env preview`
- Production: `maskmail-db --remote`