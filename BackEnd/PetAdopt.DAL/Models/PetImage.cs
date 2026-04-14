namespace PetAdopt.DAL.Models
{
    public class PetImage
    {
        public int ImageId { get; set; }
        public int PetId { get; set; }
        public string ImageUrl { get; set; }
        public bool IsPrimary { get; set; }
        public DateTime UploadedAt { get; set; }

        public Pet Pet { get; set; }
    }
}