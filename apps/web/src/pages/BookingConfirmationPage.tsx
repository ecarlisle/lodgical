import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { fetchBooking } from "../api/stays";
import { StatusMessage } from "../components/StatusMessage";
import styles from "./BookingConfirmationPage.module.css";

export function BookingConfirmationPage() {
  const { id } = useParams<{ id: string }>();

  const bookingQuery = useQuery({
    queryKey: ["booking", id],
    queryFn: () => fetchBooking(id!),
  });

  if (bookingQuery.isPending)
    return <StatusMessage>Loading booking…</StatusMessage>;
  if (bookingQuery.isError)
    return (
      <StatusMessage tone="error">
        We couldn't find that booking. Check the confirmation link and try
        again.
      </StatusMessage>
    );

  const booking = bookingQuery.data;

  return (
    <div className={styles.confirmation}>
      <h1>Booking confirmed</h1>
      <p>
        Thanks, {booking.guestName} — a confirmation was "sent" to{" "}
        {booking.email}.
      </p>
      <dl className={styles.details}>
        <dt>Confirmation number</dt>
        <dd>{booking.id}</dd>
        <dt>Check-in</dt>
        <dd>{booking.checkIn}</dd>
        <dt>Check-out</dt>
        <dd>{booking.checkOut}</dd>
        <dt>Guests</dt>
        <dd>{booking.guests}</dd>
        <dt>Total paid</dt>
        <dd>${booking.totalPrice}</dd>
      </dl>
      <Link to="/">Browse more stays</Link>
    </div>
  );
}
