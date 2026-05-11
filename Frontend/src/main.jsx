/*
  MAIN.JSX — App Entry Point
  ───────────────────────────
  This is the very first file React runs.
  It mounts the entire React app into the <div id="root"> in index.html.

  WHAT CHANGED FROM PHASE 1:
  ───────────────────────────
  We now wrap <App /> with <AuthProvider>.
  
  WHY WRAP HERE AND NOT INSIDE App.jsx?
  ──────────────────────────────────────
  AuthProvider must be the OUTERMOST wrapper so that every
  single component in the tree (including the Router itself)
  can access auth state.

  If we put AuthProvider inside the Router, the Router would
  mount before AuthProvider, and some components might try
  to read auth context before it's ready.

  THE CORRECT ORDER:
    AuthProvider          ← knows who's logged in
      └── AppRouter       ← handles URL routing  
           └── RootLayout ← wraps pages with Navbar/Footer
                └── Pages ← actual page components
*/

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/*
      Provider order matters:
      AuthProvider must be outermost — FavoritesProvider reads from AuthContext.
      FavoritesProvider must wrap App — so all PetCards can read favorites state.
    */}
    <AuthProvider>
      <SocketProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </SocketProvider>
    </AuthProvider>
  </StrictMode>
);