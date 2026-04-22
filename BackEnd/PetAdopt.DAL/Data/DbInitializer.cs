using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PetAdopt.DAL.Models;

namespace PetAdopt.DAL.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(IServiceProvider services, IConfiguration Configuration)
    {
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

        string[] roles = { "Admin", "Shelter", "PetOwner", "Adopter" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }

        var adminEmail = Configuration["AdminSettings:Email"];
        var adminPassword = Configuration["AdminSettings:Password"];
        var adminUser = await userManager.FindByEmailAsync(adminEmail!);

        if (adminUser == null)
        {
            var admin = new ApplicationUser
            {
                Name = "Admin",
                Email = adminEmail,
                UserName = adminEmail,
                IsApproved = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var result = await userManager.CreateAsync(admin, adminPassword!);

            if (result.Succeeded)
                await userManager.AddToRoleAsync(admin, "Admin");
        }
    }
}