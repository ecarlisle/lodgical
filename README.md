# Lodgical

A focused travel-booking experience built for the frontend assessment: search
available stays, review property details and guest feedback, and complete a
mocked checkout that creates a confirmed booking.

## Reviewer quick links

- [Live application](https://lodgical.netlify.app/)
- [Assessment requirements](docs/requirements.md)
- [Requirement-by-requirement evidence](docs/REQUIREMENTS_CHECKLIST.md)
- [GitHub Actions](https://github.com/ecarlisle/lodgical/actions)
- [Screen recording](#screen-recording)

## Product scope

The implementation prioritizes one coherent guest journey within the
assessment timebox:

1. Search by destination, dates, guests, and nightly price.
2. Compare pricing, capacity, ratings, reviews, and availability.
3. Explore a stay through an accessible photo gallery, details, and reviews.
4. Add a review or continue to checkout.
5. Submit a mocked payment form and receive a refresh-safe confirmation.

The UI includes responsive layouts, explicit loading/empty/error states,
visible keyboard focus, and keyboard-operable gallery controls. Accounts,
saved stays, host tools, maps, and real payments were intentionally excluded so
the required booking journey could receive more attention.

## Setup

Requires Node.js 20+ and pnpm 10+.

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
pnpm dev
```

Open `http://localhost:5173`. The Express API runs on
`http://localhost:4000`.

## Scripts

Run from the repository root:

| Command                         | Purpose                                           |
| ------------------------------- | ------------------------------------------------- |
| `pnpm dev`                      | Start the API and web app                         |
| `pnpm dev:api` / `pnpm dev:web` | Start one application                             |
| `pnpm test`                     | Run all Vitest suites                             |
| `pnpm lint`                     | Lint all workspace packages                       |
| `pnpm typecheck`                | Type-check all workspace packages                 |
| `pnpm format:check`             | Check Prettier formatting                         |
| `pnpm fallow:audit`             | Check changed files for cross-file quality issues |
| `pnpm build`                    | Build shared, API, and web packages               |
| `pnpm test:netlify`             | Build and smoke-test the packaged Netlify API     |
| `pnpm lighthouse`               | Audit the production web build locally            |

## Architecture

```text
apps/web/        React, TypeScript, Vite, TanStack Query, React Hook Form
apps/api/        Express API with an in-memory data store
packages/shared/ Shared domain types and Zod validation schemas
netlify/         Serverless entry point for the Express API
```

Key decisions:

- A pnpm workspace keeps the frontend, backend, and shared contracts in one
  reviewable repository.
- Shared Zod schemas validate forms and API payloads from one source of truth.
- TanStack Query owns server state and makes loading, empty, and error behavior
  explicit.
- Date ranges travel in the URL from search through details and checkout. The
  API uses half-open intervals, allowing a new check-in on a prior checkout day
  while rejecting true booking overlaps.
- CSS Modules use a restrained coastal system: deep evergreen structure,
  terracotta actions, warm-sand surfaces, and self-hosted Inter.
- The stay gallery uses existing image data and native React behavior instead
  of adding a lightbox dependency.

## API

| Method | Path                 | Purpose                                           |
| ------ | -------------------- | ------------------------------------------------- |
| `GET`  | `/health`            | Service health check                              |
| `GET`  | `/stays`             | Search by location, guests, price, and date range |
| `GET`  | `/stays/:id`         | Stay details                                      |
| `GET`  | `/stays/:id/reviews` | List reviews                                      |
| `POST` | `/stays/:id/reviews` | Add a review                                      |
| `POST` | `/bookings`          | Validate availability and create a booking        |
| `GET`  | `/bookings/:id`      | Retrieve a booking confirmation                   |

Request bodies and responses use schemas from `packages/shared`. Invalid input
returns `400`, missing resources return `404`, and overlapping bookings return
`409 Conflict`.

## Verification

The tests concentrate on behavior with the greatest product or regression
risk:

- API validation, search filtering, not-found responses, booking conflicts,
  and adjacent date ranges.
- Search navigation plus loading, empty, and error states.
- Gallery keyboard navigation, Escape-to-close, and focus restoration.
- Review loading, mutation success, failure behavior, and API validation.
- Checkout-to-confirmation integration, booking conflicts, and confirmation
  lookup.
- The packaged Netlify function, not only the local Express server.

GitHub Actions runs formatting, linting, changed-file analysis, type checking,
tests, the production build, and the packaged Netlify API smoke test. A
separate non-blocking Lighthouse job audits performance, accessibility, best
practices, and SEO, then retains the HTML report as a workflow artifact for 14
days.

For the complete local CI sequence:

```bash
pnpm format:check && pnpm lint && pnpm fallow:audit && pnpm typecheck && pnpm test && pnpm build && pnpm test:netlify
```

Responsive browser QA covered search, stay details, checkout, and confirmation
at representative mobile, tablet, and desktop widths; see
[docs/RESPONSIVE_QA.md](docs/RESPONSIVE_QA.md).

## Deployment

Netlify builds the workspace with `pnpm build`, publishes `apps/web/dist`,
serves the Express application through a function at `/api/*`, and rewrites
client-side routes to `index.html`. Import the repository in Netlify and select
**Use configuration from `netlify.toml`**; no production environment variable
is required because the frontend defaults to the same-origin `/api` endpoint.
`VITE_API_URL` remains available when hosting the API separately.

The assessment deliberately uses in-memory data. Netlify function instances
are ephemeral, so added reviews and bookings are not durable across instances.
This deployment demonstrates the complete integration, not production-grade
persistence.

## Tradeoffs and next steps

- Replace the in-memory store with a persistent database and enforce
  availability atomically across instances.
- Surface unavailable days directly in the stay calendar.
- Add pagination and fuzzy location matching if the inventory grows.
- Add structured request logging, monitoring, and error reporting.
- Add authentication and booking management only when the product requires
  user-owned bookings.
- Integrate a payment provider only after the booking and inventory model is
  backed by durable storage.

## Use of AI/LLMs

Claude Code assisted with the initial architecture and implementation. OpenAI
Codex assisted with later product refinement, accessibility, tests, deployment,
and documentation. Both were used under human direction and review.

Guardrails included agreeing on scope before implementation, avoiding features
outside the brief, keeping changes reviewable, inspecting generated code, and
verifying meaningful work with static checks, tests, production builds, and
browser-based desktop/mobile and keyboard QA. AI output was treated as a draft
to validate, not as evidence that the application worked.

## Screen recording

The required 5–10 minute walkthrough will be linked here after upload. It will
cover the end-to-end guest journey, the decisions above, verification evidence,
and the deliberate scope tradeoffs.
