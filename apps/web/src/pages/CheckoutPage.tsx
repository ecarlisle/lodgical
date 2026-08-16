import { useMutation, useQuery } from "@tanstack/react-query";
import { createBookingObjectSchema } from "@lodgical/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { createBooking, fetchStay } from "../api/stays";
import { StatusMessage } from "../components/StatusMessage";
import styles from "./CheckoutPage.module.css";

const checkoutFormSchema = createBookingObjectSchema.omit({ stayId: true });
type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export function CheckoutPage() {
  const { stayId } = useParams<{ stayId: string }>();
  const navigate = useNavigate();

  const stayQuery = useQuery({
    queryKey: ["stay", stayId],
    queryFn: () => fetchStay(stayId!),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: { guestName: "", email: "", checkIn: "", checkOut: "", guests: 1 },
  });

  const booking = useMutation({
    mutationFn: (values: CheckoutFormValues) =>
      createBooking({ ...values, stayId: stayId! }),
    onSuccess: (created) => {
      navigate(`/bookings/${created.id}`);
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  if (stayQuery.isPending) return <StatusMessage>Loading…</StatusMessage>;
  if (stayQuery.isError)
    return <StatusMessage tone="error">Couldn't load this stay.</StatusMessage>;

  const stay = stayQuery.data;
  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.round(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 0;
  const total = nights * stay.pricePerNight;

  return (
    <div>
      <h1>Checkout</h1>
      <p className={styles.summary}>
        {stay.title} · {stay.location}
      </p>

      <form
        className={styles.form}
        onSubmit={handleSubmit((values) => booking.mutate(values))}
      >
        <div className={styles.field}>
          <label htmlFor="guestName">Full name</label>
          <input id="guestName" {...register("guestName")} />
          {errors.guestName && <span className={styles.error}>{errors.guestName.message}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register("email")} />
          {errors.email && <span className={styles.error}>{errors.email.message}</span>}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="checkIn">Check-in</label>
            <input id="checkIn" type="date" {...register("checkIn")} />
          </div>
          <div className={styles.field}>
            <label htmlFor="checkOut">Check-out</label>
            <input id="checkOut" type="date" {...register("checkOut")} />
            {errors.checkOut && <span className={styles.error}>{errors.checkOut.message}</span>}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="guests">Guests</label>
          <input
            id="guests"
            type="number"
            min={1}
            max={stay.maxGuests}
            {...register("guests", { valueAsNumber: true })}
          />
          {errors.guests && <span className={styles.error}>{errors.guests.message}</span>}
        </div>

        <div className={styles.total}>
          <span>
            ${stay.pricePerNight} × {nights} night{nights === 1 ? "" : "s"}
          </span>
          <strong>${total}</strong>
        </div>

        <button type="submit" disabled={isSubmitting || nights <= 0} className={styles.submit}>
          {isSubmitting ? "Booking…" : "Confirm booking"}
        </button>

        {booking.isError && (
          <StatusMessage tone="error">
            Couldn't complete your booking. Please try again.
          </StatusMessage>
        )}
      </form>
    </div>
  );
}
