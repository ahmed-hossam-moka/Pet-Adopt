/*
  PROTECTED ROUTE — The Security Guard
  ──────────────────────────────────────
  WHAT IS IT?
  ────────────
  A ProtectedRoute is a wrapper component that checks if the user
  is authenticated before allowing access to a page.

  If logged in  → renders the page normally
  If NOT logged in → redirects to /login immediately

  HOW DO WE USE IT?
  ──────────────────
  In the router, instead of:
    { path: "favorites", element: <FavoritesPage /> }

  We wrap it:
    { path: "favorites", element: <ProtectedRoute><FavoritesPage /></ProtectedRoute> }

  Now if a user manually types /favorites in the URL bar without
  being logged in, they get sent to /login automatically.

  ROLE-BASED PROTECTION:
  ─────────────────────
  We can also protect by ROLE:
    <ProtectedRoute allowedRoles={["Admin"]}>
      <AdminDashboard />
    </ProtectedRoute>

  If an Adopter tries to access /dashboard/admin, they get
  redirected to / (home page) instead.

  WHAT IS <Navigate>?
  ─────────────────────
  <Navigate to="/login" /> is a special React Router component
  that immediately redirects to another page when it renders.
  It's like doing navigate("/login") but as a JSX element.

  The "replace" prop replaces the current history entry so
  the user can't click "back" to return to the protected page.

  The "state={{ from: location }}" saves WHERE the user was trying
  to go, so after login we can redirect them back there.
*/

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function ProtectedRoute({ children, allowedRoles }) {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation(); // current URL path

  // 1. Not logged in at all → send to login, remember where they came from
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. Logged in but wrong role → send to home
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  // 3. All good → render the protected page
  return children;
}

export default ProtectedRoute;
