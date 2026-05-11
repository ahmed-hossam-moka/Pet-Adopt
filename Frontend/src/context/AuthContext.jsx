/*
  ╔══════════════════════════════════════════════════════════╗
  ║              AUTH CONTEXT — THE GLOBAL BRAIN             ║
  ╚══════════════════════════════════════════════════════════╝

  WHAT IS THE CONTEXT API?
  ─────────────────────────
  Imagine you have user data (name, role, token) that MANY
  components need — Navbar, ProtectedRoute, Dashboard, etc.

  Without Context, you'd have to pass props through every
  level of the component tree:
      App → Layout → Navbar → UserMenu → ...  (PROP DRILLING 😩)

  With Context, you create a "global store" that ANY component
  can read from directly, no matter how deep it is.

  HOW IT WORKS (3 steps):
  ─────────────────────────
  1. createContext()        → creates the "store" container
  2. <AuthContext.Provider> → wraps the app, provides the value
  3. useContext(AuthContext) → any component reads from the store

  WHAT WE STORE:
  ─────────────────────────
  • user   → { id, name, email, role, ... } or null if not logged in
  • token  → the JWT string or null
  • login(token) → called after successful login API call
  • logout()     → clears everything

  WHERE IS THE TOKEN STORED?
  ─────────────────────────
  localStorage — this survives page refresh.
  When the app first loads, we check localStorage and
  restore the session automatically.
*/

import { createContext, useState, useCallback } from "react";

// ─── 1. Create the context container ──────────────────────────
// We export this so our custom hook (useAuth) can read from it.
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

// ─── 2. Helper: decode JWT payload ────────────────────────────
/*
  A JWT looks like: xxxxx.yyyyy.zzzzz
  The middle part (yyyyy) is Base64-encoded JSON containing
  the user data the backend embedded when it created the token.

  We decode it to extract: id, name, email, role, expiry, etc.
  We do NOT need the backend to call a separate "get profile" endpoint
  just to know who the user is — it's all in the token.
*/
function decodeToken(token) {
  try {
    const payload = token.split(".")[1];          // grab middle part
    const decoded = atob(payload);               // Base64 decode
    return JSON.parse(decoded);                  // parse JSON
  } catch {
    return null;
  }
}

// ─── 3. Helper: check if token is expired ─────────────────────
function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  // exp is in seconds, Date.now() is in milliseconds
  return decoded.exp * 1000 < Date.now();
}

// ─── 4. Helper: build user object from JWT payload ────────────
/*
  .NET Identity JWT claims use long URIs as keys, e.g.:
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
  We normalize them to simple keys: name, email, role, id
*/
function buildUserFromToken(token) {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    id:       decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
              || decoded.sub
              || decoded.nameid
              || decoded.id,

    name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
              || decoded.name
              || decoded.unique_name
              || "User",

    email:    decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]
              || decoded.email,

    role:     decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
              || decoded.role
              || "Adopter",
  };
}

// ─── 5. AuthProvider component ────────────────────────────────
export function AuthProvider({ children }) {

  // Initialize state FROM localStorage (restores session on refresh)
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem("petadopt_token");
    if (saved && !isTokenExpired(saved)) return saved;
    // Token exists but is expired — clean it up
    localStorage.removeItem("petadopt_token");
    localStorage.removeItem("petadopt_user");
    return null;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("petadopt_token");
    if (saved && !isTokenExpired(saved)) return buildUserFromToken(saved);
    return null;
  });

  const [loading, setLoading] = useState(false);

  /*
    LOGIN FUNCTION
    ─────────────
    Called by LoginPage after successful API response.
    Receives the raw JWT token string.
    1. Saves token to localStorage (persists across page refresh)
    2. Decodes token → builds user object
    3. Updates state → triggers re-render everywhere
  */
  const login = useCallback((newToken) => {
    const userObj = buildUserFromToken(newToken);
    localStorage.setItem("petadopt_token", newToken);
    setToken(newToken);
    setUser(userObj);
  }, []);

  /*
    LOGOUT FUNCTION
    ─────────────
    Clears everything from state and localStorage.
  */
  const logout = useCallback(() => {
    localStorage.removeItem("petadopt_token");
    localStorage.removeItem("petadopt_user");
    setToken(null);
    setUser(null);
  }, []);

  /*
    UPDATE USER (for profile edits)
    ────────────────────────────────
    When user changes their name in ProfilePage,
    we update the user state so Navbar shows the new name immediately.
  */
  const updateUser = useCallback((updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  }, []);

  // Convenience helpers (read-only derived values)
  const isLoggedIn  = !!token && !!user;
  const isAdmin     = user?.role === "Admin";
  const isShelter   = user?.role === "Shelter" || user?.role === "PetOwner";
  const isAdopter   = user?.role === "Adopter";

  // The value object — everything any component can access
  const value = {
    user,
    token,
    loading,
    setLoading,
    login,
    logout,
    updateUser,
    isLoggedIn,
    isAdmin,
    isShelter,
    isAdopter,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
