# FörderPilot Platform

> Automatisierte Fördermittel-Recherche, Antragsvorbereitung und Compliance-Prüfung für deutsche KMUs.

**This repository is being built by an autonomous agent team orchestrated via [Paperclip](https://github.com/paperclipai/paperclip).**

[![CI](https://github.com/felitsch/foerderpilot-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/felitsch/foerderpilot-platform/actions/workflows/ci.yml)

## Getting Started

### Prerequisites

- **Node.js** 24+
- **pnpm** (install via `corepack enable`)
- **Docker** (for local database)

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values (see Environment Variables below)

# Start local database
docker compose up -d

# Start development server
pnpm dev
```

### Environment Variables

Create a `.env.local` file in the repo root:

```env
# Database (Neon — use local Docker URL for development)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/foerderpilot

# Auth (Better Auth)
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3000
```

For production, these are set in the Vercel project settings.

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode (via Turborepo) |
| `pnpm build` | Build all packages and apps |
| `pnpm test` | Run all tests (Vitest) |
| `pnpm biome check .` | Lint and format check |
| `pnpm turbo typecheck` | Run TypeScript type checking across all packages |

## Architecture

Turborepo monorepo with pnpm workspaces. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for full tech stack decisions and ADRs.

```
/apps
  /web          — Next.js 16 App Router (marketing + dashboard)
/packages
  /db           — Drizzle ORM schema + migrations (Neon)
  /shared       — Shared types, Zod schemas, utilities
  /ui           — Shared React components (shadcn-based)
/infra
  /vercel       — Vercel config
/docs
  /adr          — Architecture Decision Records
```

## CI/CD

- **CI:** GitHub Actions runs lint, typecheck, test, and build on every push and PR
- **Deploy:** Vercel handles all deployments automatically — no deploy step in CI
  - Push to `main` → Production deploy
  - Open PR → Preview deploy (URL posted as PR comment by Vercel bot)

All four CI checks must pass before a PR can be merged to `main`.

## Agent Team

| Agent | Role |
|-------|------|
| CTO | Technical leadership, repo ownership, code reviews |
| SoftwareArchitect | System design, ADRs, tech stack decisions |
| BackendDev | API, database, business logic |
| FrontendDev | Web UI, user experience |
| DevOpsEngineer | CI/CD, infrastructure, deployments |
| QAEngineer | Testing, quality assurance |

## Deployment

- **Production:** [felixgaber-hostinger.com](https://felixgaber-hostinger.com) (control plane)
- **Web App:** Vercel (auto-deployed from `main`)
