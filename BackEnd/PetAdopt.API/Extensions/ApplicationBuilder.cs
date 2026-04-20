using PetAdopt.DAL.Data;

namespace PetAdopt.API.Extensions;

public static class ApplicationBuilder
{
    public static async Task SeedDatabaseAsync(this IApplicationBuilder app)
    {
        try
        {
            using var scope = app.ApplicationServices.CreateScope();

            var services = scope.ServiceProvider;
            var config = services.GetRequiredService<IConfiguration>();

            await DbInitializer.SeedAsync(services, config);
        }
        catch (Exception ex)
        {
            var logger = app.ApplicationServices
                            .GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "Error occurred while seeding database");
        }
    }
}