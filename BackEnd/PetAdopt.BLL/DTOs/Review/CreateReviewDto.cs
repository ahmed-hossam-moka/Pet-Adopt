namespace PetAdopt.BLL.DTOs.Review
{
    public class CreateReviewDto
    {
        public int PetId { get; set; }
        public int Rating { get; set; }     
        public string? Comment { get; set; }
    }
}