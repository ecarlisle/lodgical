import { useQuery } from "@tanstack/react-query";
import {
  staySearchQuerySchema,
  type Stay,
  type StaySearchQuery,
} from "@lodgical/shared";
import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchStays } from "../api/stays";
import { DateRangeField } from "../components/DateRangeField";
import { StatusMessage } from "../components/StatusMessage";
import { StayCard } from "../components/StayCard";
import { formatDateRangeSummary, type DateSelection } from "../utils/dateRange";
import styles from "./SearchPage.module.css";

function readSearchQuery(searchParams: URLSearchParams): StaySearchQuery {
  const parsed = staySearchQuerySchema.safeParse(
    Object.fromEntries(searchParams.entries()),
  );
  return parsed.success ? parsed.data : {};
}

function toSearchParams(query: StaySearchQuery): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }
  return params;
}

type SearchFormProps = {
  initialQuery: StaySearchQuery;
  onSearch: (query: StaySearchQuery) => void;
};

function SearchForm({ initialQuery, onSearch }: SearchFormProps) {
  const [dates, setDates] = useState<DateSelection>(() => ({
    checkIn: initialQuery.checkIn,
    checkOut: initialQuery.checkOut,
  }));
  const [dateError, setDateError] = useState<string>();

  // Parsing native form values keeps the search form dependency-free.
  // fallow-ignore-next-line complexity
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const location = String(form.get("location") ?? "").trim();
    const guests = Number(form.get("guests"));

    if (dates.checkIn && !dates.checkOut) {
      setDateError("Choose a checkout date to search availability.");
      return;
    }

    const nextQuery: StaySearchQuery = {
      location: location || undefined,
      guests: guests > 0 ? guests : undefined,
      checkIn: dates.checkIn,
      checkOut: dates.checkOut,
    };
    setDateError(undefined);
    onSearch(nextQuery);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="location">Location</label>
        <input
          id="location"
          name="location"
          type="text"
          placeholder="e.g. Lisbon"
          defaultValue={initialQuery.location}
        />
      </div>
      <DateRangeField
        value={dates}
        error={dateError}
        onChange={(value) => {
          setDates(value);
          setDateError(undefined);
        }}
      />
      <div className={styles.field}>
        <label htmlFor="guests">Guests</label>
        <input
          id="guests"
          name="guests"
          type="number"
          min={1}
          defaultValue={initialQuery.guests ?? 1}
        />
      </div>
      <button type="submit" className={styles.submit}>
        Search
      </button>
    </form>
  );
}

type SearchResultsProps = {
  data?: Stay[];
  isPending: boolean;
  isError: boolean;
  query: StaySearchQuery;
};

// Explicit loading, error, empty, and result branches are required by the brief.
// fallow-ignore-next-line complexity
function SearchResults({
  data,
  isPending,
  isError,
  query,
}: SearchResultsProps) {
  const resultSearchParams = toSearchParams(query).toString();
  const resultSearch = resultSearchParams ? `?${resultSearchParams}` : "";
  const hasDateRange = Boolean(query.checkIn && query.checkOut);

  if (isPending) return <StatusMessage>Loading stays…</StatusMessage>;
  if (isError) {
    return (
      <StatusMessage tone="error">
        Something went wrong loading stays. Please try again.
      </StatusMessage>
    );
  }
  if (!data) return null;
  if (data.length === 0) {
    return (
      <StatusMessage>
        {hasDateRange
          ? "No stays are available for those dates. Try another range."
          : "No stays match your search."}
      </StatusMessage>
    );
  }

  return (
    <>
      {hasDateRange && (
        <p className={styles.availability} role="status">
          {data.length} stay{data.length === 1 ? "" : "s"} available ·{" "}
          {formatDateRangeSummary(query)}
        </p>
      )}
      <ul className={styles.grid}>
        {data.map((stay) => (
          <li key={stay.id}>
            <StayCard stay={stay} search={resultSearch} />
          </li>
        ))}
      </ul>
    </>
  );
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = readSearchQuery(searchParams);
  const staysQuery = useQuery({
    queryKey: ["stays", query],
    queryFn: () => fetchStays(query),
  });

  function handleSearch(nextQuery: StaySearchQuery) {
    setSearchParams(toSearchParams(nextQuery));
  }

  return (
    <div>
      <h1>Find your next stay</h1>
      <SearchForm
        key={toSearchParams(query).toString()}
        initialQuery={query}
        onSearch={handleSearch}
      />
      <SearchResults query={query} {...staysQuery} />
    </div>
  );
}
