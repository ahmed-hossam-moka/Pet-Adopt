/*
  AUTH SERVICE
  ─────────────
  This file contains all the functions that call the backend
  authentication endpoints.

  WHY SEPARATE THIS FROM THE COMPONENT?
  ──────────────────────────────────────
  This is the SERVICE LAYER pattern.
  Components should NOT directly call axios — they should call
  service functions. This way:
  • Components stay clean (only UI logic)
  • If the backend URL changes, you change it in ONE place
  • Easy to test / mock

  API ENDPOINTS (from backend README):
  ──────────────────────────────────────
  POST /api/auth/register   → create new account
  POST /api/auth/login      → returns JWT token
  GET  /api/user/profile    → get current user profile
  PUT  /api/user/profile    → update profile
  PUT  /api/user/change-password → change password
*/

import api from "../api/axiosInstance";

// ─── Register new user ──────────────────────────────────────
/*
  REGISTER PAYLOAD (what the backend expects):
  {
    name: "Nour Mohamed",
    email: "nour@example.com",
    password: "Secret123!",
    role: "Adopter"           ← "Adopter" | "Shelter" | "PetOwner"
  }

  RESPONSE STRUCTURE — the backend wraps EVERY response as:
  {
    success: true,
    message: "Registered successfully",
    data: { userId, name, email, role, token, tokenExpiration }
  }

  ⚠️  IMPORTANT: For Shelter / PetOwner roles, token is NULL.
  They must wait for Admin approval before they can log in.
  We return the full data object so the caller can check.
*/
export async function registerUser(userData) {
  const response = await api.post("/auth/register", userData);
  return response.data.data;   // ← unwrap the { success, message, data } wrapper
}

// ─── Login ──────────────────────────────────────────────────
/*
  LOGIN PAYLOAD:
  { email: "nour@example.com", password: "Secret123!" }

  RESPONSE: same wrapper → data.data.token = JWT string
*/
export async function loginUser(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data.data;   // ← unwrap: { userId, name, email, role, token }
}

// ─── Get my profile ─────────────────────────────────────────
/*
  The axiosInstance interceptor auto-attaches the Bearer token.
  Response wrapped as { success, message, data: { id, name, email, role } }
*/
export async function getMyProfile() {
  const response = await api.get("/user/profile");
  return response.data.data;   // unwrap
}

// ─── Update my profile ──────────────────────────────────────
/*
  PAYLOAD: { name: "...", phoneNumber: "..." }
*/
export async function updateMyProfile(profileData) {
  const response = await api.put("/user/profile", profileData);
  return response.data.data;   // unwrap
}

// ─── Change password ─────────────────────────────────────────
/*
  PAYLOAD: { currentPassword: "...", newPassword: "..." }
*/
export async function changePassword(passwordData) {
  const response = await api.put("/user/change-password", passwordData);
  return response.data;   // no data payload, just { success, message }
}
