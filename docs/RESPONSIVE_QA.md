# Responsive QA matrix

Manual viewport verification for the primary booking journey. Run both apps
with `pnpm dev`, then inspect each route at the listed viewport dimensions.

Last verified: August 18, 2026

| Viewport             | Search | Stay details | Checkout | Result                                                        |
| -------------------- | ------ | ------------ | -------- | ------------------------------------------------------------- |
| 375 × 812 (mobile)   | ✅     | ✅           | ✅       | No horizontal overflow; controls remain readable and usable   |
| 768 × 1024 (tablet)  | ✅     | ✅           | ✅       | Layouts reflow without clipped content or controls            |
| 1440 × 900 (desktop) | ✅     | ✅           | ✅       | Content respects the 1140px maximum width and desktop columns |

Routes checked:

- `/`
- `/stays/stay-1?checkIn=2026-10-10&checkOut=2026-10-13&guests=2`
- `/checkout/stay-1?checkIn=2026-10-10&checkOut=2026-10-13&guests=2`

For each route and viewport, verify the primary heading and interactive controls
are visible, the page has no horizontal overflow, and the expected mobile or
desktop composition is preserved. This matrix complements Lighthouse's
mobile-emulated homepage audit; it does not replace testing on physical devices.
