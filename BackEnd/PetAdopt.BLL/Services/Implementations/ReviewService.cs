using Microsoft.AspNetCore.Identity;
using PetAdopt.BLL.DTOs.Review;
using PetAdopt.BLL.Services.Interfaces;
using PetAdopt.DAL.Models;
using PetAdopt.DAL.Pagination;
using PetAdopt.DAL.Repositories.Interfaces;

namespace PetAdopt.BLL.Services.Implementations
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IAdoptionRequestRepository _requestRepository;
        private readonly IPetRepository _petRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public ReviewService(
            IReviewRepository reviewRepository,
            IAdoptionRequestRepository requestRepository,
            IPetRepository petRepository,
            UserManager<ApplicationUser> userManager)
        {
            _reviewRepository = reviewRepository;
            _requestRepository = requestRepository;
            _petRepository = petRepository;
            _userManager = userManager;
        }

        public async Task<bool> CreateReviewAsync(
            CreateReviewDto dto, string reviewerId)
        {
            if (dto.Rating < 1 || dto.Rating > 5)
                throw new Exception("Rating must be between 1 and 5");

            var acceptedRequest = await _requestRepository
                .GetRequestsByAdopterAsync(reviewerId);

            var validRequest = acceptedRequest.FirstOrDefault(r =>
                r.PetId == dto.PetId &&
                r.Status == RequestStatus.Accepted);

            if (validRequest == null)
                throw new Exception("You can only review pets you have adopted");

            var reviewExists = await _reviewRepository
                .ReviewExistsAsync(reviewerId, dto.PetId);
            if (reviewExists)
                throw new Exception("You already reviewed this adoption");

            var pet = await _petRepository.GetByIdAsync(dto.PetId);
            if (pet == null)
                throw new Exception("Pet not found");

            var review = new Review
            {
                PetId = dto.PetId,
                ReviewerId = reviewerId,
                OwnerId = pet.OwnerId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            await _reviewRepository.AddAsync(review);
            await _reviewRepository.SaveAsync();
            return true;
        }

        public async Task<OwnerReviewsDto> GetOwnerReviewsAsync(string ownerId, PaginationParams param)
        {
            var owner = await _userManager.FindByIdAsync(ownerId);
            if (owner == null)
                throw new Exception("Owner not found");

            var reviews = await _reviewRepository
                .GetReviewsByOwnerAsync(ownerId, param);


            var mappedReviews = MapperDto(reviews);

            return new OwnerReviewsDto
            {
                OwnerId = owner.Id,
                OwnerName = owner.Name,
                IsApproved = owner.IsApproved,
                IsActive = owner.IsActive,
                JoinnedIn = owner.CreatedAt,
                Reviews = mappedReviews
            };

        }
        
        private PagedResult<ReviewResponseDto> MapperDto(PagedResult<Review> rev)
        {
            return PagedResult<ReviewResponseDto>.Create(Mapper(rev.Items), rev.TotalCount, rev.CurrentPage, rev.PageSize);

        }
        private IEnumerable<ReviewResponseDto> Mapper(IEnumerable<Review> reviews)
        {
            return reviews.Select(r => new ReviewResponseDto
            {
                ReviewId = r.ReviewId,
                PetId = r.PetId,
                PetName = r.Pet?.Name ?? "",
                ReviewerId = r.ReviewerId,
                ReviewerName = r.Reviewer?.Name ?? "",
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            });
        }
    }
}