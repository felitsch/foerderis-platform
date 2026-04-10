# Architecture Decision: Initial Tech Stack

**Status:** ACCEPTED
**Author:** Deployment bootstrap
**Reviewed by:** SoftwareArchitect (Paperclip Agent)
**Date:** 2026-04-10

## Context

FörderPilot is a B2B SaaS for German SMEs to automate grant/subsidy research and applications. The platform needs:
- Public marketing site
- Authenticated customer dashboard
- Agent-facing APIs for the Paperclip backend team
- Document generation (PDF/DOCX)
- Robust data pipelines (grant databases, company profiles)

## Accepted Architecture

### Monorepo
- **pnpm workspaces + Turborepo** — standard, fast, well-supported
- Structure:
  ```
  /apps
    /web          — Next.js 16 App Router (marketing + dashboard)
  /packages
    /db           — Drizzle ORM schema + migrations
    /shared       — Shared types, Zod schemas, utilities
    /ui           — Shared React components (shadcn-based)
  /infra
    /vercel       — Vercel config
    /github       — GitHub Actions workflows
  ```

### Core Stack
- **Framework:** Next.js 16 (App Router, Server Components, Server Actions)
- **UI:** Tailwind CSS 4 + shadcn/ui + Radix primitives
- **Database:** Neon (Vercel Marketplace) + Drizzle ORM ✅ Decision documented in `docs/adr/002-database-neon.md`
- **Auth:** Better Auth (self-hosted) ✅ Decision documented in `docs/adr/001-auth-better-auth.md`
- **API Layer:** Next.js Route Handlers with Zod validation ✅ Decision documented in `docs/adr/003-api-layer-route-handlers.md`
- **Background Jobs:** Vercel Workflow (durable), or Upstash QStash
- **Deployment:** Vercel (auto-deploy from main, previews on PRs)
- **Runtime:** Node.js 24 / Fluid Compute (default)

### Tooling
- **Package manager:** pnpm (matches Paperclip)
- **Build:** Turborepo
- **Lint:** Biome (faster than eslint+prettier, single config)
- **Tests:**
  - Unit/integration: Vitest
  - E2E: Playwright
- **Types:** TypeScript strict everywhere
- **Commits:** Conventional Commits in imperative form
- **CI:** GitHub Actions (lint, typecheck, test, build)

### Why these choices
- **Next.js 16 + Vercel:** Best-in-class DX, zero-config deploys, Fluid Compute eliminates cold starts, native Marketplace integrations
- **Drizzle:** Type-safe, schema-first, works great with Server Components
- **shadcn:** Copy-paste components, no lock-in, consistent with Paperclip's approach
- **Biome:** Single tool, 10x faster than eslint/prettier, fewer configs
- **Turborepo:** Incremental builds, remote caching on Vercel

## Non-goals for v0
- Mobile apps (web-first, mobile-responsive)
- Multi-tenancy complexity (single-tenant first, extract later)
- Self-hosting alternative (Vercel-only for v0)

## Architecture Decisions (Open Questions Resolved)

All three open questions have been resolved and documented as ADRs in `docs/adr/`:

| # | Question | Decision | ADR |
|---|----------|----------|-----|
| 1 | Auth provider | **Better Auth** | [ADR-001](adr/001-auth-better-auth.md) |
| 2 | Database provider | **Neon** | [ADR-002](adr/002-database-neon.md) |
| 3 | API layer | **Next.js Route Handlers** | [ADR-003](adr/003-api-layer-route-handlers.md) |
