using Microsoft.AspNetCore.Mvc;
using PetAdopt.BLL.DTOs.Auth;
using PetAdopt.BLL.Services.Interfaces;

namespace PetAdopt.API.Controllers;

public class AuthController : BaseController
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    // POST api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {

        var result = await _authService.RegisterAsync(dto);
        return Success(result, "Registered successfully");

    }

    // POST api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {

        var result = await _authService.LoginAsync(dto);
        return Success(result, "Logged in successfully");
    }

}
