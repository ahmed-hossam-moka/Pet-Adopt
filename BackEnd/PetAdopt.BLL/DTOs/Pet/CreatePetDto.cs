namespace PetAdopt.BLL.DTOs.Pet
{
    public class CreatePetDto
    {
        public string Name { get; set; }
        public string AnimalType { get; set; }
        public string Breed { get; set; }
        public int Age { get; set; }          
        public string Gender { get; set; }     
        public string HealthStatus { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public string[] ImageUrls { get; set; }

    }
}