using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAdopt.BLL.DTOs.AdoptionRequest;
using PetAdopt.BLL.Services.Interfaces;

namespace PetAdopt.API.Controllers;

public class AdoptionController : BaseController
{
    private readonly IAdoptionRequestService _adoptionService;

    public AdoptionController(IAdoptionRequestService adoptionService)
    {
        _adoptionService = adoptionService;
    }

    // POST api/adoption/request
    [HttpPost("request")]
    [Authorize(Roles = "Adopter")]
    public async Task<IActionResult> SubmitRequest(
        [FromBody] CreateAdoptionRequestDto dto)
    {

        await _adoptionService.SubmitRequestAsync(dto, GetCurrentUserId());
        return Success(null, "Adoption request submitted successfully");

    }

    // GET api/adoption/my-requests
    [HttpGet("my-requests")]
    [Authorize(Roles = "Adopter")]
    public async Task<IActionResult> GetMyRequests()
    {

        var requests = await _adoptionService
            .GetMyRequestsAsync(GetCurrentUserId());
        return Success(requests);

    }

    // GET api/adoption/pet/{petId}/requests
    [HttpGet("pet/{petId}/requests")]
    [Authorize(Roles = "Shelter,PetOwner")]
    public async Task<IActionResult> GetRequestsByPet(int petId)
    {

        var requests = await _adoptionService
            .GetRequestsByPetAsync(petId, GetCurrentUserId());
        return Success(requests);

    }

    // PUT api/adoption/request/{requestId}/accept
    [HttpPut("request/{requestId}/accept")]
    [Authorize(Roles = "Shelter,PetOwner")]
    public async Task<IActionResult> AcceptRequest(int requestId)
    {

        await _adoptionService.AcceptRequestAsync(
            requestId, GetCurrentUserId());
        return Success(null, "Request accepted successfully");

    }

    // PUT api/adoption/request/{requestId}/reject
    [HttpPut("request/{requestId}/reject")]
    [Authorize(Roles = "Shelter,PetOwner")]
    public async Task<IActionResult> RejectRequest(int requestId)
    {

        await _adoptionService.RejectRequestAsync(
            requestId, GetCurrentUserId());
        return Success(null, "Request rejected successfully");

    }
}
