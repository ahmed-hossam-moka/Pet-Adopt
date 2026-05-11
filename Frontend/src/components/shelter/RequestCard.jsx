/*
  REQUEST CARD
  ─────────────
  Displays a single adoption request for the shelter/pet owner to review.

  SHOWS:
  • Pet thumbnail + name
  • Adopter name + email
  • Status badge (Pending / Accepted / Rejected)
  • Message from the adopter
  • Date submitted
  • Accept / Reject buttons (only for Pending requests)

  PROPS:
    request   — AdoptionRequestResponseDto from the backend
    onAccept  — function(requestId) called when Accept is clicked
    onReject  — function(requestId) called when Reject is clicked
*/

import { FaCheck, FaTimes, FaUser, FaEnvelope, FaClock } from "react-icons/fa";
import styles from "./RequestCard.module.css";

// Format ISO date to readable string: "May 6, 2026"
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

// Status badge colors: Pending=yellow, Accepted=green, Rejected=red
const STATUS_MAP = {
  Pending:  { label: "Pending",  cls: styles.pending  },
  Accepted: { label: "Accepted", cls: styles.accepted },
  Rejected: { label: "Rejected", cls: styles.rejected },
};

function RequestCard({ request, onAccept, onReject }) {
  const {
    requestId,
    petName,
    petPrimaryImage,
    adopterName,
    adopterEmail,
    status,
    message,
    createdAt,
  } = request;

  const statusInfo = STATUS_MAP[status] || STATUS_MAP.Pending;
  const isPending  = status === "Pending";

  return (
    <div className={styles.card}>

      {/* Pet info row */}
      <div className={styles.petRow}>
        <img
          src={petPrimaryImage || "https://placedog.net/56/56?random"}
          alt={petName}
          className={styles.petImg}
          onError={(e) => { e.target.src = "https://placedog.net/56/56?random"; }}
        />
        <div className={styles.petInfo}>
          <p className={styles.petName}>{petName}</p>
          <p className={styles.date}>
            <FaClock size={10} /> {formatDate(createdAt)}
          </p>
        </div>
        {/* Status badge */}
        <span className={`${styles.badge} ${statusInfo.cls}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Adopter info */}
      <div className={styles.adopterInfo}>
        <span className={styles.infoItem}>
          <FaUser size={11} /> {adopterName}
        </span>
        <span className={styles.infoItem}>
          <FaEnvelope size={11} /> {adopterEmail}
        </span>
      </div>

      {/* Message from adopter */}
      {message && (
        <p className={styles.message}>
          &ldquo;{message}&rdquo;
        </p>
      )}

      {/* Accept / Reject buttons — only shown for Pending requests */}
      {isPending && (
        <div className={styles.actions}>
          <button
            className={`btn btn-sm ${styles.acceptBtn}`}
            onClick={() => onAccept(requestId)}
          >
            <FaCheck size={11} /> Accept
          </button>
          <button
            className={`btn btn-sm ${styles.rejectBtn}`}
            onClick={() => onReject(requestId)}
          >
            <FaTimes size={11} /> Reject
          </button>
        </div>
      )}
    </div>
  );
}

export default RequestCard;
