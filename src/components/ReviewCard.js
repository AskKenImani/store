import styles from "./ReviewCard.module.css";

export default function ReviewCard({ review }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.stars}>
          {"★".repeat(review.rating)}
          {"☆".repeat(5 - review.rating)}
        </div>
        <div className={styles.by}>
          {review?.user?.name || "Anon"}
        </div>
      </div>
      <p className={styles.comment}>{review.comment}</p>
    </div>
  );
}
