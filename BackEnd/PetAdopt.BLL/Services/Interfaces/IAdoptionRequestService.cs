using PetAdopt.BLL.DTOs.AdoptionRequest;

namespace PetAdopt.BLL.Services.Interfaces
{
    public interface IAdoptionRequestService
    {
        Task<bool> SubmitRequestAsync(CreateAdoptionRequestDto dto, string adopterId);
        Task<IEnumerable<AdoptionRequestResponseAdoptDto>> GetMyRequestsAsync(string adopterId);

        Task<IEnumerable<AdoptionRequestResponseDto>> GetRequestsByPetAsync(int petId, string ownerId);
        Task<bool> AcceptRequestAsync(int requestId, string ownerId);
        Task<bool> RejectRequestAsync(int requestId, string ownerId);
    }
}