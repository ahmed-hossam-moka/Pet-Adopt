/*
  ADOPTION MODAL
  ───────────────
  A popup dialog for submitting an adoption request.

  WHAT IS A MODAL?
  ─────────────────
  A modal is a dialog overlay that appears on top of the current page
  without navigating away. The background is dimmed to focus attention.

  The user fills:
    • A personal message to the shelter (optional)
  Then clicks "Submit Request".

  STRUCTURE:
    • Overlay (dark backdrop) — clicking it closes the modal
    • Modal card
      • Pet name + image
      • Message textarea
      • Submit / Cancel buttons

  HOW MODALS WORK IN REACT:
  ──────────────────────────
  We conditionally render the modal based on an `isOpen` prop.
  Parent controls open/close by changing state:

    const [modalOpen, setModalOpen] = useState(false);
    <AdoptionModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      pet={pet}
    />

  PORTAL (advanced concept, not used here for simplicity):
  In production, modals are often rendered with ReactDOM.createPortal()
  to attach them to document.body instead of the component tree.
  This avoids z-index / overflow issues. For this project,
  we handle z-index in CSS which is sufficient.
*/

import { useState } from "react";
import { FaTimes, FaHeart, FaPaw } from "react-icons/fa";
import toast from "react-hot-toast";

import { submitAdoptionRequest } from "../../services/adoptionService";
import styles from "./AdoptionModal.module.css";

function AdoptionModal({ isOpen, onClose, pet }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Don't render anything when modal is closed
  if (!isOpen || !pet) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await submitAdoptionRequest(pet.petId, message.trim());
      toast.success(`Adoption request for ${pet.name} submitted! 🐾`);
      setMessage("");    // reset form
      onClose();         // close modal
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit request.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  // Close modal when clicking the dark backdrop
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    /*
      The overlay is position: fixed and covers the whole screen.
      Clicking the overlay (but NOT the modal card) calls onClose().
      We check e.target === e.currentTarget to ensure we only
      react to clicks on the overlay, not on the card inside it.
    */
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>

        {/* Close button (top-right X) */}
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close modal"
        >
          <FaTimes />
        </button>

        {/* Modal Header */}
        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <FaHeart />
          </div>
          <h2 className={styles.title}>Apply to Adopt</h2>
          <p className={styles.subtitle}>You're applying to adopt:</p>
        </div>

        {/* Pet summary */}
        <div className={styles.petRow}>
          <img
            src={pet.primaryImageUrl || "https://placedog.net/80/80?random"}
            alt={pet.name}
            className={styles.petImg}
            onError={(e) => { e.target.src = "https://placedog.net/80/80?random"; }}
          />
          <div>
            <p className={styles.petName}>{pet.name}</p>
            <p className={styles.petMeta}>
              {pet.animalType} · {pet.breed} · {pet.location}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label htmlFor="adopt-message" className="form-label">
              Message to the Shelter <span className={styles.optional}>(optional)</span>
            </label>
            <textarea
              id="adopt-message"
              className={`form-input ${styles.textarea}`}
              placeholder="Tell the shelter about yourself — your home environment, experience with pets, why you want to adopt this pet..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              maxLength={500}
            />
            <span className={styles.charCount}>{message.length}/500</span>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <><span className={styles.spinner} /> Submitting...</>
              ) : (
                <><FaPaw size={13} /> Submit Request</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdoptionModal;
