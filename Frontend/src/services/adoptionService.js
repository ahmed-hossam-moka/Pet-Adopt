/*
  ADOPTION SERVICE
  ─────────────────
  All API calls related to adoption requests and adopter history.

  ADOPTION REQUEST ENDPOINTS:
    POST /api/adoption/request          → submit request { petId, message? }
    GET  /api/adoption/my-requests      → my sent requests (Adopter)

  ADOPTER HISTORY ENDPOINTS:
    GET    /api/adopterhistory          → list my previous pet history
    POST   /api/adopterhistory          → add a history entry
    DELETE /api/adopterhistory/{id}     → delete a history entry

  WHY IS HISTORY NEEDED?
  ──────────────────────
  When an Adopter submits an adoption request, the shelter sees
  the adopter's "history" — previous pets they've owned, vet
  references, years of experience. This helps shelters decide
  who to approve. The history is attached to the adoption request
  response (AdoptionRequestResponseDto.AdopterHistories).
*/

import api from "../api/axiosInstance";

// ─── Adoption Requests ────────────────────────────────────────

/*
  Submit an adoption request
  PAYLOAD: { petId: 42, message: "I have a big yard..." }
*/
export async function submitAdoptionRequest(petId, message = "") {
  const response = await api.post("/adoption/request", { petId, message });
  return response.data;
}

/*
  Get my adoption requests as an Adopter
  Returns: AdoptionRequestResponseDto[]
*/
export async function getMyAdoptionRequests() {
  const response = await api.get("/adoption/my-requests");
  return response.data.data;
}

// ─── Adopter History ──────────────────────────────────────────

/*
  Get my pet ownership history
  Returns: AdopterHistoryResponseDto[]
  { historyId, previousPetName, previousPetType, veterinaryReference,
    experience, yearOfAdoption }
*/
export async function getMyHistory() {
  const response = await api.get("/adopterhistory");
  return response.data.data;
}

/*
  Add a history entry
  PAYLOAD:
  {
    previousPetName:      "Buddy",
    previousPetType:      "Dog",
    veterinaryReference:  "Dr. Ahmed - 01012345678",
    experience:           "5 years caring for large dogs",
    yearOfAdoption:       2019
  }
*/
export async function addHistory(historyData) {
  const response = await api.post("/adopterhistory", historyData);
  return response.data;
}

/*
  Delete a history entry by ID
*/
export async function deleteHistory(historyId) {
  const response = await api.delete(`/adopterhistory/${historyId}`);
  return response.data;
}
