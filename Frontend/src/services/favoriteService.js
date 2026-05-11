/*
  FAVORITE SERVICE
  ─────────────────
  All API calls related to the favorites system.

  ENDPOINTS:
    GET    /api/favorites          → list my favorite pets (Adopter only)
    POST   /api/favorites/{petId}  → add pet to favorites
    DELETE /api/favorites/{petId}  → remove pet from favorites

  The favorites response returns PetResponseDto objects
  (same shape as browse pets), so we can reuse PetCard directly.
*/

import api from "../api/axiosInstance";

// Get all my favorited pets
export async function getMyFavorites() {
  const response = await api.get("/favorites");
  // The backend returns an array of FavoriteResponseDto: { favoriteId, savedAt, pet: { ... } }
  // We map it to return just the inner pet objects, so it matches BrowsePage's data shape.
  return response.data.data.map((fav) => fav.pet);
}

// Add a pet to favorites
export async function addToFavorites(petId) {
  const response = await api.post(`/favorites/${petId}`);
  return response.data;
}

// Remove a pet from favorites
export async function removeFromFavorites(petId) {
  const response = await api.delete(`/favorites/${petId}`);
  return response.data;
}
