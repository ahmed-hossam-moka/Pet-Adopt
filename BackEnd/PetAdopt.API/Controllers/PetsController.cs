using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAdopt.BLL.DTOs.Pet;
using PetAdopt.BLL.Services.Interfaces;
using PetAdopt.DAL.Pagination;

namespace PetAdopt.API.Controllers;

public class PetsController : BaseController
{
    private readonly IPetService _petService;

    public PetsController(IPetService petService)
    {
        _petService = petService;
    }

    // GET api/pets
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetPets([FromQuery] PaginationParams param)
    {
        var result = await _petService.GetApprovedPetsAsync(param);
        return Success(result);
    }

    // GET api/pets/{id}
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPetById(int id)
    {

        var pet = await _petService.GetPetByIdAsync(id);
        if (pet == null)
            return Fail("Pet not found", 404);

        return Success(pet);

    }

    // GET api/pets/search?animalType=Dog&breed=Husky&maxAge=24&location=Cairo
    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchPets(
        [FromQuery] PaginationParams paginationParams,
        [FromQuery] string? animalType,
        [FromQuery] string? breed,
        [FromQuery] int? maxAge,
        [FromQuery] string? location)
    {

        var pets = await _petService.SearchPetsAsync(paginationParams,
            animalType, breed, maxAge, location);
        return Success(pets);


    }

    // GET api/pets/my-pets
    [HttpGet("my-pets")]
    [Authorize(Roles = "Shelter,PetOwner")]
    public async Task<IActionResult> GetMyPets()
    {

        var pets = await _petService.GetMyPetsAsync(GetCurrentUserId());
        return Success(pets);

    }

    // POST api/pets
    [HttpPost]
    [Authorize(Roles = "Shelter,PetOwner")]
    public async Task<IActionResult> CreatePet([FromBody] CreatePetDto dto)
    {
        var pet = await _petService.CreatePetAsync(dto, GetCurrentUserId());
        return Success(pet, "Pet created and waiting for admin approval");
    }

    // PUT api/pets/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "Shelter,PetOwner")]
    public async Task<IActionResult> UpdatePet(int id, [FromBody] UpdatePetDto dto)
    {

        var result = await _petService.UpdatePetAsync(
            id, dto, GetCurrentUserId());

        if (!result)
            return Fail("Pet not found or unauthorized", 404);

        return Success(null, "Pet updated successfully");

    }

    // DELETE api/pets/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Shelter,PetOwner")]
    public async Task<IActionResult> DeletePet(int id)
    {

        var result = await _petService.DeletePetAsync(
            id, GetCurrentUserId());

        if (!result)
            return Fail("Pet not found or unauthorized", 404);

        return Success(null, "Pet deleted successfully");

    }


}
