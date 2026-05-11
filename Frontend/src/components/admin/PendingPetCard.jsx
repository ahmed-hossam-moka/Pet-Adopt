/*
  PENDING PET CARD
  ─────────────────
  Card used exclusively in the Admin Dashboard to review pet listings.
  Shows full pet details and large Approve/Reject action buttons.
*/

import { FaCheck, FaTimes, FaMapMarkerAlt, FaHeartbeat } from "react-icons/fa";
import styles from "./PendingPetCard.module.css";

function PendingPetCard({ pet, onApprove, onReject }) {
  const {
    petId,
    name,
    animalType,
    breed,
    age, // in months
    gender,
    healthStatus,
    description,
    location,
    primaryImageUrl,
  } = pet;

  // Format age
  const ageDisplay =
    age < 12 ? `${age} months` : `${Math.floor(age / 12)} yrs ${age % 12} mo`;

  return (
    <div className={styles.card}>
      <img
        src={primaryImageUrl || "https://placedog.net/400/300?random"}
        alt={name}
        className={styles.image}
        onError={(e) => { e.target.src = "https://placedog.net/400/300?random"; }}
      />
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{name}</h3>
          <span className={styles.typeBadge}>{animalType}</span>
        </div>

        <div className={styles.metaRow}>
          <span>{breed}</span>
          <span>•</span>
          <span>{gender}</span>
          <span>•</span>
          <span>{ageDisplay}</span>
        </div>

        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <FaMapMarkerAlt /> {location}
          </div>
          <div className={styles.infoItem}>
            <FaHeartbeat /> {healthStatus}
          </div>
        </div>

        <div className={styles.description}>
          <p>{description}</p>
        </div>

        <div className={styles.actions}>
          <button className={`btn ${styles.approveBtn}`} onClick={() => onApprove(petId)}>
            <FaCheck size={12} /> Approve
          </button>
          <button className={`btn ${styles.rejectBtn}`} onClick={() => onReject(petId)}>
            <FaTimes size={12} /> Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default PendingPetCard;
