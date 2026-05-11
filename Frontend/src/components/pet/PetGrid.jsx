import PetCard from "./PetCard";
import styles from "./PetGrid.module.css";

/*
  PET GRID — Updated for Phase 3
  ─────────────────────────────────
  Now handles 3 states:
  1. LOADING → shows skeleton placeholder cards
  2. EMPTY   → shows a friendly "no pets found" message
  3. DATA    → renders the real PetCard grid

  WHAT IS A SKELETON?
  ─────────────────────
  A skeleton is a gray animated placeholder that mimics the shape
  of the real content while it loads. It's better than a spinner
  because the user can see the layout before data arrives.
  The shimmer animation is defined in index.css (.skeleton class).
*/

// Generates N skeleton card placeholders
function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={`skeleton ${styles.skelImg}`} />
      <div className={styles.skelBody}>
        <div className={`skeleton ${styles.skelBadge}`} />
        <div className={`skeleton ${styles.skelTitle}`} />
        <div className={`skeleton ${styles.skelText}`} />
        <div className={`skeleton ${styles.skelText} ${styles.skelTextShort}`} />
        <div className={`skeleton ${styles.skelBtn}`} />
      </div>
    </div>
  );
}

function PetGrid({ pets = [], loading = false, skeletonCount = 8, onHeartClick }) {
  // ── LOADING STATE ──
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // ── EMPTY STATE ──
  if (pets.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.empty__icon}>🐾</div>
        <h3 className={styles.empty__title}>No pets found</h3>
        <p className={styles.empty__text}>
          Try adjusting your filters or search for a different breed.
        </p>
      </div>
    );
  }

  // ── DATA STATE ──
  return (
    <div className={styles.grid}>
      {pets.map((pet) => (
        <PetCard key={pet.petId} pet={pet} onHeartClick={onHeartClick} />
      ))}
    </div>
  );
}

export default PetGrid;