using PetAdopt.DAL.Models;
using PetAdopt.DAL.Pagination;
using PetAdopt.DAL.Repositories.Implementations;

namespace PetAdopt.DAL.Repositories.Interfaces
{
    public interface IPetRepository : IGenericRepository<Pet>
    {
        Task<PagedResult<PetHomeResponseDto>> GetApprovedPetsAsync(PaginationParams param);

        Task<Pet?> GetPetWithDetailsAsync(int petId);

        Task<IEnumerable<Pet>> GetPetsByOwnerAsync(string ownerId);

        Task<PagedResult<PetHomeResponseDto>> SearchPetsAsync(PaginationParams paginationParams,
            string? animalType,
            string? breed,
            int? maxAge,
            string? location);

        Task<IEnumerable<Pet>> GetPendingApprovalPetsAsync();

    }
}