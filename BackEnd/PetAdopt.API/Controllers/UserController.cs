using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAdopt.BLL.DTOs.User;
using PetAdopt.BLL.Services.Interfaces;

namespace PetAdopt.API.Controllers
{
    [Authorize]
    public class UserController : BaseController
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // GET api/user/profile
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {

            var profile = await _userService
                .GetProfileAsync(GetCurrentUserId());
            return Success(profile);
        }

        // PUT api/user/profile
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(
            [FromBody] UpdateProfileDto dto)
        {

            await _userService
                .UpdateProfileAsync(GetCurrentUserId(), dto);
            return Success(null, "Profile updated successfully");
        }

        // PUT api/user/change-password
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword(
            [FromBody] ChangePasswordDto dto)
        {
            await _userService
                .ChangePasswordAsync(GetCurrentUserId(), dto);
            return Success(null, "Password changed successfully");
        }
    }
}