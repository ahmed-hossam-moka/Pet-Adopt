import api from "../api/axiosInstance";

export async function getOwnerReviewsSummary(ownerId, page = 1, pageSize = 10) {
  const response = await api.get(`/reviews/owner/${ownerId}`, {
    params: { page, pageSize },
  });

  const payload = response.data?.data; // OwnerReviewsDto (likely)
  const paged = payload?.reviews || payload?.Reviews || payload;

  const normalizedPaged =
    paged && typeof paged === "object"
      ? {
          ...paged,
          items: paged.items ?? paged.Items ?? [],
          totalCount: paged.totalCount ?? paged.TotalCount,
          currentPage: paged.currentPage ?? paged.CurrentPage,
          pageSize: paged.pageSize ?? paged.PageSize,
          totalPages: paged.totalPages ?? paged.TotalPages,
          hasNextPage: paged.hasNextPage ?? paged.HasNextPage,
          hasPreviousPage: paged.hasPreviousPage ?? paged.HasPreviousPage,
        }
      : paged;

  return {
    ownerId: payload?.ownerId ?? payload?.OwnerId ?? ownerId,
    ownerName: payload?.ownerName ?? payload?.OwnerName ?? "Owner",
    isApproved: payload?.isApproved ?? payload?.IsApproved,
    isActive: payload?.isActive ?? payload?.IsActive,
    joinedIn: payload?.joinnedIn ?? payload?.JoinnedIn,
    reviews: normalizedPaged,
  };
}

export async function getOwnerReviews(ownerId, page = 1, pageSize = 10) {
  const response = await api.get(`/reviews/owner/${ownerId}`, {
    params: { page, pageSize }
  });
  // Backend returns: OwnerReviewsDto { ownerId, ownerName, ..., reviews: PagedResult<ReviewResponseDto> }
  // Unwrap the nested paged result, and normalize casing differences.
  const payload = response.data?.data;
  const paged = payload?.reviews || payload?.Reviews || payload;

  if (paged && typeof paged === "object") {
    return {
      ...paged,
      items: paged.items ?? paged.Items ?? [],
      totalCount: paged.totalCount ?? paged.TotalCount,
      currentPage: paged.currentPage ?? paged.CurrentPage,
      pageSize: paged.pageSize ?? paged.PageSize,
      totalPages: paged.totalPages ?? paged.TotalPages,
      hasNextPage: paged.hasNextPage ?? paged.HasNextPage,
      hasPreviousPage: paged.hasPreviousPage ?? paged.HasPreviousPage,
    };
  }

  return paged;
}

export async function createReview(reviewData) {
  const response = await api.post("/reviews", reviewData);
  return response.data;
}
