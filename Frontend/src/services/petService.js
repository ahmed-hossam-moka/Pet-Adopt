/*
  PET SERVICE — Real API Layer
  ─────────────────────────────
  Replaces the old mock data from Phase 1.
  All functions now call the real backend.

  BACKEND ENDPOINTS:
  ──────────────────
  GET /api/pets                 → all approved pets (paginated)
  GET /api/pets/{id}            → single pet by ID
  GET /api/pets/search          → filtered search with query params

  PAGINATION:
  ──────────
  The backend supports pagination via ?page=1&pageSize=12
  The response is a PagedResult<PetResponseDto>:
  {
    items:       [ { petId, name, animalType, breed, ... } ],
    totalCount:  48,
    currentPage: 1,
    pageSize:    12,
    totalPages:  4,
    hasNextPage: true,
    hasPreviousPage: false
  }

  SEARCH ENDPOINT PARAMS:
  ──────────────────────
  ?animalType=Dog
  ?breed=Husky
  ?maxAge=24          ← in months
  ?location=Cairo
  ?page=1
  ?pageSize=12

  All wrapped in { success, message, data: <PagedResult> }
  so we always call response.data.data to unwrap.
*/

import api from "../api/axiosInstance";

// ─── Get all approved pets (paginated) ────────────────────────
export async function getAllPets(page = 1, pageSize = 10) {
  const response = await api.get("/pets", {
    params: { page, pageSize },
  });
  return response.data.data; // PagedResult<PetResponseDto>
}

// ─── Search / filter pets ──────────────────────────────────────
/*
  filters = {
    animalType: "Dog" | "Cat" | ... | undefined,
    breed:      "Husky" | ... | undefined,
    maxAge:     24 | undefined,
    location:   "Cairo" | undefined,
  }
*/
export async function searchPets(filters = {}, page = 1, pageSize = 10) {
  // Build params — only include non-empty values
  const params = { page, pageSize };
  if (filters.animalType) params.animalType = filters.animalType;
  if (filters.breed)      params.breed      = filters.breed;
  if (filters.maxAge)     params.maxAge     = filters.maxAge;
  if (filters.location)   params.location   = filters.location;

  const response = await api.get("/pets/search", { params });
  return response.data.data; // PagedResult<PetResponseDto>
}

// ─── Get single pet by ID ──────────────────────────────────────
export async function getPetById(id) {
  const response = await api.get(`/pets/${id}`);
  return response.data.data; // PetResponseDto
}

// ─── SHELTER / PET OWNER FUNCTIONS ────────────────────────────

// Get pets belonging to the logged-in owner (Shelter or PetOwner)
export async function getMyPets() {
  const response = await api.get("/pets/my-pets");
  return response.data.data; // PetResponseDto[]
}

/*
  Create a new pet — requires Shelter or PetOwner role.
  Payload (CreatePetDto):
  {
    name, animalType, breed, age (months), gender,
    healthStatus, description, location, imageUrls: []
  }
  NOTE: Newly created pets have isApproved=false until Admin approves.
*/
export async function createPet(petData) {
  const response = await api.post("/pets", petData);
  return response.data.data;
}

// Update a pet — owner only
export async function updatePet(id, petData) {
  const response = await api.put(`/pets/${id}`, petData);
  return response.data;
}

// Soft-delete a pet — owner only
export async function deletePet(id) {
  const response = await api.delete(`/pets/${id}`);
  return response.data;
}