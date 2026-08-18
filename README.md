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
- [Deployment](#deployment)
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

| Command             | Description                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| `pnpm dev`          | Start both the backend and frontend together                                                     |
| `pnpm dev:api`      | Start only the backend on `http://localhost:4000`                                                |
| `pnpm dev:web`      | Start only the frontend on `http://localhost:5173`                                               |
| `pnpm lint`         | Lint all packages                                                                                |
| `pnpm typecheck`    | Typecheck all packages                                                                           |
| `pnpm test`         | Run all tests                                                                                    |
| `pnpm format`       | Format all files with Prettier                                                                   |
| `pnpm format:check` | Check formatting without writing (used in CI)                                                    |
| `pnpm build`        | Production build of shared, api, and web                                                         |
| `pnpm lighthouse`   | Build, serve the production build, and run a Lighthouse audit against it                         |
| `pnpm fallow`       | Full static-analysis pipeline (dead code, duplication, health) over the whole repo               |
| `pnpm fallow:audit` | Gated check: fails only on issues introduced by files changed vs. the base branch (what CI runs) |

CI (`.github/workflows/ci.yml`) runs `format:check`, `lint`, `fallow:audit`, `typecheck`, `test`, and `build` on every push and pull request.

`pnpm lighthouse` builds `apps/web`, serves the build with `vite preview`, runs [Lighthouse](https://developer.chrome.com/docs/lighthouse) against it headlessly, and writes `apps/web/lighthouse-report.html` (gitignored — open it in a browser to view). It audits performance, accessibility, best practices, and SEO against the production build, not the dev server. You may see a stray `ELIFECYCLE Command failed` line at the end of the output — that's just the preview server being killed once the audit finishes, not an actual failure; check the script's exit code or the generated report, not that line.

[Fallow](https://github.com/fallow-rs/fallow) is static codebase analysis — unused exports/files, circular dependencies, duplicated code, complexity hotspots, and CSS drift. `pnpm fallow:audit` is scoped to changed files and only fails on findings a change _introduces_, so pre-existing issues elsewhere in the codebase don't block unrelated PRs (run it with `--gate all` to enforce everything in changed files, or `pnpm fallow` for the unscoped, whole-repo view). Configured at [.fallowrc.json](.fallowrc.json); currently running on its defaults — cleanup-rule findings (unused dev deps, component-level dead code, styling drift) stay advisory rather than failing CI.

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

| Method | Path                 | Description                                                                             |
| ------ | -------------------- | --------------------------------------------------------------------------------------- |
| `GET`  | `/stays`             | List/search stays (`location`, `guests`, `minPrice`, `maxPrice`, `checkIn`, `checkOut`) |
| `GET`  | `/stays/:id`         | Stay details                                                                            |
| `GET`  | `/stays/:id/reviews` | Reviews for a stay                                                                      |
| `POST` | `/stays/:id/reviews` | Add a review                                                                            |
| `POST` | `/bookings`          | Create a booking (checkout)                                                             |
| `GET`  | `/bookings/:id`      | Booking confirmation                                                                    |

Data is seeded in-memory (`apps/api/src/data/seed.ts`) — no database. Request/response bodies are validated with the Zod schemas in `packages/shared`; invalid input returns `400` with the Zod issue list, unknown resources return `404`.

## Testing

- **Backend** (`apps/api`): route-level tests with Vitest + Supertest, covering the happy path, validation failures (400), and not-found cases (404) for stays, reviews, and bookings.
- **Frontend** (`apps/web`): component tests with Vitest + React Testing Library.

Run everything with `pnpm test`, or scope to one app with `pnpm --filter @lodgical/web test` / `pnpm --filter @lodgical/api test`.

## Deployment

The repository is configured for a single-site Netlify deployment. Netlify
builds the workspace with `pnpm build`, publishes `apps/web/dist`, serves the
Express API through a function at `/api/*`, and rewrites client-side routes to
the Vite entrypoint.

To deploy from the Netlify UI, import the GitHub repository and leave the build
settings on **Use configuration from netlify.toml**. The production frontend
defaults to the same-origin `/api` endpoint; `VITE_API_URL` can still override
that when deploying the API separately.

The API intentionally uses in-memory data for this assessment. On Netlify,
function instances are ephemeral, so newly added reviews and bookings are not
durable and may not be available to a later function invocation. Use a
persistent database before treating the deployment as production-ready.

## Architecture decisions

- **pnpm workspace monorepo** over separate repos — one CI run, one PR history, and a shared types package instead of duplicated `Stay`/`Review`/`Booking` shapes.
- **Plain CSS via CSS Modules** instead of a utility framework — component-scoped styling with no additional build tooling.
- **In-memory mocked data** on the backend rather than a real database — appropriate for the timeboxed scope; the requirements explicitly allow this.
- **TanStack Query** for server state — loading/error/empty states come largely for free, which the brief calls out as a requirement.
- **Zod schemas in `packages/shared`** validate both the API's request bodies and the frontend's forms from one source of truth, so the two layers can't drift apart.
- **Express** over a heavier framework — minimal ceremony for a handful of routes.
- **[Fallow](https://github.com/fallow-rs/fallow) as a changed-file quality gate** alongside ESLint/Prettier — ESLint catches per-file correctness issues, Fallow catches cross-file ones (dead exports, circular deps, duplication, complexity) that a linter can't see. Scoped to changed files in CI so it grades this PR, not the whole codebase's pre-existing state.
- **Design tokens adopted from a Google Stitch mockup** ("Global Horizon": Trust Blue `#003580` nav/brand, Action Blue `#006CE4` secondary actions, Attention Yellow `#FFB700` reserved for primary CTAs, Inter via `@fontsource` self-hosted rather than a Google Fonts runtime link) — applied as CSS custom properties in `index.css`, which is a pure drop-in for the existing CSS Modules convention. Only the checkout page's layout was restructured to match the mockup (two-column, sticky summary card, mocked payment section); no other new screens or navigation changes were invented beyond what the one available mockup screen actually showed.
- **Date availability as an end-to-end search concern** — the search page uses one accessible range-calendar interaction, stores the range in the URL, carries it through stay details into checkout, and sends it to the API. The API treats stays as half-open date intervals (`checkIn` inclusive, `checkOut` exclusive), so a new guest may check in on the previous guest's checkout date while true overlaps are filtered and rejected.

## Tradeoffs

- No persistence across server restarts (in-memory store) — a real database was out of scope for the timebox.
- No authentication — bookings aren't tied to a user account.
- Availability is enforced against confirmed in-memory bookings, but the mock store has no database transaction or cross-process lock; a production implementation would enforce the same rule atomically in persistent storage.
- Search is a simple substring/threshold filter, not full-text or fuzzy search.
- No image upload — stay photos are static seed data.

## What I'd build next

- Exposing unavailable days directly in the calendar after selecting a particular stay; search currently validates the complete range through the API.
- User accounts/auth, so a "My bookings" view is possible.
- Pagination or infinite scroll on the search results.
- A more capable search with user-facing price filters and fuzzy location matching.
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
