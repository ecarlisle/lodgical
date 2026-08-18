import { useEffect, useRef, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import {
  formatDateRangeSummary,
  toDate,
  toDateSelection,
  type DateSelection,
} from "../utils/dateRange";
import styles from "./DateRangeField.module.css";

type DateRangeFieldProps = {
  value: DateSelection;
  onChange: (value: DateSelection) => void;
  error?: string;
};

type DateRangePopoverProps = {
  value: DateSelection;
  selected?: DateRange;
  today: Date;
  onSelect: (range: DateRange | undefined) => void;
  onClear: () => void;
  onClose: () => void;
};

// Calendar selection states are intentionally explicit for accessible messaging.
// fallow-ignore-next-line complexity
function DateRangePopover({
  value,
  selected,
  today,
  onSelect,
  onClear,
  onClose,
}: DateRangePopoverProps) {
  return (
    <div
      className={styles.popover}
      id="date-range-dialog"
      role="dialog"
      aria-label="Choose check-in and check-out dates"
    >
      <p className={styles.instruction} aria-live="polite">
        {value.checkIn && !value.checkOut
          ? "Now choose your checkout date"
          : "Choose your check-in date, then your checkout date"}
      </p>
      <DayPicker
        animate
        className={styles.calendar}
        mode="range"
        selected={selected}
        onSelect={onSelect}
        min={1}
        disabled={{ before: today }}
        excludeDisabled
        resetOnSelect
        defaultMonth={selected?.from ?? today}
        startMonth={today}
        navLayout="around"
      />
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.clear}
          onClick={onClear}
          disabled={!value.checkIn}
        >
          Clear dates
        </button>
        <button type="button" className={styles.close} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

// Open, partial-range, error, and complete-range states share one field boundary.
// fallow-ignore-next-line complexity
export function DateRangeField({
  value,
  onChange,
  error,
}: DateRangeFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected: DateRange | undefined = value.checkIn
    ? { from: toDate(value.checkIn), to: toDate(value.checkOut) }
    : undefined;

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleSelect(range: DateRange | undefined) {
    const nextValue = toDateSelection(range);
    onChange(nextValue);

    if (nextValue.checkIn && nextValue.checkOut) {
      setIsOpen(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }

  function handleClose() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className={styles.field} ref={containerRef}>
      <span className={styles.label} id="dates-label">
        Dates
      </span>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-labelledby="dates-label dates-summary"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="date-range-dialog"
        aria-describedby={error ? "dates-error" : undefined}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true" className={styles.icon} />
        <span id="dates-summary">{formatDateRangeSummary(value)}</span>
      </button>

      {error && (
        <span className={styles.error} id="dates-error">
          {error}
        </span>
      )}

      {isOpen && (
        <DateRangePopover
          value={value}
          selected={selected}
          today={today}
          onSelect={handleSelect}
          onClear={() => onChange({})}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
