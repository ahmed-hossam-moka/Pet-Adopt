using PetAdopt.DAL.Pagination;

namespace PetAdopt.BLL.DTOs.Favorite
{
    public class FavoriteResponseDto
    {
        public int FavoriteId { get; set; }
        public DateTime SavedAt { get; set; }

        public PetHomeResponseDto Pet { get; set; }
    }
}