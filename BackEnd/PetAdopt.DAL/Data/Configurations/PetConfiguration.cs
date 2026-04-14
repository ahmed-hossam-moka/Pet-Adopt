using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetAdopt.DAL.Models;

namespace PetAdopt.DAL.Data.Configurations
{
    public class PetConfiguration : IEntityTypeConfiguration<Pet>
    {
        public void Configure(EntityTypeBuilder<Pet> builder)
        {
            builder.HasKey(p => p.PetId);

            builder.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(p => p.AnimalType)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(p => p.Breed)
                .HasMaxLength(100);

            builder.Property(p => p.HealthStatus)
                .HasMaxLength(255);

            builder.Property(p => p.Location)
                .HasMaxLength(255);

            builder.Property(p => p.Description)
                .HasColumnType("nvarchar(max)");

            builder.Property(p => p.Gender)
                .HasConversion<string>();   

            builder.Property(p => p.Status)
                .HasConversion<string>()   
                .HasDefaultValue(PetStatus.Available);

            builder.Property(p => p.IsApproved)
                .HasDefaultValue(false);

            builder.Property(p => p.IsDeleted)
                .HasDefaultValue(false);

            builder.Property(p => p.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            builder.HasOne(p => p.Owner)
                .WithMany(u => u.Pets)
                .HasForeignKey(p => p.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}