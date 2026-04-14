using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetAdopt.DAL.Models;

namespace PetAdopt.DAL.Data.Configurations
{
    public class AdoptionRequestConfiguration : IEntityTypeConfiguration<AdoptionRequest>
    {
        public void Configure(EntityTypeBuilder<AdoptionRequest> builder)
        {
            builder.HasKey(r => r.RequestId);

            builder.Property(r => r.Status)
                .HasConversion<string>()
                .HasDefaultValue(RequestStatus.Pending);

            builder.Property(r => r.Message)
                .HasColumnType("nvarchar(max)");

            builder.Property(r => r.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            builder.HasIndex(r => new { r.PetId, r.AdopterId })
                .IsUnique();

            builder.HasOne(r => r.Pet)
                .WithMany(p => p.AdoptionRequests)
                .HasForeignKey(r => r.PetId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(r => r.Adopter)
                .WithMany(u => u.AdoptionRequests)
                .HasForeignKey(r => r.AdopterId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}