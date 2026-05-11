import { Link } from "react-router-dom";
import { FaHeart, FaMapMarkerAlt, FaMars, FaVenus } from "react-icons/fa";
import { useFavorites } from "../../context/FavoritesContext";
import styles from "./PetCard.module.css";

/*
  PET CARD — Updated for Phase 3 (Real API Data)
  ─────────────────────────────────────────────────
  The real backend returns PetResponseDto with these fields:
    petId           → unique ID (was "id" in mock data)
    name            → pet's name
    animalType      → "Dog", "Cat", etc. (was "type" in mock)
    breed           → breed string
    age             → age in MONTHS from backend
    gender          → "Male" or "Female"
    location        → city string
    status          → "Available" | "Pending" | "Adopted"
    primaryImageUrl → main photo URL (was imageUrl in mock)
    ownerName       → shelter/owner name

  KEY CHANGE: age is now in MONTHS, not years.
  We display it intelligently: "8 months" or "2 years"
*/

// Map animalType (backend uses Title Case) to emoji
const TYPE_EMOJI = {
  Dog:    "🐶",
  Cat:    "🐱",
  Bird:   "🐦",
  Rabbit: "🐰",
  Other:  "✨",
};

const STATUS_BADGE = {
  Available: "badge-green",
  Pending:   "badge-yellow",
  Adopted:   "badge-gray",
};

// Convert age in months to a readable string
function formatAge(months) {
  if (!months && months !== 0) return "Unknown";
  if (months < 12) return `${months} mo${months !== 1 ? "s" : ""}`;
  const years = Math.floor(months / 12);
  return `${years} yr${years !== 1 ? "s" : ""}`;
}

function PetCard({ pet, onHeartClick }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const {
    petId,          // real API field (not "id")
    name,
    animalType,     // real API field (not "type")
    breed,
    age,            // in MONTHS from real API
    gender,
    location,
    status = "Available",
    primaryImageUrl, // real API field (not "imageUrl")
    ownerName,
  } = pet;

  // Fallback image if no photo was uploaded
  const photo = primaryImageUrl || "https://placedog.net/400/300?random";
  const saved = isFavorite(petId);  // instant O(1) Set lookup

  const GenderIcon  = gender === "Female" ? FaVenus : FaMars;
  const genderClass = gender === "Female" ? styles.female : styles.male;

  return (
    <article className={styles.card}>
      {/* ── Image Section ── */}
      <Link to={`/pets/${petId}`} className={styles.card__img_wrapper}>
        <img
          src={photo}
          alt={`${name} — ${breed}`}
          className={styles.card__img}
          loading="lazy"
          onError={(e) => {
            // If image fails to load, show a placeholder
            e.target.src = "https://placedog.net/400/300?random";
          }}
        />

        {/* Status badge — only shown if NOT Available */}
        {status !== "Available" && (
          <span className={`badge ${STATUS_BADGE[status]} ${styles.card__status}`}>
            {status}
          </span>
        )}

        {/* Favorite heart button — red when saved */}
        <button
          className={`${styles.card__heart} ${saved ? styles.saved : ""}`}
          aria-label={saved ? `Remove ${name} from favorites` : `Save ${name} to favorites`}
          onClick={(e) => {
            e.preventDefault();
            // If a custom handler is provided (e.g., from FavoritesPage), use it.
            // Otherwise fall back to the global toggleFavorite from context.
            if (onHeartClick) {
              onHeartClick(petId);
            } else {
              toggleFavorite(petId);
            }
          }}
        >
          <FaHeart />
        </button>
      </Link>

      {/* ── Card Body ── */}
      <div className={styles.card__body}>
        {/* Type badge + gender */}
        <div className={styles.card__meta}>
          <span className={`badge badge-orange ${styles.card__type}`}>
            {TYPE_EMOJI[animalType] || "🐾"} {animalType}
          </span>
          <span className={`${styles.card__gender} ${genderClass}`}>
            <GenderIcon size={11} /> {gender}
          </span>
        </div>

        {/* Name — clickable link */}
        <Link to={`/pets/${petId}`} className={styles.card__name}>
          {name}
        </Link>

        {/* Breed + Age */}
        <p className={styles.card__breed}>
          {breed} · {formatAge(age)}
        </p>

        {/* Owner/Shelter */}
        {ownerName && (
          <p className={styles.card__owner}>
            🏠 {ownerName}
          </p>
        )}

        {/* Location */}
        <p className={styles.card__location}>
          <FaMapMarkerAlt size={11} />
          {location}
        </p>

        {/* CTA Button */}
        <Link to={`/pets/${petId}`} className={`btn btn-outline btn-sm ${styles.card__cta}`}>
          View Details
        </Link>
      </div>
    </article>
  );
}

export default PetCard;