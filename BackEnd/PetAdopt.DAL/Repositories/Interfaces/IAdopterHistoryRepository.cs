using PetAdopt.DAL.Models;

namespace PetAdopt.DAL.Repositories.Interfaces
{
    public interface IAdopterHistoryRepository : IGenericRepository<AdopterHistory>
    {
        Task<IEnumerable<AdopterHistory>> GetHistoriesByAdopterAsync(string adopterId);
    }
}