import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReviewSchema, type CreateReviewInput } from "@lodgical/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { createReview, fetchReviews, fetchStay } from "../api/stays";
import { StatusMessage } from "../components/StatusMessage";
import styles from "./StayDetailPage.module.css";

export function StayDetailPage() {
  const { id } = useParams<{ id: string }>();
  const stayId = id!;
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

  return (
    <div>
      <Link to="/">&larr; Back to search</Link>
      <h1>{stay.title}</h1>
      <p className={styles.location}>{stay.location}</p>

      <div className={styles.gallery}>
        {stay.images.map((src) => (
          <img key={src} src={src} alt="" loading="lazy" />
        ))}
      </div>

      <p>{stay.description}</p>

      <ul className={styles.amenities}>
        {stay.amenities.map((amenity) => (
          <li key={amenity}>{amenity}</li>
        ))}
      </ul>

      <div className={styles.bookingBar}>
        <div>
          <strong>${stay.pricePerNight}</strong> / night · up to {stay.maxGuests} guests
        </div>
        <Link to={`/checkout/${stay.id}`} className={styles.bookButton}>
          Book now
        </Link>
      </div>

      <section>
        <h2>Reviews ({stay.reviewCount})</h2>
        {reviewsQuery.isPending && <StatusMessage>Loading reviews…</StatusMessage>}
        {reviewsQuery.isError && (
          <StatusMessage tone="error">Couldn't load reviews.</StatusMessage>
        )}
        {reviewsQuery.data?.length === 0 && (
          <StatusMessage>No reviews yet. Be the first to write one.</StatusMessage>
        )}
        {reviewsQuery.data && reviewsQuery.data.length > 0 && (
          <ul className={styles.reviewList}>
            {reviewsQuery.data.map((review) => (
              <li key={review.id} className={styles.review}>
                <div className={styles.reviewHeader}>
                  <strong>{review.author}</strong>
                  <span aria-label={`Rated ${review.rating} out of 5`}>
                    ★ {review.rating}
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
            {errors.author && <span className={styles.error}>{errors.author.message}</span>}
          </div>
          <div className={styles.field}>
            <label htmlFor="rating">Rating</label>
            <select id="rating" {...register("rating", { valueAsNumber: true })}>
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
            {errors.comment && <span className={styles.error}>{errors.comment.message}</span>}
          </div>
          <button type="submit" disabled={isSubmitting} className={styles.submit}>
            {isSubmitting ? "Submitting…" : "Submit review"}
          </button>
          {submitReview.isError && (
            <StatusMessage tone="error">
              Couldn't submit your review. Please try again.
            </StatusMessage>
          )}
        </form>
      </section>
    </div>
  );
}
