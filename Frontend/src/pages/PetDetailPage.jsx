/*
  PET DETAIL PAGE — Full Phase 3 Implementation
  ───────────────────────────────────────────────
  Shows the full profile of a single pet.

  SECTIONS:
  • Hero image (primary photo)
  • Pet name, type, breed, age, gender, location, status
  • Owner/shelter name
  • Health status
  • Full description
  • "Apply to Adopt" button (logged-in Adopters only)

  WHAT IS useEffect HERE?
  ─────────────────────────
  When this page first mounts, we fetch the pet by its ID.
  We use useEffect to run the fetch after the component renders:

    useEffect(() => {
      fetchPet(id);
    }, [id]);
    // Runs once when the page loads, and again if the ID changes.

  The [id] dependency means: if the user navigates from /pets/1
  to /pets/2, the effect re-runs and fetches pet #2 automatically.

  LOADING STATE:
  ───────────────
  While fetching, we show skeleton placeholders.
  When data arrives, we render the real content.
  If an error occurs, we show an error card.
*/

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaMapMarkerAlt, FaMars, FaVenus, FaArrowLeft,
  FaHeart, FaPaw,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";
import { getPetById } from "../services/petService";
import { getOwnerReviews } from "../services/reviewService";
import { getMyAdoptionRequests } from "../services/adoptionService";
import AdoptionModal from "../components/adoption/AdoptionModal";
import ReviewForm from "../components/reviews/ReviewForm";
import styles from "./PetDetailPage.module.css";

// Age formatting helper (same as PetCard)
function formatAge(months) {
  if (!months && months !== 0) return "Unknown";
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""}`;
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""}`;
}

const STATUS_STYLES = {
  Available: { cls: "badge-green",  label: "✅ Available for Adoption" },
  Pending:   { cls: "badge-yellow", label: "⏳ Adoption Pending" },
  Adopted:   { cls: "badge-gray",   label: "🏠 Already Adopted" },
};

