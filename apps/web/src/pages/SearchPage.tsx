import { useQuery } from "@tanstack/react-query";
import type { StaySearchQuery } from "@lodgical/shared";
import { useState, type FormEvent } from "react";
import { fetchStays } from "../api/stays";
import { StatusMessage } from "../components/StatusMessage";
import { StayCard } from "../components/StayCard";
import styles from "./SearchPage.module.css";

export function SearchPage() {
  const [query, setQuery] = useState<StaySearchQuery>({});

  const { data, isPending, isError } = useQuery({
    queryKey: ["stays", query],
    queryFn: () => fetchStays(query),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const location = String(form.get("location") ?? "").trim();
    const guests = Number(form.get("guests"));
    setQuery({
      location: location || undefined,
      guests: guests > 0 ? guests : undefined,
    });
  }

  return (
    <div>
      <h1>Find your next stay</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="location">Location</label>
          <input id="location" name="location" type="text" placeholder="e.g. Lisbon" />
        </div>
        <div className={styles.field}>
          <label htmlFor="guests">Guests</label>
          <input id="guests" name="guests" type="number" min={1} defaultValue={1} />
        </div>
        <button type="submit" className={styles.submit}>
          Search
        </button>
      </form>

      {isPending && <StatusMessage>Loading stays…</StatusMessage>}
      {isError && (
        <StatusMessage tone="error">
          Something went wrong loading stays. Please try again.
        </StatusMessage>
      )}
      {data && data.length === 0 && (
        <StatusMessage>No stays match your search.</StatusMessage>
      )}
      {data && data.length > 0 && (
        <ul className={styles.grid}>
          {data.map((stay) => (
            <li key={stay.id}>
              <StayCard stay={stay} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
