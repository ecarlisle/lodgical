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
    const minPrice = Number(form.get("minPrice"));
    const maxPrice = Number(form.get("maxPrice"));

    if (dates.checkIn && !dates.checkOut) {
      setDateError("Choose a checkout date to search availability.");
      return;
    }

    const nextQuery: StaySearchQuery = {
      location: location || undefined,
      guests: guests > 0 ? guests : undefined,
      minPrice: minPrice >= 0 && form.get("minPrice") ? minPrice : undefined,
      maxPrice: maxPrice > 0 ? maxPrice : undefined,
      checkIn: dates.checkIn,
      checkOut: dates.checkOut,
    };
    setDateError(undefined);
    onSearch(nextQuery);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="location">Where</label>
        <input
          id="location"
          name="location"
          type="text"
          placeholder="City or destination"
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
        <label htmlFor="guests">Who</label>
        <input
          id="guests"
          name="guests"
          type="number"
          min={1}
          defaultValue={initialQuery.guests ?? 1}
        />
      </div>
      <button type="submit" className={styles.submit}>
        Search stays
      </button>
      <details className={styles.filters}>
        <summary>
          Price per night
          {(initialQuery.minPrice !== undefined ||
            initialQuery.maxPrice !== undefined) && (
            <span className={styles.filterCount}>1</span>
          )}
        </summary>
        <div className={styles.priceFields}>
          <div className={styles.field}>
            <label htmlFor="minPrice">Minimum</label>
            <div className={styles.moneyInput}>
              <span aria-hidden="true">$</span>
              <input
                id="minPrice"
                name="minPrice"
                type="number"
                min={0}
                placeholder="0"
                defaultValue={initialQuery.minPrice}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="maxPrice">Maximum</label>
            <div className={styles.moneyInput}>
              <span aria-hidden="true">$</span>
              <input
                id="maxPrice"
                name="maxPrice"
                type="number"
                min={1}
                placeholder="Any"
                defaultValue={initialQuery.maxPrice}
              />
            </div>
          </div>
          <button type="submit" className={styles.applyFilter}>
            Apply price
          </button>
        </div>
      </details>
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
    <section className={styles.results} aria-labelledby="results-heading">
      <div className={styles.resultsHeader}>
        <div>
          <p className={styles.resultsEyebrow}>Places to stay</p>
          <h2 id="results-heading">
            {query.location
              ? `Stays in ${query.location}`
              : "Explore all stays"}
          </h2>
        </div>
        <p className={styles.availability} role="status">
          <strong>
            {data.length} stay{data.length === 1 ? "" : "s"}
          </strong>
          {hasDateRange
            ? ` available · ${formatDateRangeSummary(query)}`
            : " ready to explore"}
        </p>
      </div>
      <ul className={styles.grid}>
        {data.map((stay) => (
          <li key={stay.id}>
            <StayCard
              stay={stay}
              search={resultSearch}
              availabilityLabel={
                hasDateRange ? "Available for your dates" : undefined
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<StaySearchQuery>(() =>
    readSearchQuery(searchParams),
  );
  const staysQuery = useQuery({
    queryKey: ["stays", query],
    queryFn: () => fetchStays(query),
  });

  function handleSearch(nextQuery: StaySearchQuery) {
    setQuery(nextQuery);
    setSearchParams(toSearchParams(nextQuery));
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="search-heading">
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>A considered place to land</p>
          <h1 id="search-heading">Stay somewhere worth remembering.</h1>
          <p>
            Thoughtful homes, cabins, and city hideaways for the way you
            actually travel.
          </p>
        </div>
      </section>
      <div className={styles.searchPanel}>
        <SearchForm initialQuery={query} onSearch={handleSearch} />
      </div>
      <SearchResults query={query} {...staysQuery} />
    </div>
  );
}
