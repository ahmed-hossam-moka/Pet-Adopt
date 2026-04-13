namespace PetAdopt.DAL.Models
{
    public enum PetStatus  { Available
    // , Pending
    , Adopted }
    public enum PetGender  { Male, Female }

    public class Pet
    {
        public int PetId { get; set; }
        public string OwnerId { get; set; }
        public string Name { get; set; }
        public string AnimalType { get; set; }
        public string Breed { get; set; }
        public int Age { get; set; }
        public PetGender Gender { get; set; }
        public string HealthStatus { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public PetStatus Status { get; set; }
        public string PrimaryImageUrl {get; set;}
        public bool IsApproved { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }


        // Navigation Properties
        public ApplicationUser Owner { get; set; }
        public ICollection<PetImage> Images { get; set; }
        public ICollection<AdoptionRequest> AdoptionRequests { get; set; }
        public ICollection<Favorite> Favorites { get; set; }
        public ICollection<Review> Reviews { get; set; }
    }
}