using PetAdopt.BLL.DTOs.Review;
using PetAdopt.DAL.Pagination;

namespace PetAdopt.BLL.Services.Interfaces
{
    public interface IReviewService
    {
        Task<bool> CreateReviewAsync(CreateReviewDto dto, string reviewerId);
        Task<OwnerReviewsDto> GetOwnerReviewsAsync(string ownerId,  PaginationParams param);
    }
}