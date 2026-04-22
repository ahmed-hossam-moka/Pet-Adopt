using Microsoft.AspNetCore.Identity;

namespace PetAdopt.DAL.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        public bool IsApproved { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<Pet> Pets { get; set; }
        public ICollection<AdoptionRequest> AdoptionRequests { get; set; }
        public ICollection<AdopterHistory> AdopterHistories { get; set; }
        public ICollection<Favorite> Favorites { get; set; }
        public ICollection<Review> ReviewsGiven { get; set; }
        public ICollection<Review> ReviewsReceived { get; set; }
        public ICollection<Notification> Notifications { get; set; }

    }
}