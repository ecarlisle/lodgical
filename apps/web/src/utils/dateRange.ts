export type DateSelection = {
  checkIn?: string;
  checkOut?: string;
};

export function toDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toDateSelection(range?: {
  from?: Date;
  to?: Date;
}): DateSelection {
  return {
    checkIn: range?.from ? toDateString(range.from) : undefined,
    checkOut: range?.to ? toDateString(range.to) : undefined,
  };
}

export function calculateNights(checkIn?: string, checkOut?: string): number {
  if (!checkIn || !checkOut) return 0;
  const start = Date.parse(`${checkIn}T00:00:00Z`);
  const end = Date.parse(`${checkOut}T00:00:00Z`);
  return Math.max(0, Math.round((end - start) / 86_400_000));
}

export function formatDateRangeSummary(value: DateSelection): string {
  const checkIn = toDate(value.checkIn);
  const checkOut = toDate(value.checkOut);
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });

  if (!checkIn) return "Add dates";
  if (!checkOut) return `${formatter.format(checkIn)} – Select checkout`;

  const nights = calculateNights(value.checkIn, value.checkOut);
  return `${formatter.format(checkIn)} – ${formatter.format(checkOut)} · ${nights} night${nights === 1 ? "" : "s"}`;
}
