using PetAdopt.API.Extensions;
using PetAdopt.API.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.AddAppServices();

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors("AllowAll");

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "PetAdopt API V1");
    c.RoutePrefix = string.Empty;
});

app.UseAuthentication();
app.UseAuthorization();

await app.SeedDatabaseAsync(); 

app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");

app.Run();