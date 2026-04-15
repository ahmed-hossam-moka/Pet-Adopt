using PetAdopt.BLL.DTOs.AdopterHistory;
using PetAdopt.BLL.DTOs.Pet;

namespace PetAdopt.BLL.DTOs.AdoptionRequest
{
    public class AdoptionRequestResponseDto
    {
        public int RequestId { get; set; }

        public int PetId { get; set; }
        public string PetName { get; set; }
        public string PetPrimaryImage { get; set; }

        public string AdopterId { get; set; }
        public string AdopterName { get; set; }
        public string AdopterEmail { get; set; }

        public string Status { get; set; }
        public string? Message { get; set; }
        public DateTime CreatedAt { get; set; }

        public List<AdopterHistoryResponseDto> AdopterHistories { get; set; }
    }
}