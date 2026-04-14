using Microsoft.EntityFrameworkCore;
using PetAdopt.DAL.Data;
using PetAdopt.DAL.Models;
using PetAdopt.DAL.Pagination;
using PetAdopt.DAL.Repositories.Interfaces;

namespace PetAdopt.DAL.Repositories.Implementations
{
    public class ReviewRepository : GenericRepository<Review>, IReviewRepository
    {
        public ReviewRepository(AppDbContext context) : base(context) { }

        public async Task<PagedResult<Review>> GetReviewsByOwnerAsync(string ownerId, PaginationParams param)
        {

            var query = _context.Reviews
                    .AsQueryable()
                    .Where(r => r.OwnerId == ownerId)
                    .Include(r => r.Reviewer)
                    .Include(r => r.Pet)
                    .Include(r => r.Owner);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderBy(p => p.PetId)
                .Skip((param.Page - 1) * param.PageSize)
                .Take(param.PageSize)
                .ToListAsync();

            return PagedResult<Review>.Create(items, totalCount, param.Page, param.PageSize);
        }

        public async Task<bool> ReviewExistsAsync(string reviewerId, int petId)
        {
            return await _context.Reviews
                .AnyAsync(r => r.ReviewerId == reviewerId && r.PetId == petId);
        }
    }
}