# ADR-002: Database Provider — Neon

**Status:** ACCEPTED
**Date:** 2026-04-10
**Decider:** SoftwareArchitect

## Context

Both Neon and Supabase are available on the Vercel Marketplace and provide managed Postgres. The stack already decided on Drizzle ORM, which works with both.

- **Neon** — serverless Postgres-as-a-service, purpose-built for Vercel's Fluid Compute, database branching for preview environments
- **Supabase** — Postgres platform with built-in auth, storage, realtime subscriptions, REST/GraphQL auto-generated APIs

## Decision

**Use Neon.**

## Rationale

1. **Right-sized for the stack.** Supabase is a platform, not just a database. It bundles auth, storage, realtime, and auto-generated APIs. We are using Better Auth (ADR-001), have no immediate need for realtime subscriptions or auto-generated REST, and plan to control our API surface explicitly. Supabase's extras go unused and add operational surface.

2. **Serverless-first design matches Vercel Fluid Compute.** Neon's HTTP driver and connection pooler (Neon serverless driver) are specifically optimised for ephemeral serverless runtimes — the exact deployment model we are using. Cold-start connection overhead is eliminated.

3. **Database branching for preview deployments.** Neon creates instant database branches per branch/PR, mirroring Vercel's preview deployment model. Each PR gets an isolated database state without full data copies. This significantly improves integration testing and review quality.

4. **Drizzle-first workflow.** Neon + Drizzle is a well-documented, widely used combination with tooling (Drizzle Studio, `drizzle-kit push/generate/migrate`) that works seamlessly. No Supabase-specific migration tooling required.

5. **Cost.** Neon's free tier and scale-to-zero model keeps costs near-zero during early development. Supabase requires a paid plan for production branching and advanced features.

## Consequences

- `packages/db` uses Drizzle ORM with the Neon serverless adapter (`@neondatabase/serverless`).
- `.env` stores `DATABASE_URL` pointing to the Neon connection string; preview branches automatically get isolated `DATABASE_URL` values via Vercel Marketplace integration.
- Supabase is not provisioned; no Supabase SDK in the dependency tree.

## Alternatives Considered

### Supabase
- **Pro:** Feature-rich platform; realtime and storage available if needed later; strong open-source community.
- **Con:** Bundles auth/storage/realtime we don't need; migration tooling is more opinionated; branching requires higher-tier plan; connection model is less optimised for pure serverless.
- **Rejected because:** Neon is leaner, better matched to our serverless deployment target, and provides the database branching feature we need without paying for features we explicitly don't use.
