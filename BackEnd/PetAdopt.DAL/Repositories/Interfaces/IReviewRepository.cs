using PetAdopt.DAL.Models;
using PetAdopt.DAL.Pagination;

namespace PetAdopt.DAL.Repositories.Interfaces
{
    public interface IReviewRepository : IGenericRepository<Review>
    {
        Task<PagedResult<Review>> GetReviewsByOwnerAsync(string ownerId, PaginationParams param);

        Task<bool> ReviewExistsAsync(string reviewerId, int petId);
    }
}