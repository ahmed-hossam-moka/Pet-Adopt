using PetAdopt.BLL.DTOs.PetImage;

namespace PetAdopt.BLL.DTOs.Pet
{
    public class PetResponseDto
    {
        public int PetId { get; set; }

        public string OwnerName { get; set; }

        public string Name { get; set; }
        public string AnimalType { get; set; }
        public string Breed { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public string HealthStatus { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public string Status { get; set; }
        public bool IsApproved { get; set; }
        public DateTime CreatedAt { get; set; }

        public List<PetImageResponseDto>? Images { get; set; }

        public string PrimaryImageUrl { get; set; }
    }
}