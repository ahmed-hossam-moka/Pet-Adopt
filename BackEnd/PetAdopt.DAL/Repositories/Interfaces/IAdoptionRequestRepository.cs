using PetAdopt.DAL.Models;

namespace PetAdopt.DAL.Repositories.Interfaces
{
    public interface IAdoptionRequestRepository : IGenericRepository<AdoptionRequest>
    {
        // جيب كل الـ Requests بتاعت Pet معين
        Task<IEnumerable<AdoptionRequest>> GetRequestsByPetAsync(int petId);

        // جيب كل الـ Requests بتاعت Adopter معين
        Task<IEnumerable<AdoptionRequest>> GetRequestsByAdopterAsync(string adopterId);

        // جيب Request مع كل تفاصيله
        Task<AdoptionRequest?> GetRequestWithDetailsAsync(int requestId);

        // اتحقق لو الـ Adopter ده بعت Request على الـ Pet ده قبل كده
        Task<bool> RequestExistsAsync(int petId, string adopterId);

        // جيب كل الـ Requests الـ Pending بتاعت Pet معين
        Task<IEnumerable<AdoptionRequest>> GetPendingRequestsByPetAsync(int petId);
    }
}