
namespace PetAdopt.DAL.Pagination;

public class PetHomeResponseDto
{
    public int PetId { get; set; }
    public string Name { get; set; }
    public string AnimalType { get; set; }
    public string Breed { get; set; }
    public int Age { get; set; }
    public string Location { get; set; }
    public string PrimaryImageUrl { get; set; }
}