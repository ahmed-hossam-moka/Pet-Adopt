using PetAdopt.DAL.Models;
using PetAdopt.DAL.Pagination;
using PetAdopt.DAL.Repositories.Implementations;

namespace PetAdopt.DAL.Repositories.Interfaces
{
    public interface IPetRepository : IGenericRepository<Pet>
    {
        //|||||||||||||||||| Done ||||||||||||||||
        Task<PagedResult<PetHomeResponseDto>> GetApprovedPetsAsync(PaginationParams param);

        //|||||||||||||||||| Done ||||||||||||||||
        Task<Pet?> GetPetWithDetailsAsync(int petId);

        //|||||||||||||||||| Done ||||||||||||||||
        Task<IEnumerable<Pet>> GetPetsByOwnerAsync(string ownerId);

        //|||||||||||||||||| Done ||||||||||||||||
        Task<IEnumerable<PetHomeResponseDto>> SearchPetsAsync(
            string? animalType,
            string? breed,
            int? maxAge,
            string? location);

        //|||||||||||||||||| Done ||||||||||||||||
        Task<IEnumerable<Pet>> GetPendingApprovalPetsAsync();

    }
}