# ADR-001: Auth Provider — Better Auth

**Status:** ACCEPTED
**Date:** 2026-04-10
**Decider:** SoftwareArchitect

## Context

Two authentication options were on the table for FörderPilot:

- **Clerk** — Vercel Marketplace native, managed SaaS, excellent DX out of the box, per-MAU pricing
- **Better Auth** — open-source, self-hosted, already running in Paperclip's production stack

## Decision

**Use Better Auth.**

## Rationale

1. **Existing expertise and production parity.** Better Auth is already running in Paperclip. The engineering team has first-hand knowledge of its configuration, edge cases, and operational behaviour. Reusing it eliminates a ramp-up period and an unknown support surface.

2. **Cost at scale.** Clerk charges per monthly active user. For a B2B platform targeting German SMEs — where enterprise customers can have dozens of employee seats — MAU pricing becomes expensive quickly. Better Auth has no per-user fee beyond hosting.

3. **No additional vendor lock-in.** We are already Vercel-dependent for deployment and compute. Adding a mandatory Clerk dependency for auth increases lock-in without a countervailing benefit that Better Auth cannot provide.

4. **Feature parity.** Better Auth supports all required features: email/password, OAuth providers, session management, role-based access, and multi-tenant organization primitives — sufficient for v0 and beyond.

5. **Vercel Marketplace availability is not a deciding factor.** Clerk's Marketplace listing simplifies initial provisioning but does not meaningfully reduce ongoing operational cost or complexity for a team already managing Better Auth.

## Consequences

- `packages/db` will include Better Auth schema tables alongside Drizzle migrations.
- Auth configuration lives in `apps/web` (Next.js plugin / middleware) and reuses patterns from Paperclip.
- No Clerk account or API keys required; no per-MAU billing.
- Self-hosted auth requires the team to handle security patches for Better Auth packages — acceptable given existing practice.

## Alternatives Considered

### Clerk
- **Pro:** Zero-config Vercel integration, hosted UI components, great DX for greenfield projects.
- **Con:** MAU-based pricing escalates with enterprise customers; adds a new vendor dependency; team has no existing production experience with it.
- **Rejected because:** cost risk at scale outweighs DX advantage, and Better Auth already satisfies all requirements.
