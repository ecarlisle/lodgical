# Lodgical web application

The React, TypeScript, and Vite frontend for Lodgical. Canonical setup,
architecture, testing, deployment, and reviewer guidance live in the
[repository README](../../README.md).

From the repository root:

```bash
pnpm dev:web
pnpm --filter @lodgical/web test
pnpm --filter @lodgical/web typecheck
pnpm --filter @lodgical/web build
```

Page modules live in `src/pages`, reusable UI in `src/components`, API clients
in `src/api`, and global design tokens in `src/index.css`.
