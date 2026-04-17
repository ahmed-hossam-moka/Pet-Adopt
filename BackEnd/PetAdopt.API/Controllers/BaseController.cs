using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace PetAdopt.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseController : ControllerBase
{
    protected string GetCurrentUserId()
        => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    protected string GetCurrentUserRole()
        => User.FindFirstValue(ClaimTypes.Role)!;

    protected IActionResult Success(object data, string message = "Success")
        => Ok(new { success = true, message, data });

    protected IActionResult Fail(string message, int statusCode = 400)
        => StatusCode(statusCode, new { success = false, message });
}