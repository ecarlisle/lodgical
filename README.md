# Lodgical

A small travel booking app inspired by Booking.com: search stays, view details and reviews, and complete a mocked checkout that produces a confirmed booking.

## Table of contents

- [Requirements](#requirements)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [API](#api)
- [Testing](#testing)
- [Architecture decisions](#architecture-decisions)
- [Tradeoffs](#tradeoffs)
- [What I'd build next](#what-id-build-next)
- [Use of AI/LLMs](#use-of-aillms)
- [Screen recording](#screen-recording)

## Requirements

See [docs/requirements.md](docs/requirements.md) for the assessment brief this project was built against, and [docs/REQUIREMENTS_CHECKLIST.md](docs/REQUIREMENTS_CHECKLIST.md) for a live-tracked mapping of each requirement to where it's implemented and how it's verified.

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 10+ (`corepack enable` will pick up the version pinned in `package.json`)

## Setup

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

Then start both apps:

```bash
pnpm dev
```

This runs the frontend and backend together (via `concurrently`), prefixed `[api]`/`[web]` in the output. To run just one, use `pnpm dev:api` or `pnpm dev:web` instead.

Open `http://localhost:5173` and search, view a stay, leave a review, and complete a checkout.

## Scripts

Run from the repo root:

| Command             | Description                                        |
| ------------------- | -------------------------------------------------- |
| `pnpm dev`          | Start both the backend and frontend together       |
| `pnpm dev:api`      | Start only the backend on `http://localhost:4000`  |
| `pnpm dev:web`      | Start only the frontend on `http://localhost:5173` |
| `pnpm lint`         | Lint all packages                                  |
| `pnpm typecheck`    | Typecheck all packages                             |
| `pnpm test`         | Run all tests                                      |
| `pnpm format`       | Format all files with Prettier                     |
| `pnpm format:check` | Check formatting without writing (used in CI)      |
| `pnpm build`        | Production build of shared, api, and web           |

CI (`.github/workflows/ci.yml`) runs `format:check`, `lint`, `typecheck`, `test`, and `build` on every push and pull request.

## Project structure

pnpm workspace monorepo:

```
apps/
  web/       React + TypeScript frontend (Vite)
  api/       Express + TypeScript backend (in-memory mocked data)
packages/
  shared/    Types and Zod schemas shared by both apps
```

`apps/web` and `apps/api` both depend on `packages/shared` so request/response shapes and validation stay in sync between frontend and backend.

## API

| Method | Path                 | Description                                                      |
| ------ | -------------------- | ---------------------------------------------------------------- |
| `GET`  | `/stays`             | List/search stays (`location`, `guests`, `minPrice`, `maxPrice`) |
| `GET`  | `/stays/:id`         | Stay details                                                     |
| `GET`  | `/stays/:id/reviews` | Reviews for a stay                                               |
| `POST` | `/stays/:id/reviews` | Add a review                                                     |
| `POST` | `/bookings`          | Create a booking (checkout)                                      |
| `GET`  | `/bookings/:id`      | Booking confirmation                                             |

Data is seeded in-memory (`apps/api/src/data/seed.ts`) — no database. Request/response bodies are validated with the Zod schemas in `packages/shared`; invalid input returns `400` with the Zod issue list, unknown resources return `404`.

## Testing

- **Backend** (`apps/api`): route-level tests with Vitest + Supertest, covering the happy path, validation failures (400), and not-found cases (404) for stays, reviews, and bookings.
- **Frontend** (`apps/web`): component tests with Vitest + React Testing Library.

Run everything with `pnpm test`, or scope to one app with `pnpm --filter @lodgical/web test` / `pnpm --filter @lodgical/api test`.

## Architecture decisions

- **pnpm workspace monorepo** over separate repos — one CI run, one PR history, and a shared types package instead of duplicated `Stay`/`Review`/`Booking` shapes.
- **Plain CSS via CSS Modules** instead of a utility framework — component-scoped styling with no additional build tooling.
- **In-memory mocked data** on the backend rather than a real database — appropriate for the timeboxed scope; the requirements explicitly allow this.
- **TanStack Query** for server state — loading/error/empty states come largely for free, which the brief calls out as a requirement.
- **Zod schemas in `packages/shared`** validate both the API's request bodies and the frontend's forms from one source of truth, so the two layers can't drift apart.
- **Express** over a heavier framework — minimal ceremony for a handful of routes.

## Tradeoffs

- No persistence across server restarts (in-memory store) — a real database was out of scope for the timebox.
- No authentication — bookings aren't tied to a user account.
- No date-range availability conflicts are checked against existing bookings (a stay can be "double-booked").
- Search is a simple substring/threshold filter, not full-text or fuzzy search.
- No image upload — stay photos are static seed data.

## What I'd build next

- Availability checking against existing bookings, and blocking already-booked date ranges in the UI.
- User accounts/auth, so a "My bookings" view is possible.
- Pagination or infinite scroll on the search results.
- A more capable search (price range and date pickers wired into the query, not just location/guests).
- Persisting data to a real database (e.g. SQLite via Prisma) instead of the in-memory store.
- Deployment (e.g. Vercel for the frontend, Render for the API) and basic request logging/observability.

## Use of AI/LLMs

This project was built with [Claude Code](https://claude.com/claude-code) (Anthropic's AI coding agent) doing the majority of the implementation, directed and reviewed at each step:

- I gave it the assessment brief and asked it to propose a project structure and dependency choices before writing any code; I reviewed that proposal and made the one substantive change (plain CSS instead of Tailwind) before it scaffolded anything.
- From there it generated the workspace config, both apps, the shared types/schemas package, tests, and the CI workflow.
- As a guardrail, I had it verify its own output rather than just asserting success: running lint/typecheck/tests/build after every meaningful change, and driving the app in an actual browser through the full search → detail → checkout → confirmation flow to confirm it worked end to end, not just that it compiled.
- That verification step caught a real bug it introduced (the backend build was compiling test files into `dist/`, which vitest then also picked up, silently doubling the test count) — it diagnosed and fixed it, and I confirmed the fix by re-running the full check suite.
- All changes were committed in small, reviewable chunks with descriptive commit messages rather than one large diff, so the git history reflects the actual sequence of decisions.

## Screen recording

_A 5–10 minute walkthrough of the solution, key decisions, and anything worth noting during review will be linked here._
