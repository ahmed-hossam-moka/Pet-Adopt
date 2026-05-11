/*
  usePets — Custom Data-Fetching Hook
  ──────────────────────────────────────
  WHAT IS THIS?
  ─────────────
  A reusable hook that handles the full lifecycle of fetching pets:
    • loading state → show skeleton cards
    • data state    → show pet grid
    • error state   → show error message
    • refetch()     → re-run the fetch when filters change

  WHY PUT THIS IN A HOOK INSTEAD OF THE COMPONENT?
  ──────────────────────────────────────────────────
  Without this hook, BrowsePage would be a mess of interleaved
  data-fetching logic mixed with UI rendering.

  With this hook, BrowsePage stays clean:
    const { pets, loading, error, totalPages } = usePets(filters, page);

  And this hook can be reused anywhere (HomePage featured pets, etc.)

  HOW useEffect WORKS:
  ──────────────────────
  useEffect(() => {
    // This runs AFTER the component renders
    fetchData();
  }, [dependency1, dependency2]);
  //  ↑ dependency array: re-runs whenever these values change

  So whenever `filters` or `page` changes, the effect re-runs
  and fetches fresh data automatically.

  THE CLEANUP FUNCTION:
  ──────────────────────
  There's a subtle bug in data fetching: if the user changes
  filters quickly (types fast in search), multiple requests fire.
  The responses can arrive out of order — an old response
  might overwrite a newer one. This is called a "race condition".

  We fix it with an AbortController that cancels the in-flight
  request when a new one starts.

  USAGE:
  ──────
  const { pets, loading, error, meta, refetch } = usePets(filters, page);
*/

import { useState, useEffect, useCallback } from "react";
import { getAllPets, searchPets } from "../services/petService";

function usePets(filters = {}, page = 1, pageSize = 10) {
  const [pets, setPets]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  // Pagination metadata from backend
  const [meta, setMeta] = useState({
    totalCount:      0,
    totalPages:      1,
    currentPage:     1,
    hasNextPage:     false,
    hasPreviousPage: false,
  });

  /*
    hasActiveFilters — checks if the user has set any filter.
    If no filters are active, we call getAllPets() (simpler).
    If filters are active, we call searchPets() (with query params).
  */
  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== "" && v !== null && v !== undefined
  );

  // Serialize filters so it can be safely used in the dependency array
  const serializedFilters = JSON.stringify(filters);

  const fetchPets = useCallback(async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const result = hasActiveFilters
        ? await searchPets(filters, page, pageSize)
        : await getAllPets(page, pageSize);

      // Abort check: if a newer request already cancelled this one, stop
      if (signal?.aborted) return;

      setPets(result.items || []);
      setMeta({
        totalCount:      result.totalCount,
        totalPages:      result.totalPages,
        currentPage:     result.currentPage,
        hasNextPage:     result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
      });
    } catch {
      if (signal?.aborted) return; // ignore errors from cancelled requests
      setError("Failed to load pets. Please try again.");
      setPets([]);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedFilters, page, pageSize, hasActiveFilters]);
  // ↑ serializedFilters because objects aren't equal by reference

  useEffect(() => {
    const controller = new AbortController(); // cancel token
    // eslint-disable-next-line
    fetchPets(controller.signal);

    // Cleanup: cancel the request if the component unmounts
    // or if filters/page change before the request finishes
    return () => controller.abort();
  }, [fetchPets]);

  return { pets, loading, error, meta, refetch: fetchPets };
}

export default usePets;
