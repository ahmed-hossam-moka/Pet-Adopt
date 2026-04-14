namespace PetAdopt.DAL.Models
{
    public class AdopterHistory
    {
        public int HistoryId { get; set; }
        public string AdopterId { get; set; }
        public string PreviousPetName { get; set; }
        public string PreviousPetType { get; set; }
        public string VeterinaryReference { get; set; }
        public string Experience { get; set; }
        public int? YearOfAdoption { get; set; }

        public ApplicationUser Adopter { get; set; }
    }
}