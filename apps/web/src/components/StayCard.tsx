import type { Stay } from "@lodgical/shared";
import { Link } from "react-router-dom";
import styles from "./StayCard.module.css";

type StayCardProps = {
  stay: Stay;
};

export function StayCard({ stay }: StayCardProps) {
  return (
    <Link to={`/stays/${stay.id}`} className={styles.card}>
      <img
        src={stay.images[0]}
        alt=""
        className={styles.image}
        loading="lazy"
      />
      <div className={styles.body}>
        <h3 className={styles.title}>{stay.title}</h3>
        <p className={styles.location}>{stay.location}</p>
        <div className={styles.meta}>
          <span aria-label={`Rated ${stay.rating} out of 5`}>
            ★ {stay.rating.toFixed(1)} ({stay.reviewCount})
          </span>
          <span className={styles.price}>
            ${stay.pricePerNight}
            <span className={styles.perNight}> / night</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
