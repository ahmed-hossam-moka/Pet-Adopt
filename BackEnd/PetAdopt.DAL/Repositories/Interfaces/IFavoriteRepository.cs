using PetAdopt.DAL.Models;

namespace PetAdopt.DAL.Repositories.Interfaces
{
    public interface IFavoriteRepository : IGenericRepository<Favorite>
    {
        Task<IEnumerable<Favorite>> GetFavoritesByAdopterAsync(string adopterId);
        Task<bool> IsFavoritedAsync(string adopterId, int petId);
        Task<Favorite?> GetFavoriteAsync(string adopterId, int petId);
    }
}