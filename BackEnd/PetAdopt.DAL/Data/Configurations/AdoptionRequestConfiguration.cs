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

            // Unique: نفس الـ Adopter مينفعش يتقدم على نفس الـ Pet أكتر من مرة
            builder.HasIndex(r => new { r.PetId, r.AdopterId })
                .IsUnique();

            // Relationship → Pet
            builder.HasOne(r => r.Pet)
                .WithMany(p => p.AdoptionRequests)
                .HasForeignKey(r => r.PetId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relationship → Adopter
            builder.HasOne(r => r.Adopter)
                .WithMany(u => u.AdoptionRequests)
                .HasForeignKey(r => r.AdopterId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}