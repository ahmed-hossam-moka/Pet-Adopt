using PetAdopt.BLL.DTOs.Favorite;

namespace PetAdopt.BLL.Services.Interfaces
{
    public interface IFavoriteService
    {
        Task<bool> AddToFavoritesAsync(int petId, string adopterId);
        Task<bool> RemoveFromFavoritesAsync(int petId, string adopterId);
        Task<IEnumerable<FavoriteResponseDto>> GetMyFavoritesAsync(string adopterId);
    }
}