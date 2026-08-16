# Lodgical

A small travel booking app (search stays, view details/reviews, mocked checkout → confirmed booking). Built for a timeboxed take-home assessment — see [docs/requirements.md](docs/requirements.md) for the brief and [docs/REQUIREMENTS_CHECKLIST.md](docs/REQUIREMENTS_CHECKLIST.md) for what's done vs. outstanding.

## Stack

pnpm workspace monorepo:

- `apps/web` — React + TypeScript, Vite, React Router, TanStack Query, React Hook Form + Zod, plain CSS (CSS Modules — no Tailwind, no CSS-in-JS)
- `apps/api` — Express + TypeScript, in-memory mocked data (no database), Zod-validated request bodies
- `packages/shared` — Zod schemas + inferred types (`Stay`, `Review`, `Booking`) used by both apps; this is the source of truth for request/response shapes

## Commands

Run from the repo root:

```bash
pnpm dev              # both apps together (concurrently), or pnpm dev:api / pnpm dev:web individually
pnpm lint             # eslint, all packages (flat config at repo root: eslint.config.js)
pnpm typecheck        # tsc --noEmit, all packages
pnpm test             # vitest, all packages
pnpm format           # prettier --write .
pnpm format:check     # prettier --check . (what CI runs)
pnpm build            # shared -> api -> web, in that order (web imports shared's types)
pnpm lighthouse       # builds web, serves it, audits it with Lighthouse -> apps/web/lighthouse-report.html
```

Always run `pnpm lint && pnpm typecheck && pnpm test && pnpm build` before considering a change done — this mirrors `.github/workflows/ci.yml` exactly, so if it fails locally it fails in CI. `pnpm lighthouse` is intentionally not part of CI — performance scores are noisy on shared CI runners, so treat it as a local/manual check, not a gate.

## Conventions

- **Shared types live in `packages/shared`, not duplicated.** Any change to `Stay`/`Review`/`Booking` shapes goes there first; both apps consume it via `workspace:*`. Frontend forms validate with the same Zod schemas the backend uses to validate request bodies where practical (see `createBookingObjectSchema.omit(...)` in `CheckoutPage.tsx` for the pattern when a schema needs a client-only variant).
- **Plain CSS via CSS Modules** — one `.module.css` per component/page, imported as `styles`. No utility framework, no inline styles beyond trivial cases. Global tokens (`--color-*`, `--spacing-*`, etc.) live in `apps/web/src/index.css`.
- **Every async page/section handles loading, empty, and error states explicitly** via `StatusMessage` + TanStack Query's `isPending`/`isError`. Don't add a new data-fetching page without all three.
- **Backend errors are centralized**: routes call `next(error)` or `next(new NotFoundError(...))`; `apps/api/src/middleware/errors.ts` turns `ZodError` → 400, `NotFoundError` → 404, everything else → 500. Don't hand-roll status codes in route handlers.
- **In-memory data store** (`apps/api/src/data/store.ts`) resets on every server restart — this is intentional for the assessment scope, not a bug.

## Known gotchas

- `apps/api` has **two tsconfigs**: `tsconfig.json` (typecheck, includes tests) and `tsconfig.build.json` (build, excludes `__tests__`/`*.test.ts`). If you add a new build-adjacent script, use `tsconfig.build.json` — the split exists because `tsc -p tsconfig.json` previously compiled test files into `dist/`, and vitest picked those up alongside the source tests and silently doubled the test count. Don't collapse these back into one config.
- `vitest` is pinned to `^4.1.10` in both apps, not the version Vite's scaffold defaults to — the scaffold's default vitest only supports vite ≤5, and this repo is on vite 8. Keep them in sync if you bump either.
- The Prettier config (`.prettierrc.json`) and VS Code's `.vscode/settings.json` (`editor.defaultFormatter`) both matter — without the VS Code setting, the editor nags about "multiple formatters" for TS/TSX because the built-in formatter and the Prettier extension both register.

## After completing a requirement

Update the corresponding row in [docs/REQUIREMENTS_CHECKLIST.md](docs/REQUIREMENTS_CHECKLIST.md) in the same commit — status, the file/route implementing it, and how it's verified. A checklist that drifts from the code is worse than no checklist.