function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, isAdopter, user } = useAuth();

  const [pet, setPet]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [modalOpen, setModalOpen]     = useState(false);  // adoption modal

  const [ownerReviews, setOwnerReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  useEffect(() => {
    // Scroll to top when navigating to a pet detail page
    window.scrollTo(0, 0);

    async function fetchPet() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPetById(id);
        setPet(data);
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "This pet couldn't be found. It may have been removed."
            : "Failed to load pet details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPet();
  }, [id]); // re-run if URL id changes

  async function loadReviews(ownerId) {
    if (!ownerId) return;
    setLoadingReviews(true);
    try {
      const data = await getOwnerReviews(ownerId, 1, 6);
      setOwnerReviews(data?.items || []);
    } catch {
      setOwnerReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  }

  async function checkReviewEligibility(petId) {
    if (!isLoggedIn || !isAdopter || !petId || !user?.id) {
      setCanReview(false);
      return;
    }

    setCheckingEligibility(true);
    try {
      const reqs = await getMyAdoptionRequests();
      const hasAcceptedForThisPet = (reqs || []).some(
        (r) =>
          r.petId === Number(petId) &&
          r.status === "Accepted" &&
          (!r.adopterId || r.adopterId === user.id)
      );
      setCanReview(hasAcceptedForThisPet);
    } catch {
      setCanReview(false);
    } finally {
      setCheckingEligibility(false);
    }
  }

  useEffect(() => {
    if (!pet) return;
    loadReviews(pet.ownerId);
    checkReviewEligibility(pet.petId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet?.petId, pet?.ownerId, isLoggedIn, isAdopter, user?.id]);

  // ── LOADING ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="page-wrapper container fade-in-up">
        <div className={styles.skeleton__layout}>
          <div className={`skeleton ${styles.skeleton__img}`} />
          <div className={styles.skeleton__info}>
            <div className={`skeleton ${styles.sk_badge}`} />
            <div className={`skeleton ${styles.sk_title}`} />
            <div className={`skeleton ${styles.sk_line}`} />
            <div className={`skeleton ${styles.sk_line}`} />
            <div className={`skeleton ${styles.sk_line} ${styles.sk_short}`} />
            <div className={`skeleton ${styles.sk_btn}`} />
          </div>
        </div>
      </div>
    );
  }

  // ── ERROR ─────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="page-wrapper container fade-in-up">
        <div className={styles.errorBox}>
          <span className={styles.errorIcon}>🐾</span>
          <h2>{error}</h2>
          <button className="btn btn-outline" onClick={() => navigate("/browse")}>
            <FaArrowLeft size={13} /> Back to Browse
          </button>
        </div>
      </div>
    );
  }

  if (!pet) return null;

  // Build image list — primaryImageUrl first, then rest of images
  const images = pet.images?.length
    ? pet.images.map((img) => img.imageUrl)
    : [pet.primaryImageUrl || "https://placedog.net/800/600?random"];

  const status       = STATUS_STYLES[pet.status] || STATUS_STYLES.Available;
  const GenderIcon   = pet.gender === "Female" ? FaVenus : FaMars;
  const genderColor  = pet.gender === "Female" ? "#f472b6" : "#60a5fa";
  //const canAdopt     = isLoggedIn && isAdopter && pet.status === "Available";

  function handleAdoptClick() {
    if (!isLoggedIn) {
      toast.error("Please log in to apply for adoption.");
      navigate("/login");
      return;
    }
    if (!isAdopter) {
      toast.error("Only registered Adopters can apply for adoption.");
      return;
    }
    setModalOpen(true);  // open the adoption modal
  }

  return (
    <div className="page-wrapper container fade-in-up">

      {/* Back button */}
      <button
        className={`btn btn-ghost btn-sm ${styles.backBtn}`}
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft size={13} /> Back
      </button>

      {/* ── Main Layout ── */}
      <div className={styles.layout}>

        {/* ── LEFT: Image Gallery ── */}
        <div className={styles.gallery}>
          {/* Main Image */}
          <div className={styles.mainImg}>
            <img
              src={images[selectedImg]}
              alt={pet.name}
              className={styles.mainImg__img}
              onError={(e) => {
                e.target.src = "https://placedog.net/800/600?random";
              }}
            />
            {/* Status badge overlay */}
            <span className={`badge ${status.cls} ${styles.statusBadge}`}>
              {status.label}
            </span>
          </div>

          {/* Thumbnail strip (only shown if > 1 image) */}
          {images.length > 1 && (
            <div className={styles.thumbs}>
              {images.map((src, idx) => (
                <button
                  key={idx}
                  className={`${styles.thumb} ${selectedImg === idx ? styles.thumbActive : ""}`}
                  onClick={() => setSelectedImg(idx)}
                >
                  <img src={src} alt={`Photo ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Pet Info ── */}
        <div className={styles.info}>

          {/* Type badge */}
          <div className={styles.info__badges}>
            <span className="badge badge-orange">{pet.animalType}</span>
            <span className="badge badge-gray" style={{ color: genderColor }}>
              <GenderIcon size={11} /> {pet.gender}
            </span>
          </div>

          {/* Name */}
          <h1 className={styles.info__name}>{pet.name}</h1>

          {/* Key stats grid */}
          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              <span className={styles.stat__label}>Breed</span>
              <span className={styles.stat__val}>{pet.breed}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.stat__label}>Age</span>
              <span className={styles.stat__val}>{formatAge(pet.age)}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.stat__label}>Location</span>
              <span className={styles.stat__val}>
                <FaMapMarkerAlt size={11} /> {pet.location}
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.stat__label}>Health</span>
              <span className={styles.stat__val}>{pet.healthStatus}</span>
            </div>
          </div>

          {/* Owner / Shelter */}
          {pet.ownerName && (
            <div className={styles.owner}>
              <FaPaw size={13} />
              <span>
                Listed by{" "}
                {pet.ownerId ? (
                  <Link className={styles.ownerLink} to={`/owners/${pet.ownerId}`}>
                    <strong>{pet.ownerName}</strong>
                  </Link>
                ) : (
                  <strong>{pet.ownerName}</strong>
                )}
              </span>
            </div>
          )}

          {/* Description */}
          <div className={styles.description}>
            <h3 className={styles.description__title}>About {pet.name}</h3>
            <p className={styles.description__text}>{pet.description}</p>
          </div>

          {/* ── CTA Buttons ── */}
          <div className={styles.actions}>
            {pet.status === "Available" ? (
              <>
                <button
                  className={`btn btn-primary ${styles.adoptBtn}`}
                  onClick={handleAdoptClick}
                >
                  <FaHeart size={14} />
                  {isLoggedIn ? "Apply to Adopt" : "Log In to Adopt"}
                </button>
                <button className={`btn btn-outline ${styles.saveBtn}`}>
                  <FaHeart size={14} /> Save
                </button>
              </>
            ) : (
              <div className={`badge ${status.cls}`} style={{ fontSize: "0.9rem", padding: "10px 20px" }}>
                {status.label}
              </div>
            )}
          </div>

          {/* Not logged in hint */}
          {!isLoggedIn && pet.status === "Available" && (
            <p className={styles.loginHint}>
              <Link to="/login">Log in</Link> or{" "}
              <Link to="/register">create an account</Link> to apply for adoption.
            </p>
          )}
        </div>
      </div>

      {/* Adoption Request Modal */}
      <AdoptionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        pet={pet}
      />

      {/* Reviews */}
      <div className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
          <hr className={styles.reviewsSeparator} />
          <h2 className={styles.reviewsTitle}>Reviews for Owner :  <span className={styles.reviewsOwnerName}>{pet.ownerName}</span> </h2>
          {/* {pet.ownerName ? (
            <span className={styles.reviewsSubtitle}>for </span>
          ) : null} */}
        </div>

        {canReview && (
          <ReviewForm
            petId={pet.petId}
            petName={pet.name}
            onCreated={() => loadReviews(pet.ownerId)}
          />
        )}

        {!canReview && isLoggedIn && isAdopter && (
          <div className={styles.reviewHint}>
            {checkingEligibility
              ? "Checking if you can leave a review..."
              : "You can leave a review after a successful adoption from this shelter."}
          </div>
        )}

        {loadingReviews ? (
          <div className={styles.reviewListEmpty}>Loading reviews...</div>
        ) : ownerReviews.length === 0 ? (
          <div className={styles.reviewListEmpty}>No reviews yet.</div>
        ) : (
          <div className={styles.reviewList}>
            {ownerReviews.map((rev) => (
              <div key={rev.reviewId} className={styles.reviewCard}>
                <div className={styles.reviewTopRow}>
                  <div className={styles.reviewStars} aria-label={`${rev.rating} stars`}>
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`${styles.reviewStar} ${i < rev.rating ? styles.reviewStarActive : ""}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className={styles.reviewMeta}>
                    <span className={styles.reviewAuthor}>{rev.reviewerName}</span>
                    <span className={styles.reviewDot}>•</span>
                    <span className={styles.reviewDate}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {rev.comment ? <p className={styles.reviewComment}>{rev.comment}</p> : null}
                <div className={styles.reviewPetLine}>Adopted: {rev.petName}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PetDetailPage;
