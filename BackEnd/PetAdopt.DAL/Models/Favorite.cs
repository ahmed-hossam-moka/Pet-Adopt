namespace PetAdopt.DAL.Models
{
    public class Favorite
    {
        public int FavoriteId { get; set; }
        public string AdopterId { get; set; }
        public int PetId { get; set; }
        public DateTime SavedAt { get; set; }

        public ApplicationUser Adopter { get; set; }
        public Pet Pet { get; set; }
    }
}