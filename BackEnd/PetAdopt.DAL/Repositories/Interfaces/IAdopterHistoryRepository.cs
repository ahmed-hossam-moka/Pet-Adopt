using PetAdopt.DAL.Models;

namespace PetAdopt.DAL.Repositories.Interfaces
{
    public interface IAdopterHistoryRepository : IGenericRepository<AdopterHistory>
    {
        // جيب كل الـ History بتاعت Adopter معين
        Task<IEnumerable<AdopterHistory>> GetHistoriesByAdopterAsync(string adopterId);
    }
}