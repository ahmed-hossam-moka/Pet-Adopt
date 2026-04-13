namespace PetAdopt.DAL.Models
{
    public class Review
    {
        public int ReviewId { get; set; }
        public int PetId { get; set; }
        public string ReviewerId { get; set; }
        public string OwnerId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation Properties
        public Pet Pet { get; set; }
        public ApplicationUser Reviewer { get; set; }
        public ApplicationUser Owner { get; set; }
    }
}