/*
  FAVORITES PAGE — Local state + explicit heart handler
  ──────────────────────────────────────────────────────
  Instead of trying to sync with FavoritesContext reactively,
  this page:
    1. Fetches its own `pets` array from the API on mount
    2. Passes a custom `onHeartClick` to PetGrid/PetCard
    3. When the heart is clicked, handleRemove() runs:
         → filters the local array immediately (pet disappears)
         → calls toggleFavorite() from context (updates IDs Set + API)

  WHY THIS APPROACH?
  ───────────────────
  PetCard calls different handlers depending on the page:
    BrowsePage / HomePage → toggleFavorite() from context (default)
    FavoritesPage         → handleRemove() + toggleFavorite() (custom)

  This is clean and explicit — no sync effects, no stale closures.
*/

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaSearch } from "react-icons/fa";

import { getMyFavorites } from "../services/favoriteService";
import { useFavorites } from "../context/FavoritesContext";
import PetGrid from "../components/pet/PetGrid";
import styles from "./FavoritesPage.module.css";

function FavoritesPage() {
  const { toggleFavorite } = useFavorites();

  const [pets, setPets]       = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the full pet objects once when the page opens
  useEffect(() => {
    // eslint-disable-next-line
    setLoading(true);
    getMyFavorites()
      .then((data) => {
        setPets(data || []);
        setLoading(false);
      })
      .catch(() => {
        setPets([]);
        setLoading(false);
      });
  }, []);

  /*
    handleRemove — called when the heart is clicked on THIS page.

    Step 1: Remove the pet from the local array immediately (instant UI).
    Step 2: Call toggleFavorite from context (updates the IDs Set + API).

    We DON'T wait for the API — it's instant from the user's view.
    If the API fails, toggleFavorite's rollback will handle the Set,
    but the local array stays filtered (acceptable trade-off).
  */
  function handleRemove(petId) {
    // Step 1 — remove from local list immediately
    setPets((prev) => prev.filter((p) => p.petId !== petId));
    // Step 2 — update context IDs Set + call DELETE API
    toggleFavorite(petId);
  }

  return (
    <div className="page-wrapper container fade-in-up">

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className="section-title">
            <FaHeart className={styles.headerIcon} /> My Favorites
          </h1>
          {!loading && pets.length > 0 && (
            <p className={styles.count}>
              {pets.length} saved pet{pets.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Link to="/browse" className="btn btn-outline btn-sm">
          <FaSearch size={12} /> Browse More
        </Link>
      </div>

      {/* Grid / Empty / Loading */}
      {loading ? (
        <PetGrid pets={[]} loading={true} skeletonCount={4} />
      ) : pets.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.empty__icon}>💔</div>
          <h2 className={styles.empty__title}>No favorites yet</h2>
          <p className={styles.empty__text}>
            Click the ❤️ heart on any pet to save them here.
          </p>
          <Link to="/browse" className="btn btn-primary">
            Browse Pets
          </Link>
        </div>
      ) : (
        /*
          We pass onHeartClick={handleRemove}.
          PetGrid passes it to every PetCard.
          PetCard uses it instead of the default toggleFavorite.
        */
        <PetGrid pets={pets} loading={false} onHeartClick={handleRemove} />
      )}
    </div>
  );
}

export default FavoritesPage;
