using PetAdopt.BLL.DTOs.Pet;
using PetAdopt.DAL.Models;
using PetAdopt.DAL.Pagination;
using PetAdopt.DAL.Repositories.Implementations;

namespace PetAdopt.BLL.Services.Interfaces
{
    public interface IPetService
    {
        Task<PagedResult<PetHomeResponseDto>> GetApprovedPetsAsync(PaginationParams param);


        Task<PetResponseDto?> GetPetByIdAsync(int petId);
        Task<IEnumerable<PetHomeResponseDto>> SearchPetsAsync(
            string? animalType,
            string? breed,
            int? maxAge,
            string? location);

        Task<PetResponseDto> CreatePetAsync(CreatePetDto dto, string ownerId);
        Task<bool> UpdatePetAsync(int petId, UpdatePetDto dto, string ownerId);
        Task<bool> DeletePetAsync(int petId, string ownerId);
        Task<IEnumerable<PetResponseDto>> GetMyPetsAsync(string ownerId);

        Task<IEnumerable<PetResponseDto>> GetPendingApprovalPetsAsync();
        Task<bool> ApprovePetAsync(int petId);
        Task<bool> RejectPetAsync(int petId);

    }
    
}