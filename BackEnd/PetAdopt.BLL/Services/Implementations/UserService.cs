using Microsoft.AspNetCore.Identity;
using PetAdopt.BLL.DTOs.User;
using PetAdopt.BLL.Services.Interfaces;
using PetAdopt.DAL.Models;

namespace PetAdopt.BLL.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UserService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<UserProfileDto> GetProfileAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            var roles = await _userManager.GetRolesAsync(user);

            return new UserProfileDto
            {
                UserId    = user.Id,
                Name      = user.Name,
                Email     = user.Email,
                Role      = roles.FirstOrDefault() ?? "",
                IsApproved = user.IsApproved,
                IsActive  = user.IsActive,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<bool> UpdateProfileAsync(string userId, UpdateProfileDto dto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            if (dto.Email != null && dto.Email != user.Email)
            {
                var emailExists = await _userManager.FindByEmailAsync(dto.Email);
                if (emailExists != null)
                    throw new Exception("Email already exists");

                user.Email    = dto.Email;
                user.UserName = dto.Email;
            }

            if (dto.Name != null)
                user.Name = dto.Name;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                throw new Exception(string.Join(", ",
                    result.Errors.Select(e => e.Description)));

            return true;
        }

        public async Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto dto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            var result = await _userManager.ChangePasswordAsync(
                user,
                dto.CurrentPassword,
                dto.NewPassword);

            if (!result.Succeeded)
                throw new Exception(string.Join(", ",
                    result.Errors.Select(e => e.Description)));

            return true;
        }
    }
}