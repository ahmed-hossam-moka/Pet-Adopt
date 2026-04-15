namespace PetAdopt.BLL.DTOs.AdopterHistory
{
    public class CreateAdopterHistoryDto
    {
        public string? PreviousPetName { get; set; }
        public string? PreviousPetType { get; set; }
        public string? VeterinaryReference { get; set; }
        public string? Experience { get; set; }
        public int? YearOfAdoption { get; set; }
    }
}