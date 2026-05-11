/*
  APP.JSX — The Root Component
  -----------------------------
  This is the entry point of your React app.
  Previously it just rendered <HomePage /> directly.

  Now it renders <AppRouter /> which handles ALL pages.

  In Phase 2, we'll wrap this with <AuthContextProvider>
  so every component can access the logged-in user.
*/

import AppRouter from "./router";
import ErrorBoundary from "./components/ui/ErrorBoundary";

export function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
}
