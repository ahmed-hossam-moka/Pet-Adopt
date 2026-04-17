using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAdopt.BLL.Services.Interfaces;

namespace PetAdopt.API.Controllers;

public class FavoritesController : BaseController
{
    private readonly IFavoriteService _favoriteService;

    public FavoritesController(IFavoriteService favoriteService)
    {
        _favoriteService = favoriteService;
    }

    // GET api/favorites
    [HttpGet]
    [Authorize(Roles = "Adopter")]
    public async Task<IActionResult> GetMyFavorites()
    {

        var favorites = await _favoriteService
            .GetMyFavoritesAsync(GetCurrentUserId());
        return Success(favorites);

    }

    // POST api/favorites/{petId}
    [HttpPost("{petId}")]
    [Authorize(Roles = "Adopter")]
    public async Task<IActionResult> AddToFavorites(int petId)
    {

        await _favoriteService.AddToFavoritesAsync(
            petId, GetCurrentUserId());
        return Success(null, "Pet added to favorites");

    }

    // DELETE api/favorites/{petId}
    [HttpDelete("{petId}")]
    [Authorize(Roles = "Adopter")]
    public async Task<IActionResult> RemoveFromFavorites(int petId)
    {

        await _favoriteService.RemoveFromFavoritesAsync(
            petId, GetCurrentUserId());
        return Success(null, "Pet removed from favorites");

    }
}
