using Microsoft.EntityFrameworkCore;
using PetAdopt.DAL.Data;
using PetAdopt.DAL.Models;
using PetAdopt.DAL.Repositories.Interfaces;

namespace PetAdopt.DAL.Repositories.Implementations
{
    public class AdopterHistoryRepository : GenericRepository<AdopterHistory>, IAdopterHistoryRepository
    {
        public AdopterHistoryRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<AdopterHistory>> GetHistoriesByAdopterAsync(string adopterId)
        {
            return await _context.AdopterHistories
                .Where(h => h.AdopterId == adopterId)
                .ToListAsync();
        }
    }
}