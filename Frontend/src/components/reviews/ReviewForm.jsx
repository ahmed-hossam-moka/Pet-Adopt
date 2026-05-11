import { useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { createReview } from "../../services/reviewService";
import styles from "./ReviewForm.module.css";

function clampRating(val) {
  const n = Number(val);
  if (Number.isNaN(n)) return 0;
  return Math.min(5, Math.max(1, Math.trunc(n)));
}

export default function ReviewForm({ petId, petName, onCreated }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => petId && rating >= 1 && rating <= 5 && !submitting,
    [petId, rating, submitting]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!petId) return;

    const safeRating = clampRating(rating);
    if (safeRating < 1 || safeRating > 5) {
      toast.error("Please select a star rating.");
      return;
    }

    setSubmitting(true);
    try {
      await createReview({
        petId,
        rating: safeRating,
        comment: comment.trim() ? comment.trim() : null,
      });
      toast.success("Thanks! Your review was submitted.");
      setRating(0);
      setHover(0);
      setComment("");
      onCreated?.();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to submit review. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h3 className={styles.title}>Leave a review</h3>
        {petName ? <span className={styles.subtitle}>for {petName}</span> : null}
      </div>

      <div className={styles.stars} aria-label="Star rating">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = (hover || rating) >= n;
          return (
            <button
              key={n}
              type="button"
              className={`${styles.starBtn} ${active ? styles.starActive : ""}`}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(n)}
              aria-label={`${n} star${n === 1 ? "" : "s"}`}
            >
              <FaStar />
            </button>
          );
        })}
        <span className={styles.ratingText}>{rating ? `${rating}/5` : "Select a rating"}</span>
      </div>

      <label className={styles.label}>
        Comment <span className={styles.optional}>(optional)</span>
        <textarea
          className={styles.textarea}
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience adopting from this shelter..."
          maxLength={500}
        />
        <div className={styles.charCount}>{comment.length}/500</div>
      </label>

      <div className={styles.actions}>
        <button className="btn btn-primary" type="submit" disabled={!canSubmit}>
          {submitting ? "Submitting..." : "Submit review"}
        </button>
      </div>
    </form>
  );
}

