using PetAdopt.DAL.Models;

namespace PetAdopt.DAL.Repositories.Interfaces
{
    public interface IAdoptionRequestRepository : IGenericRepository<AdoptionRequest>
    {
        Task<IEnumerable<AdoptionRequest>> GetRequestsByPetAsync(int petId);

        Task<IEnumerable<AdoptionRequest>> GetRequestsByAdopterAsync(string adopterId);

        Task<AdoptionRequest?> GetRequestWithDetailsAsync(int requestId);

        Task<bool> RequestExistsAsync(int petId, string adopterId);

        Task<IEnumerable<AdoptionRequest>> GetPendingRequestsByPetAsync(int petId);
    }
}