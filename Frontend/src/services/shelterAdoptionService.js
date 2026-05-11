/*
  SHELTER ADOPTION SERVICE
  ─────────────────────────
  API functions for Shelter / PetOwner to manage incoming adoption requests.

  ENDPOINTS:
    GET /api/adoption/pet/{petId}/requests → get all requests for a specific pet
    PUT /api/adoption/request/{id}/accept  → accept a pending request
    PUT /api/adoption/request/{id}/reject  → reject a pending request

  RESPONSE SHAPE (AdoptionRequestResponseDto):
  {
    requestId:       1,
    petId:           42,
    petName:         "Rex",
    petPrimaryImage: "https://...",
    adopterId:       "guid",
    adopterName:     "Jane Doe",
    adopterEmail:    "jane@example.com",
    status:          "Pending" | "Accepted" | "Rejected",
    message:         "I have a big yard...",
    createdAt:       "2026-05-01T10:00:00",
    adopterHistories: [...]
  }

  NOTE: The backend automatically changes pet status to "Adopted"
  when a request is Accepted, and cancels all other pending requests for that pet.
*/

import api from "../api/axiosInstance";

// Get all adoption requests for a specific pet (owner must own the pet)
export async function getRequestsByPet(petId) {
  const response = await api.get(`/adoption/pet/${petId}/requests`);
  return response.data.data; // AdoptionRequestResponseDto[]
}

// Accept a pending adoption request
export async function acceptRequest(requestId) {
  const response = await api.put(`/adoption/request/${requestId}/accept`);
  return response.data;
}

// Reject a pending adoption request
export async function rejectRequest(requestId) {
  const response = await api.put(`/adoption/request/${requestId}/reject`);
  return response.data;
}
