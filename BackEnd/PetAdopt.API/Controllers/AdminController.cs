using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetAdopt.BLL.Services.Interfaces;
using PetAdopt.DAL.Models;

namespace PetAdopt.API.Controllers;

[Authorize(Roles = "Admin")]
public class AdminController : BaseController
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IPetService _petService;
    private readonly INotificationService _notificationService;

    public AdminController(
        UserManager<ApplicationUser> userManager,
        IPetService petService,
        INotificationService notificationService)
    {
        _userManager = userManager;
        _petService = petService;
        _notificationService = notificationService;
    }

    // GET api/admin/pending-users
    [HttpGet("pending-users")]
    public async Task<IActionResult> GetPendingUsers()
    {
        var users = await _userManager.Users
            .Where(u => !u.IsApproved && u.IsActive)
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.CreatedAt
            })
            .ToListAsync();

        return Success(users);
    }

    // PUT api/admin/approve-user/{userId}
    [HttpPut("approve-user/{userId}")]
    public async Task<IActionResult> ApproveUser(string userId)
    {

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return Fail("User not found", 404);

        user.IsApproved = true;
        user.IsActive = true;

        await _userManager.UpdateAsync(user);


        return Success(null!, "User approved successfully");

    }

    // PUT api/admin/reject-user/{userId}
    [HttpPut("reject-user/{userId}")]
    public async Task<IActionResult> RejectUser(string userId)
    {

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return Fail("User not found", 404);
        user.IsActive = false;
        user.IsApproved = false;
        await _userManager.UpdateAsync(user);

        return Success(null!, "User rejected successfully");

    }


    // GET api/admin/pending-pets
    [HttpGet("pending-pets")]
    public async Task<IActionResult> GetPendingPets()
    {
        var pets = await _petService.GetPendingApprovalPetsAsync();
        return Success(pets);
    }

    // PUT api/admin/approve-pet/{petId}
    [HttpPut("approve-pet/{petId}")]
    public async Task<IActionResult> ApprovePet(int petId)
    {
        var result = await _petService.ApprovePetAsync(petId);
        if (!result)
            return Fail("Pet not found", 404);

        return Success(null!, "Pet approved successfully");
    }

    // PUT api/admin/reject-pet/{petId}
    [HttpPut("reject-pet/{petId}")]
    public async Task<IActionResult> RejectPet(int petId)
    {
        var result = await _petService.RejectPetAsync(petId);
        if (!result)
            return Fail("Pet not found", 404);

        return Success(null!, "Pet rejected successfully");
    }

}