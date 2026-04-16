using PetAdopt.BLL.DTOs.Favorite;
using PetAdopt.BLL.Services.Interfaces;
using PetAdopt.DAL.Models;
using PetAdopt.DAL.Pagination;
using PetAdopt.DAL.Repositories.Interfaces;

namespace PetAdopt.BLL.Services.Implementations
{
    public class FavoriteService : IFavoriteService
    {
        private readonly IFavoriteRepository _favoriteRepository;
        private readonly IPetRepository _petRepository;

        public FavoriteService(
            IFavoriteRepository favoriteRepository,
            IPetRepository petRepository)
        {
            _favoriteRepository = favoriteRepository;
            _petRepository = petRepository;
        }

        public async Task<bool> AddToFavoritesAsync(int petId, string adopterId)
        {
            var pet = await _petRepository.GetByIdAsync(petId);
            if (pet == null || pet.IsDeleted || !pet.IsApproved)
                throw new Exception("Pet not found");

            var exists = await _favoriteRepository.IsFavoritedAsync(adopterId, petId);
            if (exists)
                throw new Exception("Pet already in favorites");

            var favorite = new Favorite
            {
                AdopterId = adopterId,
                PetId = petId,
                SavedAt = DateTime.UtcNow
            };

            await _favoriteRepository.AddAsync(favorite);
            await _favoriteRepository.SaveAsync();
            return true;
        }

        public async Task<bool> RemoveFromFavoritesAsync(int petId, string adopterId)
        {
            var favorite = await _favoriteRepository
                .GetFavoriteAsync(adopterId, petId);
            if (favorite == null)
                throw new Exception("Favorite not found");

            _favoriteRepository.Delete(favorite);
            await _favoriteRepository.SaveAsync();
            return true;
        }
        public async Task<IEnumerable<FavoriteResponseDto>> GetMyFavoritesAsync(string adopterId)
        {
            var favorites = await _favoriteRepository
                .GetFavoritesByAdopterAsync(adopterId);

            return favorites.Select(f => new FavoriteResponseDto
            {
                FavoriteId = f.FavoriteId,
                SavedAt = f.SavedAt,
                Pet = new PetHomeResponseDto
                {
                    PetId = f.Pet.PetId,
                    Name = f.Pet.Name,
                    AnimalType = f.Pet.AnimalType,
                    Breed = f.Pet.Breed,
                    Age = f.Pet.Age,
                    Location = f.Pet.Location,
                    PrimaryImageUrl = f.Pet.PrimaryImageUrl
                }});
        }
    }
}