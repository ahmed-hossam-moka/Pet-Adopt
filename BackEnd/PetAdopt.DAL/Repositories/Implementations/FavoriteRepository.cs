using Microsoft.EntityFrameworkCore;
using PetAdopt.DAL.Data;
using PetAdopt.DAL.Models;
using PetAdopt.DAL.Repositories.Interfaces;

namespace PetAdopt.DAL.Repositories.Implementations
{
    public class FavoriteRepository : GenericRepository<Favorite>, IFavoriteRepository
    {
        public FavoriteRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Favorite>> GetFavoritesByAdopterAsync(string adopterId)
        {
            return await _context.Favorites
                .Where(f => f.AdopterId == adopterId)
                .Include(f => f.Pet)                
                .ToListAsync();
        }

        public async Task<bool> IsFavoritedAsync(string adopterId, int petId)
        {
            return await _context.Favorites
                .AnyAsync(f => f.AdopterId == adopterId && f.PetId == petId);
        }

        public async Task<Favorite?> GetFavoriteAsync(string adopterId, int petId)
        {
            return await _context.Favorites
                .FirstOrDefaultAsync(f => f.AdopterId == adopterId && f.PetId == petId);
        }
    }
}