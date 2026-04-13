using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetAdopt.DAL.Models;

namespace PetAdopt.DAL.Data.Configurations
{
    public class FavoriteConfiguration : IEntityTypeConfiguration<Favorite>
    {
        public void Configure(EntityTypeBuilder<Favorite> builder)
        {
            builder.HasKey(f => f.FavoriteId);

            builder.Property(f => f.SavedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            builder.HasIndex(f => new { f.AdopterId, f.PetId })
                .IsUnique();

            // Relationship → Adopter
            builder.HasOne(f => f.Adopter)
                .WithMany(u => u.Favorites)
                .HasForeignKey(f => f.AdopterId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relationship → Pet
            builder.HasOne(f => f.Pet)
                .WithMany(p => p.Favorites)
                .HasForeignKey(f => f.PetId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}