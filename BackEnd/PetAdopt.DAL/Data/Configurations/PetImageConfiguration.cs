using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetAdopt.DAL.Models;

namespace PetAdopt.DAL.Data.Configurations
{
    public class PetImageConfiguration : IEntityTypeConfiguration<PetImage>
    {
        public void Configure(EntityTypeBuilder<PetImage> builder)
        {
            builder.HasKey(i => i.ImageId);

            builder.Property(i => i.ImageUrl)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(i => i.IsPrimary)
                .HasDefaultValue(false);

            builder.Property(i => i.UploadedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Relationship → Pet
            builder.HasOne(i => i.Pet)
                .WithMany(p => p.Images)
                .HasForeignKey(i => i.PetId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}