# Repository Guidelines

## Project Structure & Module Organization

Lodgical is a pnpm workspace monorepo. `apps/web` contains the React, TypeScript,
and Vite frontend; pages live in `src/pages`, reusable UI in `src/components`,
and API clients in `src/api`. Component styles use adjacent `*.module.css` files,
while global tokens are in `apps/web/src/index.css`. `apps/api` contains the
Express server, with routes, middleware, and the in-memory data store under
`src`. Shared Zod schemas and inferred domain types belong in
`packages/shared/src`; do not duplicate request or response types in either app.
Requirements and their implementation status are tracked in `docs/`.

## Build, Test, and Development Commands

Run commands from the repository root with Node 20+ and pnpm 10+:

- `pnpm install` installs all workspace dependencies.
- `pnpm dev` starts the API (`:4000`) and web app (`:5173`); use `pnpm dev:api`
  or `pnpm dev:web` to run one service.
- `pnpm test` runs all Vitest suites; scope with
  `pnpm --filter @lodgical/web test`.
- `pnpm lint`, `pnpm typecheck`, and `pnpm format:check` perform static checks.
- `pnpm fallow:audit` checks changed files for cross-file quality issues.
- `pnpm build` builds shared, API, then web packages in dependency order.

Before submitting, run the CI sequence:
`pnpm format:check && pnpm lint && pnpm fallow:audit && pnpm typecheck && pnpm test && pnpm build`.

## Coding Style & Naming Conventions

Prettier enforces two-space indentation, double quotes, semicolons, trailing
commas, and an 80-column width. ESLint also checks TypeScript, React Hooks, and
React Refresh rules. Use PascalCase for React components and pages, camelCase
for functions and variables, and descriptive route/module names. Keep backend
error translation centralized in `apps/api/src/middleware/errors.ts` and give
async UI explicit loading, empty, and error states.

## Testing Guidelines

Use Vitest throughout, React Testing Library for UI behavior, and Supertest for
API routes. Name tests `*.test.ts` or `*.test.tsx`; API suites currently live in
`apps/api/src/__tests__`. Cover successful behavior plus validation and not-found
paths. Do not include tests in API production builds; preserve the separate
`tsconfig.build.json` exclusion.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries such as `Add a combined dev
script` or `Fix CI: remove redundant ...`. Keep commits focused and update
`docs/REQUIREMENTS_CHECKLIST.md` when completing a requirement. Pull requests
should explain behavior and tradeoffs, link the relevant issue or requirement,
list verification commands, and include screenshots for visible UI changes.
Never commit `.env` files; copy the examples in each app and keep secrets local.
