using PetAdopt.DAL.Models;
using PetAdopt.DAL.Pagination;

namespace PetAdopt.DAL.Repositories.Interfaces
{
    public interface IReviewRepository : IGenericRepository<Review>
    {
        // جيب كل الـ Reviews بتاعت Owner معين
        Task<PagedResult<Review>> GetReviewsByOwnerAsync(string ownerId, PaginationParams param);

        // اتحقق لو الـ Adopter ده عمل Review على الـ Pet دي قبل كده
        Task<bool> ReviewExistsAsync(string reviewerId, int petId);
    }
}