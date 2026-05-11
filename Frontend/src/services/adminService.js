/*
  ADMIN SERVICE
  ──────────────
  API endpoints for Admin moderation (approving/rejecting accounts and pets).

  ENDPOINTS:
    GET /api/admin/pending-users
    PUT /api/admin/approve-user/{id}
    PUT /api/admin/reject-user/{id}

    GET /api/admin/pending-pets
    PUT /api/admin/approve-pet/{id}
    PUT /api/admin/reject-pet/{id}
*/

import api from "../api/axiosInstance";

// ─── PENDING USERS (Accounts) ──────────────────────────────────

export async function getPendingUsers() {
  const response = await api.get("/admin/pending-users");
  return response.data.data; // Array of { id, name, email, createdAt }
}

export async function approveUser(userId) {
  const response = await api.put(`/admin/approve-user/${userId}`);
  return response.data;
}

export async function rejectUser(userId) {
  const response = await api.put(`/admin/reject-user/${userId}`);
  return response.data;
}

// ─── PENDING PETS ──────────────────────────────────────────────

export async function getPendingPets() {
  const response = await api.get("/admin/pending-pets");
  return response.data.data; // Array of PetResponseDto
}

export async function approvePet(petId) {
  const response = await api.put(`/admin/approve-pet/${petId}`);
  return response.data;
}

export async function rejectPet(petId) {
  const response = await api.put(`/admin/reject-pet/${petId}`);
  return response.data;
}
