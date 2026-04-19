using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAdopt.BLL.DTOs.Review;
using PetAdopt.BLL.Services.Interfaces;
using PetAdopt.DAL.Pagination;

namespace PetAdopt.API.Controllers;

public class ReviewsController : BaseController
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    // POST api/reviews
    [HttpPost]
    [Authorize(Roles = "Adopter")]
    public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto dto)
    {

        await _reviewService.CreateReviewAsync(dto, GetCurrentUserId());
        return Success(null, "Review submitted successfully");
    }

    // GET api/reviews/owner/{ownerId}
    [HttpGet("owner/{ownerId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetOwnerReviews(string ownerId, [FromQuery] PaginationParams param)
    {

        var reviews = await _reviewService.GetOwnerReviewsAsync(ownerId, param);
        return Success(reviews);
    }
}
