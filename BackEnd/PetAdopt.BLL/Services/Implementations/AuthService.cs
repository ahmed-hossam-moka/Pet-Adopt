using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PetAdopt.BLL.DTOs.Auth;
using PetAdopt.BLL.Services.Interfaces;
using PetAdopt.DAL.Models;
using PetAdopt.DAL.Repositories.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PetAdopt.BLL.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly INotificationService _notificationService;

        public AuthService(
                            UserManager<ApplicationUser> userManager,
                            IConfiguration configuration,
                            INotificationService notificationService
                        )
        {
            _userManager = userManager;
            _configuration = configuration;
            _notificationService = notificationService;

        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                throw new Exception("Email already exists");

            var validRoles = new[] { "Shelter", "PetOwner", "Adopter" };
            if (!validRoles.Contains(dto.Role))
                throw new Exception("Invalid role");

            var user = new ApplicationUser
            {
                Name = dto.Name,
                Email = dto.Email,
                UserName = dto.Email,
                IsApproved = dto.Role == "Adopter",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));

            await _userManager.AddToRoleAsync(user, dto.Role);

            if (dto.Role != "Adopter")
            {
                await _notificationService.NotifyNewUserRequestAsync(
                    ownerId: user.Id,
                    ownerName: user.Name
                );
                    
                return new AuthResponseDto
                {
                    UserId = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = dto.Role,
                    Token = null!,
                    TokenExpiration = DateTime.MinValue
                };
            }

            var AuthShelterResponse = await GenerateTokenAsync(user);
            return AuthShelterResponse;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                throw new Exception("Invalid email or password");

            if (!user.IsActive)
                throw new Exception("Account is deactivated");

            if (!user.IsApproved)
                throw new Exception("Account is pending admin approval");

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!isPasswordValid)
                throw new Exception("Invalid email or password");

            return await GenerateTokenAsync(user);
        }

        private async Task<AuthResponseDto> GenerateTokenAsync(ApplicationUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault();

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, role ?? "")
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["JWT:Key"]!));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expiration = DateTime.UtcNow.AddDays(2);

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                claims: claims,
                expires: expiration,
                signingCredentials: credentials
            );

            return new AuthResponseDto
            {
                UserId = user.Id,
                Name = user.Name,
                Email = user.Email!,
                Role = role ?? "",
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                TokenExpiration = expiration
            };
        }
    }
}
