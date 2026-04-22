using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PetAdopt.DAL.Models;

namespace PetAdopt.DAL.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Pet> Pets { get; set; }
        public DbSet<PetImage> PetImages { get; set; }
        public DbSet<AdoptionRequest> AdoptionRequests { get; set; }
        public DbSet<AdopterHistory> AdopterHistories { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(AppDbContext).Assembly
            );
        }
    }
}