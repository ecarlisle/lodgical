# Requirements checklist

Tracks coverage of [docs/requirements.md](requirements.md) against the actual implementation. Update this alongside code changes — a checked box should always point at something real (a file, a route, a test), not an intention.

Status legend: ✅ done · 🚧 partial / needs follow-up · ⬜ not started · — intentionally skipped (see note)

## Core functionality

| Requirement                                        | Status | Where                                                                                                                                                                                                                                                    | Verified by                                             |
| -------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Search or browse available stays                   | ✅     | [`SearchPage.tsx`](../apps/web/src/pages/SearchPage.tsx), `GET /stays`                                                                                                                                                                                   | `SearchPage.test.tsx`, manual (browser)                 |
| View stay details                                  | ✅     | [`StayDetailPage.tsx`](../apps/web/src/pages/StayDetailPage.tsx), `GET /stays/:id`                                                                                                                                                                       | `StayGallery.test.tsx`, manual (browser)                |
| View reviews                                       | ✅     | [`StayDetailPage.tsx`](../apps/web/src/pages/StayDetailPage.tsx), `GET /stays/:id/reviews`                                                                                                                                                               | `stays.test.ts`, `StayDetailPage.test.tsx`              |
| Add a review                                       | ✅     | [`StayDetailPage.tsx`](../apps/web/src/pages/StayDetailPage.tsx), `POST /stays/:id/reviews`                                                                                                                                                              | `stays.test.ts`, `StayDetailPage.test.tsx`              |
| Display pricing                                    | ✅     | `StayCard`, `StayDetailPage`, `CheckoutPage` (computed total)                                                                                                                                                                                            | `StayCard.test.tsx`, `CheckoutPage.test.tsx`            |
| Display availability                               | ✅     | `DateRangeField`, date-aware `GET /stays`, URL handoff through details/checkout, and server-side booking conflict rejection                                                                                                                              | `stays.test.ts`, `bookings.test.ts`                     |
| Checkout flow → confirmed booking (payment mocked) | ✅     | [`CheckoutPage.tsx`](../apps/web/src/pages/CheckoutPage.tsx) (details form + mocked, client-validated-only payment fields, never sent to the API) → [`BookingConfirmationPage.tsx`](../apps/web/src/pages/BookingConfirmationPage.tsx), `POST /bookings` | `bookings.test.ts`, `CheckoutPage.test.tsx`             |
| Frontend talks to a backend API                    | ✅     | [`apps/web/src/api/`](../apps/web/src/api/) → [`apps/api`](../apps/api), packaged as [`netlify/functions/api.ts`](../netlify/functions/api.ts)                                                                                                           | `netlify.test.ts`, `pnpm test:netlify`, live deployment |

## Technical expectations

| Requirement              | Status | Where                                                                                                                                                                              | Verified by                                                               |
| ------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Responsive design        | ✅     | Fluid grid/flex layouts plus small-viewport breakpoints in page/component CSS modules                                                                                              | [`docs/RESPONSIVE_QA.md`](RESPONSIVE_QA.md), `pnpm lighthouse`            |
| Loading state            | ✅     | `StatusMessage` + TanStack Query `isPending` on every page                                                                                                                         | `SearchPage.test.tsx`, manual (browser)                                   |
| Empty state              | ✅     | "No stays match", "No reviews yet"                                                                                                                                                 | `SearchPage.test.tsx`, `StayDetailPage.test.tsx`                          |
| Error state              | ✅     | `StatusMessage tone="error"` on every query/mutation                                                                                                                               | `SearchPage.test.tsx`, `StayDetailPage.test.tsx`                          |
| Basic accessibility      | ✅     | Semantic headings, `alt`/`aria-label`s, visible focus rings, form `label`s                                                                                                         | Homepage Lighthouse audit; `StayGallery.test.tsx` keyboard/focus coverage |
| A few meaningful tests   | ✅     | API validation/availability tests plus UI coverage for async states, URL handoff, gallery keyboard behavior, review mutations, and checkout confirmation                           | `pnpm test`                                                               |
| Simple CI pipeline       | ✅     | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) — format, lint, fallow audit, typecheck, test, build, packaged Netlify API smoke test, and non-blocking Lighthouse audit | CI run on push/PR                                                         |
| Production build process | ✅     | `pnpm build`                                                                                                                                                                       | Verified locally + in CI                                                  |

## Optional

| Requirement             | Status | Where                                                                                                                                               | Verified by                     |
| ----------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Deployment              | ✅     | [`netlify.toml`](../netlify.toml), [`netlify/functions/api.ts`](../netlify/functions/api.ts), [lodgical.netlify.app](https://lodgical.netlify.app/) | Live frontend and `/api/health` |
| Observability / logging | 🚧     | `console.error` in the API error handler only                                                                                                       | —                               |

## Submission checklist

| Requirement                      | Status | Where                                                                                        |
| -------------------------------- | ------ | -------------------------------------------------------------------------------------------- |
| Git repo with frontend + backend | ✅     | this repo                                                                                    |
| README: setup instructions       | ✅     | [README.md § Setup](../README.md#setup)                                                      |
| README: available scripts        | ✅     | [README.md § Scripts](../README.md#scripts)                                                  |
| README: architecture decisions   | ✅     | [README.md § Architecture decisions](../README.md#architecture-decisions)                    |
| README: tradeoffs                | ✅     | [README.md § Tradeoffs](../README.md#tradeoffs)                                              |
| README: what's next              | ✅     | [README.md § What I'd build next](../README.md#what-id-build-next)                           |
| README: AI/LLM usage note        | ✅     | [README.md § Use of AI/LLMs](../README.md#use-of-aillms)                                     |
| Screen recording (5–10 min)      | ✅     | [README.md § Screen recording](../README.md#screen-recording) — https://youtu.be/bKxobfy3dYk |

## API surface (brief's minimum + additions)

| Method | Path                 | Status | Notes                                                                          |
| ------ | -------------------- | ------ | ------------------------------------------------------------------------------ |
| `GET`  | `/stays`             | ✅     | supports `location`, `guests`, `minPrice`, `maxPrice`, `checkIn`, `checkOut`   |
| `GET`  | `/stays/:id`         | ✅     |                                                                                |
| `GET`  | `/stays/:id/reviews` | ✅     |                                                                                |
| `POST` | `/stays/:id/reviews` | ✅     |                                                                                |
| `POST` | `/bookings`          | ✅     | rejects overlapping confirmed bookings with `409 Conflict`                     |
| `GET`  | `/bookings/:id`      | ✅     | added beyond the brief — needed for the confirmation page to survive a refresh |

---

**How to use this file:**

- While building: update a row's status the same commit you close it out, so the checklist never drifts from the code.
- Before submission: everything in _Core functionality_ and _Technical expectations_ should be ✅ or have a 🚧 note explaining why it isn't; _Optional_ items can stay ⬜.
- For reviewers: every ✅ links to the file/route that implements it and the test (or "manual") that verified it, so you can jump straight to the evidence instead of taking the checklist's word for it.
