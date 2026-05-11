import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";

import { getOwnerReviewsSummary } from "../services/reviewService";
import EmptyState from "../components/ui/EmptyState";
import { Skeleton, SkeletonText } from "../components/ui/Skeleton";
import styles from "./OwnerProfilePage.module.css";

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString();
}

export default function OwnerProfilePage() {
  const { ownerId } = useParams();
  const navigate = useNavigate();

  const [ownerName, setOwnerName] = useState("Owner");
  const [joinedIn, setJoinedIn] = useState(null);
  const [isActive, setIsActive] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [pagedReviews, setPagedReviews] = useState({ items: [], totalCount: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const avgRating = useMemo(() => {
    const items = pagedReviews.items || [];
    if (!items.length) return null;
    const sum = items.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    return Math.round((sum / items.length) * 10) / 10;
  }, [pagedReviews.items]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!ownerId) return;
      setLoading(true);
      try {
        const summary = await getOwnerReviewsSummary(ownerId, page, pageSize);
        if (cancelled) return;
        setOwnerName(summary.ownerName || "Owner");
        setJoinedIn(summary.joinedIn || null);
        setIsActive(typeof summary.isActive === "boolean" ? summary.isActive : null);
        setPagedReviews(summary.reviews || { items: [], totalCount: 0, totalPages: 1 });
      } catch (err) {
        if (cancelled) return;
        toast.error("Failed to load owner profile.");
        setPagedReviews({ items: [], totalCount: 0, totalPages: 1 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [ownerId, page, pageSize]);

  const totalPages = pagedReviews.totalPages || 1;
  const totalCount = pagedReviews.totalCount || 0;

  return (
    <div className="page-wrapper container fade-in-up">
      <button className={`btn btn-ghost btn-sm ${styles.backBtn}`} onClick={() => navigate(-1)}>
        <FaArrowLeft size={13} /> Back
      </button>

      <div className={styles.headerCard}>
        <div className={styles.headerTop}>
          {loading ? (
            <Skeleton className={styles.titleSkeleton} />
          ) : (
            <h1 className={styles.title}>{ownerName}</h1>
          )}
          {isActive === false && <span className={`badge badge-gray ${styles.inactiveBadge}`}>Inactive</span>}
        </div>

        <div className={styles.metaRow}>
          {loading ? (
            <>
              <Skeleton className={styles.metaSk} />
              <Skeleton className={styles.metaSk} />
              <Skeleton className={styles.metaSk} />
            </>
          ) : (
            <>
              <span className={styles.metaItem}>
                <strong>{totalCount}</strong> reviews
              </span>
              {avgRating != null && (
                <span className={styles.metaItem}>
                  <FaStar className={styles.starIcon} /> <strong>{avgRating}</strong> avg
                </span>
              )}
              {formatDate(joinedIn) && (
                <span className={styles.metaItem}>Joined {formatDate(joinedIn)}</span>
              )}
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.card}>
              <Skeleton className={styles.starsSk} />
              <SkeletonText lines={3} />
              <Skeleton className={styles.petLineSk} />
            </div>
          ))}
        </div>
      ) : (pagedReviews.items || []).length === 0 ? (
        <EmptyState
          icon="⭐"
          title="No reviews yet"
          description="When adopters leave feedback after successful adoptions, it will appear here."
        />
      ) : (
        <div className={styles.grid}>
          {pagedReviews.items.map((rev) => (
            <div key={rev.reviewId} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.stars} aria-label={`${rev.rating} stars`}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`${styles.star} ${i < rev.rating ? styles.starActive : ""}`}>
                      ★
                    </span>
                  ))}
                </div>
                <div className={styles.cardMeta}>
                  <span className={styles.author}>{rev.reviewerName}</span>
                  <span className={styles.dot}>•</span>
                  <span className={styles.date}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {rev.comment ? <p className={styles.comment}>{rev.comment}</p> : null}
              <div className={styles.petLine}>Adopted: {rev.petName}</div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.pagination}>
        <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span className={styles.pageLabel}>
          Page <strong>{page}</strong> / {totalPages}
        </span>
        <button
          className="btn btn-outline btn-sm"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

