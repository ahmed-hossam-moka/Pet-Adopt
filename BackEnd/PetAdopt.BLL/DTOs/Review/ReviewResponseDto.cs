namespace PetAdopt.BLL.DTOs.Review
{
    public class ReviewResponseDto
    {
        public int ReviewId { get; set; }

        public int PetId { get; set; }
        public string PetName { get; set; }

        public string ReviewerId { get; set; }
        public string ReviewerName { get; set; }


        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}