import { describe, expect, it } from "vitest";
import { calculateNights, formatDateRangeSummary } from "./dateRange";

describe("date range helpers", () => {
  it("formats a complete range with its night count", () => {
    expect(
      formatDateRangeSummary({
        checkIn: "2026-10-10",
        checkOut: "2026-10-13",
      }),
    ).toBe("Oct 10 – Oct 13 · 3 nights");
  });

  it("calculates nights across a month boundary", () => {
    expect(calculateNights("2026-10-30", "2026-11-02")).toBe(3);
  });
});
