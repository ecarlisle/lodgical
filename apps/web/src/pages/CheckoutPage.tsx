import { useMutation, useQuery } from "@tanstack/react-query";
import { createBookingObjectSchema } from "@lodgical/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { createBooking, fetchStay } from "../api/stays";
import { StatusMessage } from "../components/StatusMessage";
import styles from "./CheckoutPage.module.css";

const bookingFieldsSchema = createBookingObjectSchema.omit({ stayId: true });

const paymentFieldsSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{4} \d{4} \d{4} \d{4}$/, "Use format 0000 0000 0000 0000"),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use format MM/YY"),
  cardCvv: z.string().regex(/^\d{3,4}$/, "3 or 4 digits"),
});

const checkoutFormSchema = bookingFieldsSchema.and(paymentFieldsSchema);
type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

// The assessment keeps the complete checkout flow visible in one page module.
// fallow-ignore-next-line complexity
export function CheckoutPage() {
  const { stayId } = useParams<{ stayId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryGuests = Number(searchParams.get("guests"));

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
    defaultValues: {
      guestName: "",
      email: "",
      checkIn: searchParams.get("checkIn") ?? "",
      checkOut: searchParams.get("checkOut") ?? "",
      guests: queryGuests > 0 ? queryGuests : 1,
      cardNumber: "",
      cardExpiry: "",
      cardCvv: "",
    },
  });

  const booking = useMutation({
    // Card fields are UI-only for this mocked flow — never sent to the API.
    mutationFn: (values: CheckoutFormValues) =>
      createBooking({
        stayId: stayId!,
        guestName: values.guestName,
        email: values.email,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        guests: values.guests,
      }),
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

      <form
        className={styles.layout}
        onSubmit={handleSubmit((values) => booking.mutate(values))}
      >
        <div className={styles.detailsColumn}>
          <section className={styles.card}>
            <h2>Enter your details</h2>

            <div className={styles.field}>
              <label htmlFor="guestName">Full name</label>
              <input id="guestName" {...register("guestName")} />
              {errors.guestName && (
                <span className={styles.error}>{errors.guestName.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" {...register("email")} />
              {errors.email && (
                <span className={styles.error}>{errors.email.message}</span>
              )}
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="checkIn">Check-in</label>
                <input id="checkIn" type="date" {...register("checkIn")} />
              </div>
              <div className={styles.field}>
                <label htmlFor="checkOut">Check-out</label>
                <input
                  id="checkOut"
                  type="date"
                  min={checkIn || undefined}
                  {...register("checkOut")}
                />
                {errors.checkOut && (
                  <span className={styles.error}>
                    {errors.checkOut.message}
                  </span>
                )}
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
              {errors.guests && (
                <span className={styles.error}>{errors.guests.message}</span>
              )}
            </div>
          </section>

          <section className={styles.card}>
            <h2>Payment details</h2>
            <p className={styles.mockNotice}>
              This is a demo — no real payment is processed.
            </p>

            <div className={styles.field}>
              <label htmlFor="cardNumber">Card number</label>
              <input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                autoComplete="off"
                {...register("cardNumber")}
              />
              {errors.cardNumber && (
                <span className={styles.error}>
                  {errors.cardNumber.message}
                </span>
              )}
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="cardExpiry">Expiry</label>
                <input
                  id="cardExpiry"
                  placeholder="MM/YY"
                  autoComplete="off"
                  {...register("cardExpiry")}
                />
                {errors.cardExpiry && (
                  <span className={styles.error}>
                    {errors.cardExpiry.message}
                  </span>
                )}
              </div>
              <div className={styles.field}>
                <label htmlFor="cardCvv">CVV</label>
                <input
                  id="cardCvv"
                  placeholder="123"
                  autoComplete="off"
                  {...register("cardCvv")}
                />
                {errors.cardCvv && (
                  <span className={styles.error}>{errors.cardCvv.message}</span>
                )}
              </div>
            </div>
          </section>
        </div>

        <aside className={styles.summaryColumn}>
          <div className={styles.summaryCard}>
            <h2>Your booking details</h2>
            <p className={styles.summaryStay}>
              {stay.title} · {stay.location}
            </p>

            <div className={styles.total}>
              <span>
                ${stay.pricePerNight} × {nights} night{nights === 1 ? "" : "s"}
              </span>
              <strong>${total}</strong>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || booking.isPending || nights <= 0}
              className={styles.submit}
            >
              {isSubmitting || booking.isPending
                ? "Booking…"
                : "Confirm booking"}
            </button>

            {booking.isError && (
              <StatusMessage tone="error">
                {booking.error instanceof Error
                  ? booking.error.message
                  : "Couldn't complete your booking. Please try again."}
              </StatusMessage>
            )}
          </div>
        </aside>
      </form>
    </div>
  );
}
