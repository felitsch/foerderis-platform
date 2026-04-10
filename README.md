# Foerderis

> KI-gestützte Fördermittelberatung für den deutschen Mittelstand.
> Erfolgshonorar statt Abo — nur bezahlt, wenn die Förderung bewilligt wird.

**Dieses Repository wird von einem autonomen KI-Agent-Team gebaut, orchestriert durch [Paperclip](https://github.com/paperclipai/paperclip).**

[![CI](https://github.com/felitsch/foerderis-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/felitsch/foerderis-platform/actions/workflows/ci.yml)
[![Vercel](https://img.shields.io/github/deployments/felitsch/foerderis-platform/production?label=vercel&logo=vercel&logoColor=white)](https://vercel.com/felitsch/foerderis-platform)

## Was ist Foerderis?

Eine Fördermittelberatung, die komplett erfolgsbasiert arbeitet. Unser KI-Team scannt rund um die Uhr deutsche und europäische Förderprogramme, findet passende Chancen, entwirft Anträge, überwacht Fristen und erstellt revisionssichere Dokumentation.

- **10 % der bewilligten Fördersumme** — keine Einrichtungsgebühr, kein Abo, kein Retainer
- **Zahlung erst, wenn das Geld beim Kunden angekommen ist**
- **Zielkunden:** deutscher Mittelstand, 10–250 Mitarbeiter, 2–50 Mio. € Umsatz

Positionierung, Voice, Zielkunde: [`docs/BRAND.md`](./docs/BRAND.md)
Technik-Stack: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)

## Getting Started

### Voraussetzungen

- **Node.js** 24+
- **pnpm** (via `corepack enable`)
- **Docker** (für die lokale Datenbank)

### Setup

```bash
# Abhängigkeiten installieren
pnpm install

# Environment-Datei kopieren
cp .env.example .env.local
# .env.local mit eigenen Werten füllen (siehe unten)

# Lokale Datenbank starten
docker compose up -d

# Dev-Server starten
pnpm dev
```

### Environment-Variablen

Eine `.env.local` im Repo-Root anlegen:

```env
# Database (Neon — lokal via Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/foerderis

# Auth (Better Auth)
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3000

# Resend — ausgehende E-Mails (Waitlist-Confirmation + Internal Alerts)
# Kostenlos bis 3.000 Mails/Monat — https://resend.com
# Domain foerderis.de muss via SPF/DKIM/Return-Path in Hostinger-DNS verifiziert sein
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx

# Interne Benachrichtigungs-E-Mail (Default: felix@foerderis.de)
NOTIFICATION_EMAIL=felix@foerderis.de

# Paperclip — Lead-Task-Erstellung bei Waitlist-Eintrag
PAPERCLIP_API_URL=https://felixgaber-hostinger.com/api
PAPERCLIP_COMPANY_ID=a2365516-5c35-4933-86fe-5f03c609e570
PAPERCLIP_CEO_AGENT_ID=a396757c-4fbe-49f7-8cfb-49050d72f356
# System-Token: im Paperclip-Dashboard unter API Keys erstellen (nicht ins Repo committen)
PAPERCLIP_SYSTEM_TOKEN=pc_sys_xxxxxxxxxxxxxxxx
```

Für Produktion werden die Werte im Vercel-Projekt gesetzt.

> **Hinweis Resend-DNS:** Für `kontakt@foerderis.de` als Absender müssen in der Hostinger-DNS
> folgende Records gesetzt sein (Werte aus dem Resend-Dashboard):
> - `SPF` (TXT auf `foerderis.de`)
> - `DKIM` (TXT auf `resend._domainkey.foerderis.de`)
> - `Return-Path` (CNAME auf `bounces.resend.com`)
>
> **Hinweis PAPERCLIP_SYSTEM_TOKEN:** Diesen Token im Paperclip-Dashboard als Service-Account-Token erstellen.
> Er darf ausschließlich im Vercel-Projekt gesetzt werden — niemals ins Git-Repository.

### Verfügbare Scripts

| Befehl | Beschreibung |
|--------|--------------|
| `pnpm dev` | Startet alle Apps im Dev-Modus (via Turborepo) |
| `pnpm build` | Baut alle Packages und Apps |
| `pnpm test` | Führt alle Tests aus (Vitest) |
| `pnpm biome check .` | Lint- und Format-Check |
| `pnpm turbo typecheck` | TypeScript-Typprüfung über alle Packages |

## Architektur

Turborepo-Monorepo mit pnpm-Workspaces. Volle Tech-Stack-Entscheidungen und ADRs in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

```
/apps
  /web          — Next.js 16 App Router (Marketing + Dashboard)
/packages
  /db           — Drizzle ORM Schema + Migrations (Neon)
  /shared       — Gemeinsame Types, Zod-Schemas, Utilities
  /ui           — Shared React Components (shadcn-basiert)
/infra
  /vercel       — Vercel-Konfiguration
/docs
  /adr          — Architecture Decision Records
```

## CI/CD

- **CI:** GitHub Actions — Lint, Typecheck, Test und Build bei jedem Push und jedem PR
- **Deploy:** Vercel kümmert sich automatisch um Deployments — kein Deploy-Step in der CI
  - Push auf `main` → Production-Deploy
  - Neuer PR → Preview-Deploy (URL wird von Vercel als PR-Kommentar gepostet)

Alle vier CI-Checks müssen grün sein, bevor ein PR gemergt werden kann.

## Contributing

### Branch Naming

```
{prefix}-{issue-number}/{kebab-description}

Examples:
  frdaa-16/branch-protection
  frdaa-23/add-auth-middleware
```

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short description> [ISSUE-ID]

Types: feat, fix, docs, chore, refactor, test, ci, perf, build
```

Examples:

```
feat(auth): add Better Auth session handler [FRDAA-20]
fix(db): correct Drizzle migration order [FRDAA-22]
ci: update Node version in workflow [FRDAA-14]
```

- Commits must be in **English**
- UI-facing copy must be in **German** (target audience: German SMEs)
- One PR per issue — never commit directly to `main`
- All 4 CI checks (lint, typecheck, test, build) must pass before review
- At least 1 CTO approval required before merge
- Branch must be up to date with `main` before merge

## Das Agent-Team

### Engineering (baut die Plattform)

| Agent | Rolle |
|-------|-------|
| CTO | Technische Leitung, Repository-Verantwortung, Code Reviews |
| SoftwareArchitect | System-Design, ADRs, Tech-Stack-Entscheidungen |
| BackendDev | API, Datenbank, Business-Logik |
| FrontendDev | Web-UI, User Experience |
| DevOpsEngineer | CI/CD, Infrastruktur, Deployments |
| QAEngineer | Tests, Qualitätssicherung |

### Business (betreibt die Beratung)

| Agent | Rolle |
|-------|-------|
| CEO | Strategie, Delegation, Priorisierung |
| FörderScout | Scannt Förderprogramme rund um die Uhr |
| AntragsManager | Führt Kunden durch Antragsprozesse, überwacht Fristen |
| DatenSammler | Extrahiert und strukturiert Unternehmensdaten |
| ComplianceChecker | Revisionssichere Prüfung jedes Antrags |

## Deployment

- **Kontrollebene (Paperclip):** [felixgaber-hostinger.com](https://felixgaber-hostinger.com)
- **Webanwendung:** Vercel — automatischer Deploy bei jedem Push auf `main`
- **Produktion:** [foerderis.de](https://foerderis.de) *(Domain-Registrierung ausstehend)*
