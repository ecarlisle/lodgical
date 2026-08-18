import type { Stay } from "@lodgical/shared";
import { Link } from "react-router-dom";
import styles from "./StayCard.module.css";

type StayCardProps = {
  stay: Stay;
  search?: string;
  availabilityLabel?: string;
};

export function StayCard({
  stay,
  search = "",
  availabilityLabel,
}: StayCardProps) {
  const hasReviews = stay.reviewCount > 0;

  return (
    <Link to={`/stays/${stay.id}${search}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={stay.images[0]}
          alt=""
          className={styles.image}
          loading="lazy"
        />
        {availabilityLabel && (
          <span className={styles.availability}>{availabilityLabel}</span>
        )}
      </div>
      <div className={styles.body}>
        <p className={styles.location}>{stay.location}</p>
        <h3 className={styles.title}>{stay.title}</h3>
        <p className={styles.features}>
          Up to {stay.maxGuests} guest{stay.maxGuests === 1 ? "" : "s"}
          {stay.amenities.length > 0 &&
            ` · ${stay.amenities.slice(0, 2).join(" · ")}`}
        </p>
        <div className={styles.meta}>
          <span
            className={styles.rating}
            aria-label={
              hasReviews
                ? `Rated ${stay.rating} out of 5 from ${stay.reviewCount} ${stay.reviewCount === 1 ? "review" : "reviews"}`
                : "No reviews yet"
            }
          >
            {hasReviews && (
              <span className={styles.star} aria-hidden="true">
                ★
              </span>
            )}
            <strong>{hasReviews ? stay.rating.toFixed(1) : "New"}</strong>
            <span className={styles.reviewCount}>
              {hasReviews
                ? `${stay.reviewCount} review${stay.reviewCount === 1 ? "" : "s"}`
                : "No reviews yet"}
            </span>
          </span>
          <span className={styles.price}>
            ${stay.pricePerNight}
            <span className={styles.perNight}> night</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
