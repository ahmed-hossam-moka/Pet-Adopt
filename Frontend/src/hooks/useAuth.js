/*
  useAuth — CUSTOM HOOK
  ─────────────────────
  WHAT IS A CUSTOM HOOK?
  ──────────────────────
  A custom hook is a regular function whose name starts with "use"
  and calls other React hooks inside it.

  WHY CREATE THIS?
  ──────────────────
  Without this hook, every component that needs auth data would write:
    import { useContext } from "react";
    import { AuthContext } from "../context/AuthContext";
    const { user, login, logout } = useContext(AuthContext);

  With this hook, any component writes just ONE line:
    import { useAuth } from "../hooks/useAuth";
    const { user, login, logout } = useAuth();

  It also gives us a safety net: if someone uses useAuth()
  outside of the AuthProvider wrapper, we throw a clear error
  instead of a confusing "cannot read property of undefined".

  USAGE EXAMPLE (in any component):
  ──────────────────────────────────
    import { useAuth } from "../hooks/useAuth";

    function Navbar() {
      const { user, isLoggedIn, logout } = useAuth();
      return isLoggedIn ? <p>Hello {user.name}</p> : <LoginButton />
    }
*/

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth() must be used inside <AuthProvider>. " +
      "Make sure AuthProvider wraps your app in main.jsx."
    );
  }

  return context;
}
