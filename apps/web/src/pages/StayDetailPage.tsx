import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReviewSchema, type CreateReviewInput } from "@lodgical/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useParams } from "react-router-dom";
import { createReview, fetchReviews, fetchStay } from "../api/stays";
import { StayGallery } from "../components/StayGallery";
import { StatusMessage } from "../components/StatusMessage";
import { formatDateRangeSummary } from "../utils/dateRange";
import styles from "./StayDetailPage.module.css";

// The assessment keeps stay, review, and review-form states in one page module.
// fallow-ignore-next-line complexity
export function StayDetailPage() {
  const { id } = useParams<{ id: string }>();
  const stayId = id!;
  const location = useLocation();
  const queryClient = useQueryClient();

  const stayQuery = useQuery({
    queryKey: ["stay", stayId],
    queryFn: () => fetchStay(stayId),
  });

  const reviewsQuery = useQuery({
    queryKey: ["reviews", stayId],
    queryFn: () => fetchReviews(stayId),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateReviewInput>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: { author: "", rating: 5, comment: "" },
  });

  const submitReview = useMutation({
    mutationFn: (input: CreateReviewInput) => createReview(stayId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", stayId] });
      reset();
    },
  });

  if (stayQuery.isPending) return <StatusMessage>Loading stay…</StatusMessage>;
  if (stayQuery.isError)
    return (
      <StatusMessage tone="error">
        Couldn't load this stay. Please try again.
      </StatusMessage>
    );

  const stay = stayQuery.data;
  const searchParams = new URLSearchParams(location.search);
  const checkIn = searchParams.get("checkIn") ?? undefined;
  const checkOut = searchParams.get("checkOut") ?? undefined;
  const queryGuests = Number(searchParams.get("guests"));
  const dateSummary =
    checkIn && checkOut
      ? formatDateRangeSummary({ checkIn, checkOut })
      : undefined;
  const reviewCount = reviewsQuery.data?.length ?? stay.reviewCount;
  const reviewRating = reviewsQuery.data?.length
    ? reviewsQuery.data.reduce((total, review) => total + review.rating, 0) /
      reviewsQuery.data.length
    : stay.rating;

  return (
    <div className={styles.page}>
      <Link to={`/${location.search}`} className={styles.backLink}>
        &larr; Back to search
      </Link>

      <header className={styles.header}>
        <div>
          <p className={styles.location}>{stay.location}</p>
          <h1>{stay.title}</h1>
        </div>
        <p
          className={styles.headerRating}
          aria-label={
            stay.reviewCount > 0
              ? `Rated ${stay.rating} out of 5 from ${stay.reviewCount} ${stay.reviewCount === 1 ? "review" : "reviews"}`
              : "No reviews yet"
          }
        >
          {stay.reviewCount > 0 ? (
            <>
              <span className={styles.star} aria-hidden="true">
                ★
              </span>{" "}
              <strong>{stay.rating.toFixed(1)}</strong> · {stay.reviewCount}{" "}
              review{stay.reviewCount === 1 ? "" : "s"}
            </>
          ) : (
            "New stay"
          )}
        </p>
      </header>

      <StayGallery images={stay.images} stayTitle={stay.title} />

      <div className={styles.detailLayout}>
        <div className={styles.mainContent}>
          <section aria-labelledby="about-heading">
            <p className={styles.sectionEyebrow}>The stay</p>
            <h2 id="about-heading">About this place</h2>
            <p className={styles.description}>{stay.description}</p>

            <h3>What this place offers</h3>
            <ul className={styles.amenities}>
              {stay.amenities.map((amenity) => (
                <li key={amenity}>{amenity}</li>
              ))}
            </ul>
          </section>

          <section className={styles.reviews} aria-labelledby="reviews-heading">
            <p className={styles.sectionEyebrow}>Guest feedback</p>
            <h2 id="reviews-heading">Reviews</h2>
            <div className={styles.reviewSummary}>
              <div>
                <span className={styles.star} aria-hidden="true">
                  ★
                </span>
                <strong>
                  {reviewCount > 0 ? reviewRating.toFixed(1) : "New"}
                </strong>
              </div>
              <p>
                {reviewCount > 0
                  ? `Based on ${reviewCount} review${reviewCount === 1 ? "" : "s"}`
                  : "Be the first guest to share a review."}
              </p>
            </div>

            {reviewsQuery.isPending && (
              <StatusMessage>Loading reviews…</StatusMessage>
            )}
            {reviewsQuery.isError && (
              <StatusMessage tone="error">Couldn't load reviews.</StatusMessage>
            )}
            {reviewsQuery.data?.length === 0 && (
              <StatusMessage>
                No reviews yet. Be the first to write one.
              </StatusMessage>
            )}
            {reviewsQuery.data && reviewsQuery.data.length > 0 && (
              <ul className={styles.reviewList}>
                {reviewsQuery.data.map((review) => (
                  <li key={review.id} className={styles.review}>
                    <div className={styles.reviewHeader}>
                      <strong>{review.author}</strong>
                      <span aria-label={`Rated ${review.rating} out of 5`}>
                        <span className={styles.star} aria-hidden="true">
                          ★
                        </span>{" "}
                        {review.rating}
                      </span>
                    </div>
                    <p>{review.comment}</p>
                  </li>
                ))}
              </ul>
            )}

            <form
              className={styles.reviewForm}
              onSubmit={handleSubmit((values) => submitReview.mutate(values))}
            >
              <h3>Add a review</h3>
              <div className={styles.field}>
                <label htmlFor="author">Name</label>
                <input id="author" {...register("author")} />
                {errors.author && (
                  <span className={styles.error}>{errors.author.message}</span>
                )}
              </div>
              <div className={styles.field}>
                <label htmlFor="rating">Rating</label>
                <select
                  id="rating"
                  {...register("rating", { valueAsNumber: true })}
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="comment">Comment</label>
                <textarea id="comment" rows={3} {...register("comment")} />
                {errors.comment && (
                  <span className={styles.error}>{errors.comment.message}</span>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting || submitReview.isPending}
                className={styles.submit}
              >
                {isSubmitting || submitReview.isPending
                  ? "Submitting…"
                  : "Submit review"}
              </button>
              {submitReview.isError && (
                <StatusMessage tone="error">
                  Couldn't submit your review. Please try again.
                </StatusMessage>
              )}
            </form>
          </section>
        </div>

        <aside className={styles.bookingColumn} aria-label="Booking summary">
          <div className={styles.bookingCard}>
            <p className={styles.price}>
              <strong>${stay.pricePerNight}</strong>
              <span> per night</span>
            </p>
            <p className={styles.capacity}>
              Accommodates up to {stay.maxGuests} guest
              {stay.maxGuests === 1 ? "" : "s"}
            </p>

            <div className={styles.availabilityPrompt}>
              <strong>
                {dateSummary ? "Your trip" : "Check availability"}
              </strong>
              <span>
                {dateSummary ??
                  "Choose dates at checkout to confirm availability."}
              </span>
              {queryGuests > 0 && (
                <span>
                  {queryGuests} guest{queryGuests === 1 ? "" : "s"}
                </span>
              )}
            </div>

            <Link
              to={`/checkout/${stay.id}${location.search}`}
              className={styles.bookButton}
            >
              Book now
            </Link>
            <p className={styles.bookingNote}>
              Availability is confirmed when you book.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
