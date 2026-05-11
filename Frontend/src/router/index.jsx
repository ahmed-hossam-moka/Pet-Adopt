/*
  ROUTER — Updated for Phase 2
  ─────────────────────────────
  WHAT CHANGED:
  • Imported ProtectedRoute
  • Wrapped pages that require login with <ProtectedRoute>
  • Added allowedRoles for role-specific pages

  PROTECTED PAGES:
    /favorites      → Adopter only
    /profile        → any logged-in user
    /dashboard/shelter → Shelter / PetOwner only
    /dashboard/admin   → Admin only

  PUBLIC PAGES (no auth needed):
    /           → anyone
    /browse     → anyone (per requirements)
    /pets/:id   → anyone
    /login      → guests only (but logged-in users can visit too)
    /register   → guests only

  GUEST-ONLY REDIRECT:
    If a logged-in user visits /login or /register, we could
    redirect them to home. We handle this inside LoginPage itself.
*/

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Layout        from "../components/layout/Layout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import HomePage         from "../pages/HomePage";
import BrowsePage       from "../pages/BrowsePage";
import PetDetailPage    from "../pages/PetDetailPage";
import LoginPage        from "../pages/LoginPage";
import RegisterPage     from "../pages/RegisterPage";
import FavoritesPage    from "../pages/FavoritesPage";
import ProfilePage      from "../pages/ProfilePage";
import OwnerProfilePage from "../pages/OwnerProfilePage";
import ShelterDashboard from "../pages/shelter/ShelterDashboard";
import AdminDashboard   from "../pages/admin/AdminDashboard";
import AdopterDashboard from "../pages/adopter/AdopterDashboard";
import NotFoundPage     from "../pages/NotFoundPage";

function RootLayout() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1a24",
            color: "#f1f0f5",
            border: "1px solid #2e2e40",
            borderRadius: "12px",
            fontSize: "0.875rem",
          },
          success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
          error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
      <Layout>
        <Outlet />
      </Layout>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // ── Public routes ────────────────────────────────────
      { index: true,    element: <HomePage /> },
      { path: "browse", element: <BrowsePage /> },
      { path: "pets/:id", element: <PetDetailPage /> },
      { path: "owners/:ownerId", element: <OwnerProfilePage /> },
      { path: "login",    element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },

      // ── Protected: any logged-in user ────────────────────
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },

      // ── Protected: Adopter only ───────────────────────────
      {
        path: "favorites",
        element: (
          <ProtectedRoute allowedRoles={["Adopter"]}>
            <FavoritesPage />
          </ProtectedRoute>
        ),
      },

      // ── Protected: Adopter only (Dashboard) ──────────────
      {
        path: "dashboard/adopter",
        element: (
          <ProtectedRoute allowedRoles={["Adopter"]}>
            <AdopterDashboard />
          </ProtectedRoute>
        ),
      },

      // ── Protected: Shelter / PetOwner only ───────────────
      {
        path: "dashboard/shelter",
        element: (
          <ProtectedRoute allowedRoles={["Shelter", "PetOwner"]}>
            <ShelterDashboard />
          </ProtectedRoute>
        ),
      },

      // ── Protected: Admin only ─────────────────────────────
      {
        path: "dashboard/admin",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },

      // ── 404 ──────────────────────────────────────────────
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
