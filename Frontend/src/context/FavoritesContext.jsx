import { createContext, useState, useEffect, useCallback, useContext } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";
import {
  getMyFavorites,
  addToFavorites,
  removeFromFavorites,
} from "../services/favoriteService";

// eslint-disable-next-line react-refresh/only-export-components
export const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isLoggedIn, isAdopter } = useAuth();

  /*
    We store TWO things:
    1. favoritePets  — full pet objects { petId, name, primaryImageUrl, ... }
                       Used by FavoritesPage to render the grid.
    2. favoritedIds  — Set<number> of petIds
                       Used by every PetCard for instant O(1) heart lookups.

    Both are always in sync — we never update one without the other.
    This eliminates the "two sources of truth" problem.
  */
  const [favoritePets, setFavoritePets] = useState([]);
  const [favoritedIds, setFavoritedIds] = useState(new Set());
  const [loading, setLoading]           = useState(false);

  // Helper: sync both states from a full pet array
  function applyPets(pets) {
    setFavoritePets(pets);
    setFavoritedIds(new Set(pets.map((p) => p.petId)));
  }

  // Load favorites when user logs in (Adopters only)
  useEffect(() => {
    if (isLoggedIn && isAdopter) {
      // eslint-disable-next-line
      setLoading(true);
      getMyFavorites()
        .then(applyPets)
        .catch(() => applyPets([]))
        .finally(() => setLoading(false));
    } else {
      applyPets([]);
    }
  }, [isLoggedIn, isAdopter]);

  // O(1) lookup — used by every PetCard
  const isFavorite = useCallback(
    (petId) => favoritedIds.has(petId),
    [favoritedIds]
  );

  /*
    TOGGLE FAVORITE — OPTIMISTIC UPDATE
    ─────────────────────────────────────
    When adding: we don't have the full pet object locally.
    When removing: we can filter it out from favoritePets.

    For adding, the heart turns orange immediately, and the
    FavoritesPage will show the new pet on the next visit
    (it re-fetches on mount). This is acceptable UX.
  */
  const toggleFavorite = useCallback(
    async (petId, petObject = null) => {
      if (!isLoggedIn || !isAdopter) {
        toast.error("Please log in as an Adopter to save favorites.");
        return;
      }

      const alreadySaved = favoritedIds.has(petId);

      // ── OPTIMISTIC UPDATE ──────────────────────────────────
      if (alreadySaved) {
        // Remove: filter out from both states instantly
        setFavoritePets((prev) => prev.filter((p) => p.petId !== petId));
        setFavoritedIds((prev) => {
          const next = new Set(prev);
          next.delete(petId);
          return next;
        });
      } else {
        // Add: only update the ID set (we may not have the full object)
        // If petObject is passed (from PetDetailPage), add it to the array too
        setFavoritedIds((prev) => new Set([...prev, petId]));
        if (petObject) {
          setFavoritePets((prev) => [...prev, petObject]);
        }
      }

      // ── API CALL ──────────────────────────────────────────
      try {
        if (alreadySaved) {
          await removeFromFavorites(petId);
          toast.success("Removed from favorites");
        } else {
          await addToFavorites(petId);
          toast.success("Added to favorites ❤️");
        }
      } catch {
        // Revert: re-fetch the real state from the server
        getMyFavorites().then(applyPets).catch(() => {});
        toast.error("Failed to update favorites. Try again.");
      }
    },
    [isLoggedIn, isAdopter, favoritedIds]
  );

  const value = {
    favoritePets,   // full pet objects — used by FavoritesPage
    favoritedIds,   // Set<number>     — used by PetCard hearts
    isFavorite,
    toggleFavorite,
    loading,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be inside <FavoritesProvider>");
  return ctx;
}
