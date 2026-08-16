# Lodgical

A small travel booking app: search stays, view details and reviews, and complete a mocked checkout that produces a confirmed booking.

## Requirements

See [docs/requirements.md](docs/requirements.md) for the assessment brief this project was built against.

## Workspace Structure

pnpm workspace monorepo:

```
apps/
  web/       React + TypeScript frontend (Vite)
  api/       Express + TypeScript backend (in-memory mocked data)
packages/
  shared/    Types and Zod schemas shared by both apps
```

`apps/web` and `apps/api` both depend on `packages/shared` so request/response shapes and validation stay in sync between frontend and backend.

## Setup

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

## Scripts

Run from the repo root:

| Command          | Description                                   |
| ---------------- | --------------------------------------------- |
| `pnpm dev:api`   | Start the backend on `http://localhost:4000`  |
| `pnpm dev:web`   | Start the frontend on `http://localhost:5173` |
| `pnpm lint`      | Lint all packages                             |
| `pnpm typecheck` | Typecheck all packages                        |
| `pnpm test`      | Run all tests                                 |
| `pnpm build`     | Production build of shared, api, and web      |

Run both `dev:api` and `dev:web` in separate terminals for local development.

## API

| Method | Path                 | Description                                                      |
| ------ | -------------------- | ---------------------------------------------------------------- |
| `GET`  | `/stays`             | List/search stays (`location`, `guests`, `minPrice`, `maxPrice`) |
| `GET`  | `/stays/:id`         | Stay details                                                     |
| `GET`  | `/stays/:id/reviews` | Reviews for a stay                                               |
| `POST` | `/stays/:id/reviews` | Add a review                                                     |
| `POST` | `/bookings`          | Create a booking (checkout)                                      |
| `GET`  | `/bookings/:id`      | Booking confirmation                                             |

Data is seeded in-memory (`apps/api/src/data/seed.ts`) — no database.

## Architecture decisions

- **Plain CSS (CSS Modules)** instead of a utility framework, per project preference.
- **In-memory mocked data** on the backend rather than a real database — appropriate for the timeboxed scope.
- **TanStack Query** for server state, giving loading/error/empty states out of the box.
- **Zod schemas in `packages/shared`** validate both the API's request bodies and the frontend's forms from one source of truth.

## Tradeoffs / what's next

- No persistence across server restarts (in-memory store).
- No auth — bookings aren't tied to a user account.
- No date-range availability conflicts are checked against existing bookings.
- Search is a simple substring/threshold filter, not a full-text or fuzzy search.
