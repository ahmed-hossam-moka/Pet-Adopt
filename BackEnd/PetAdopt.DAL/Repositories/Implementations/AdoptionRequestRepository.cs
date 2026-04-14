using Microsoft.EntityFrameworkCore;
using PetAdopt.DAL.Data;
using PetAdopt.DAL.Models;
using PetAdopt.DAL.Repositories.Interfaces;

namespace PetAdopt.DAL.Repositories.Implementations
{
    public class AdoptionRequestRepository : GenericRepository<AdoptionRequest>, IAdoptionRequestRepository
    {
        public AdoptionRequestRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<AdoptionRequest>> GetRequestsByPetAsync(int petId)
        {
            return await _context.AdoptionRequests
                .Where(r => r.PetId == petId)
                .Include(r => r.Adopter)
                    .ThenInclude(a => a.AdopterHistories)
                .ToListAsync();
        }

        public async Task<IEnumerable<AdoptionRequest>> GetRequestsByAdopterAsync(string adopterId)
        {
            return await _context.AdoptionRequests
                .Where(r => r.AdopterId == adopterId)
                .Include(r => r.Pet)
                    .ThenInclude(p => p.Images)
                .ToListAsync();
        }

        public async Task<AdoptionRequest?> GetRequestWithDetailsAsync(int requestId)
        {
            return await _context.AdoptionRequests
                .Where(r => r.RequestId == requestId)
                .Include(r => r.Pet)
                .Include(r => r.Adopter)
                    .ThenInclude(a => a.AdopterHistories)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> RequestExistsAsync(int petId, string adopterId)
        {
            return await _context.AdoptionRequests
                .AnyAsync(r => r.PetId == petId && r.AdopterId == adopterId);
        }

        public async Task<IEnumerable<AdoptionRequest>> GetPendingRequestsByPetAsync(int petId)
        {
            return await _context.AdoptionRequests
                .Where(r => r.PetId == petId && r.Status == RequestStatus.Pending)
                .ToListAsync();
        }
    }
}