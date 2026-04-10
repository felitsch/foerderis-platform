# ADR-003: API Layer — Next.js Route Handlers

**Status:** ACCEPTED
**Date:** 2026-04-10
**Decider:** SoftwareArchitect

## Context

Two options were proposed for the agent-facing API surface:

- **Separate `/api` app using Hono** — a lightweight TypeScript HTTP framework, deployed as a distinct Vercel project or serverless function group
- **Next.js Route Handlers** — API routes co-located in `apps/web` under `app/api/`, using Next.js's built-in handler conventions

## Decision

**Use Next.js Route Handlers (co-located in `apps/web`).**

## Rationale

1. **Unnecessary complexity at v0.** A separate Hono app introduces a second deployment unit, second set of environment variables, potential CORS surface, and monorepo plumbing (separate `apps/api` workspace, distinct Vercel project, independent CI steps). For a v0 product with a small team, that overhead is not justified.

2. **Feature parity for current requirements.** Next.js Route Handlers with Zod validation satisfy all current API requirements: typed request/response, middleware via `middleware.ts`, streaming support (via Response streaming), and Vercel-native deployment. There is no feature gap that Hono fills for us today.

3. **Shared code within one deployment.** Route Handlers live in the same Next.js app and can import `packages/db`, `packages/shared`, and server-only utilities without network hops or serialisation overhead. A separate Hono app would require explicit package exports and inter-service calls or a shared monorepo build.

4. **TypeScript DX is comparable.** Modern Next.js Route Handlers with `next-safe-action` or plain Zod parsing provide typed APIs. Hono's `hono/zod-validator` is excellent but not a decisive advantage given we're already in a Next.js monorepo.

5. **Extraction path is clear.** If the agent-facing API needs independent scaling, rate limiting, or a separate deployment in the future, extracting it to a standalone Hono app is straightforward — the Route Handler logic maps 1:1. The decision is reversible; the cost of waiting is low.

## Consequences

- `apps/web/app/api/` contains all agent-facing endpoints as Route Handlers.
- Zod schemas for request/response validation live in `packages/shared` and are imported by both Route Handlers and agent client code.
- No `apps/api` workspace is scaffolded for v0. The monorepo structure drops the `/api` app directory.
- If traffic patterns or isolation requirements change post-v0, an `apps/api` Hono workspace can be introduced without changing the API contract (same paths, same Zod schemas).

## Alternatives Considered

### Separate Hono app (`apps/api`)
- **Pro:** Framework purpose-built for APIs; RPC-style type safety (`hono/client`); independent scaling; cleaner separation of concerns for large teams.
- **Con:** Separate deployment, extra Vercel project, CORS configuration, monorepo coordination overhead; no feature we need today that Route Handlers can't provide.
- **Rejected because:** Premature separation at v0 stage adds cost without benefit. Revisit if the API surface grows significantly or team size requires hard boundaries.
