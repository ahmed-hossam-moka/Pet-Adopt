using Microsoft.EntityFrameworkCore;
using PetAdopt.DAL.Data;
using PetAdopt.DAL.Models;
using PetAdopt.DAL.Pagination;
using PetAdopt.DAL.Repositories.Interfaces;

namespace PetAdopt.DAL.Repositories.Implementations
{
    public class PetRepository : GenericRepository<Pet>, IPetRepository
    {
        public PetRepository(AppDbContext context) : base(context) { }


        public async Task<PagedResult<PetHomeResponseDto>> GetApprovedPetsAsync(PaginationParams param)
        {
            var query = _context.Pets
                                    .AsQueryable()
                                    .Where(p => p.IsApproved && !p.IsDeleted);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderBy(p => p.PetId) // مهم
                .Skip((param.Page - 1) * param.PageSize)
                .Take(param.PageSize)
                .Select(p => new PetHomeResponseDto
                {
                    PetId = p.PetId,
                    Name = p.Name,
                    AnimalType = p.AnimalType,
                    Breed = p.Breed,
                    Age = p.Age,
                    Location = p.Location,
                    PrimaryImageUrl = p.PrimaryImageUrl
                }
                ).ToListAsync();

            return PagedResult<PetHomeResponseDto>.Create(items, totalCount, param.Page, param.PageSize);
        }

        public async Task<Pet?> GetPetWithDetailsAsync(int petId)
        {
            return await _context.Pets
                .Where(p => p.PetId == petId && !p.IsDeleted)
                .Include(p => p.Images)
                .Include(p => p.Owner)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Pet>> GetPetsByOwnerAsync(string ownerId)
        {
            return await _context.Pets
                .Where(p => p.OwnerId == ownerId && !p.IsDeleted)
                .Include(p => p.Images)
                .ToListAsync();
        }

        public async Task<IEnumerable<PetHomeResponseDto>> SearchPetsAsync(
            string? animalType,
            string? breed,
            int? maxAge,
            string? location)
        {

            var query = _context.Pets
                        .AsQueryable()
                        .Where(p => p.IsApproved && !p.IsDeleted)
                        .Select(p => new PetHomeResponseDto
                        {
                            PetId = p.PetId,
                            Name = p.Name,
                            AnimalType = p.AnimalType,
                            Breed = p.Breed,
                            Age = p.Age,
                            Location = p.Location,
                            PrimaryImageUrl = p.PrimaryImageUrl
                        });

            if (!string.IsNullOrEmpty(animalType))
                query = query.Where(p => p.AnimalType.ToLower() == animalType.ToLower());

            if (!string.IsNullOrEmpty(breed))
                query = query.Where(p => p.Breed.ToLower().Contains(breed.ToLower()));

            if (maxAge.HasValue)
                query = query.Where(p => p.Age <= maxAge.Value);

            if (!string.IsNullOrEmpty(location))
                query = query.Where(p => p.Location.ToLower().Contains(location.ToLower()));

            return await query.ToListAsync();
        }

        public async Task<IEnumerable<Pet>> GetPendingApprovalPetsAsync()
        {
            return await _context.Pets
                .Where(p => !p.IsApproved && !p.IsDeleted)
                .Include(p => p.Owner)
                .Include(p => p.Images)
                .ToListAsync();
        }

    }

}
