namespace PetAdopt.DAL.Models
{
    public enum RequestStatus { Pending, Accepted, Rejected }

    public class AdoptionRequest
    {
        public int RequestId { get; set; }
        public int PetId { get; set; }
        public string AdopterId { get; set; }
        public RequestStatus Status { get; set; }
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Pet Pet { get; set; }
        public ApplicationUser Adopter { get; set; }
    }
}