/*
  BROWSE PAGE — Full Phase 3 Implementation
  ──────────────────────────────────────────
  This is the most feature-rich page so far. It has:

  1. FILTER BAR — Type pills + Breed + Max Age + Location inputs
  2. SEARCH — reads ?q= from URL (typed in the Navbar SearchBar)
  3. LIVE FILTERING — filters update as you change them
  4. PAGINATION — Previous / Next page buttons
  5. RESULT COUNT — "Showing 12 of 48 pets"
  6. LOADING SKELETONS — while data is fetching
  7. EMPTY STATE — when no pets match the filters
  8. ERROR STATE — when the API call fails

  KEY CONCEPTS IN THIS FILE:
  ──────────────────────────
  useSearchParams:
    Reads and writes URL query params (?q=golden, ?animalType=Dog)
    Similar to useState but synced with the URL bar.
    When the user shares the URL, filters are preserved.

  Debouncing:
    We don't fetch on EVERY keystroke (would be 1 API call per letter).
    We wait 500ms after the user stops typing before fetching.
    This is called "debouncing".

  Controlled form pattern (same as LoginPage):
    Each filter input has value+onChange controlled by React state.
*/

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import usePets from "../hooks/usePets";
import PetGrid from "../components/pet/PetGrid";
import styles from "./BrowsePage.module.css";

// Animal type filter options — must match backend AnimalType values
const ANIMAL_TYPES = [
  { label: "All",    value: "" },
  { label: "🐶 Dogs",  value: "Dog" },
  { label: "🐱 Cats",  value: "Cat" },
  { label: "🐦 Birds", value: "Bird" },
  { label: "🐰 Rabbits", value: "Rabbit" },
  { label: "✨ Other", value: "Other" },
];

function BrowsePage() {
  const [searchParams] = useSearchParams();
  // Read ?q= from URL (set by Navbar SearchBar)
  const urlQuery = searchParams.get("q") || "";

  // ── Filter State ────────────────────────────────────────────
  const [animalType, setAnimalType] = useState("");
  const [breed,      setBreed]      = useState(urlQuery); // initialize from URL
  const [maxAge,     setMaxAge]     = useState("");
  const [location,   setLocation]   = useState("");
  const [page,       setPage]       = useState(1);

  // Debounced filters — what actually gets sent to the API
  // We wait 500ms after the user stops typing before updating these
  const [debouncedFilters, setDebouncedFilters] = useState({
    animalType, breed: urlQuery, maxAge, location,
  });

  /*
    DEBOUNCE EFFECT
    ───────────────
    Every time any filter changes, we start a 500ms timer.
    If the filter changes again before 500ms, we cancel the timer
    and restart it. Only when 500ms passes without any change
    do we update debouncedFilters (which triggers the API call).

    This prevents sending an API request for every letter typed.
    Example: user types "golden" → 6 letters → without debounce = 6 API calls.
    With debounce = 1 API call after they stop typing.
  */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters({ animalType, breed, maxAge, location });
      setPage(1); // reset to page 1 whenever filters change
    }, 500);

    return () => clearTimeout(timer); // cleanup: cancel timer on next change
  }, [animalType, breed, maxAge, location]);

  // Sync animalType filter reset to page 1 immediately (no debounce needed for pills)
  const handleTypeChange = useCallback((value) => {
    setAnimalType(value);
    setPage(1);
  }, []);

  // ── Data Fetching via custom hook ───────────────────────────
  const { pets, loading, error, meta } = usePets(debouncedFilters, page);

  // ── Clear all filters ────────────────────────────────────────
  function clearFilters() {
    setAnimalType("");
    setBreed("");
    setMaxAge("");
    setLocation("");
    setPage(1);
  }

  const hasFilters = animalType || breed || maxAge || location;

  return (
    <div className="page-wrapper container fade-in-up">

      {/* ── Page Header ── */}
      <div className={styles.header}>
        <div>
          <h1 className="section-title">Browse Pets</h1>
          {!loading && (
            <p className={styles.count}>
              {meta.totalCount > 0
                ? `Showing ${pets.length} of ${meta.totalCount} pets`
                : "No pets found"}
            </p>
          )}
        </div>

        {/* Clear filters button */}
        {hasFilters && (
          <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
            <FaTimes size={12} /> Clear Filters
          </button>
        )}
      </div>

      {/* ── Filter Bar ── */}
      <div className={styles.filterBar}>

        {/* Animal type pills */}
        <div className={styles.typePills}>
          {ANIMAL_TYPES.map((t) => (
            <button
              key={t.value}
              className={`${styles.pill} ${animalType === t.value ? styles.pillActive : ""}`}
              onClick={() => handleTypeChange(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Text filters row */}
        <div className={styles.filterRow}>
          {/* Breed / Name search */}
          <div className={styles.filterInput}>
            <FaSearch className={styles.filterIcon} />
            <input
              type="text"
              placeholder="Search by breed or name..."
              className="form-input"
              style={{ paddingLeft: 36 }}
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            />
          </div>

          {/* Location */}
          <div className={styles.filterInput}>
            <span className={styles.filterIconText}>📍</span>
            <input
              type="text"
              placeholder="Location (e.g. Cairo)"
              className="form-input"
              style={{ paddingLeft: 36 }}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Max Age */}
          <div className={styles.filterInput} style={{ maxWidth: 180 }}>
            <span className={styles.filterIconText}>🎂</span>
            <select
              className="form-input"
              style={{ paddingLeft: 36 }}
              value={maxAge}
              onChange={(e) => setMaxAge(e.target.value)}
            >
              <option value="">Any Age</option>
              <option value="3">Under 3 months</option>
              <option value="6">Under 6 months</option>
              <option value="12">Under 1 year</option>
              <option value="24">Under 2 years</option>
              <option value="60">Under 5 years</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Error State ── */}
      {error && (
        <div className={styles.errorBox}>
          <p>⚠️ {error}</p>
          <button className="btn btn-outline btn-sm" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      )}

      {/* ── Pet Grid ── */}
      {!error && <PetGrid pets={pets} loading={loading} />}

      {/* ── Pagination ── */}
      {!loading && !error && meta.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={!meta.hasPreviousPage}
          >
            <FaChevronLeft size={12} /> Previous
          </button>

          <span className={styles.pageInfo}>
            Page {meta.currentPage} of {meta.totalPages}
          </span>

          <button
            className="btn btn-outline btn-sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!meta.hasNextPage}
          >
            Next <FaChevronRight size={12} />
          </button>
        </div>
      )}

    </div>
  );
}

export default BrowsePage;
