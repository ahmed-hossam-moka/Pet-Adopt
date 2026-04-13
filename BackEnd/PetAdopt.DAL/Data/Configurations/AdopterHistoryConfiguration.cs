using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetAdopt.DAL.Models;

namespace PetAdopt.DAL.Data.Configurations
{
    public class AdopterHistoryConfiguration : IEntityTypeConfiguration<AdopterHistory>
    {
        public void Configure(EntityTypeBuilder<AdopterHistory> builder)
        {
            builder.HasKey(h => h.HistoryId);

            builder.Property(h => h.PreviousPetName)
                .HasMaxLength(100);

            builder.Property(h => h.PreviousPetType)
                .HasMaxLength(50);

            builder.Property(h => h.VeterinaryReference)
                .HasMaxLength(255);

            builder.Property(h => h.Experience)
                .HasColumnType("nvarchar(max)");

            // Relationship → Adopter
            builder.HasOne(h => h.Adopter)
                .WithMany(u => u.AdopterHistories)
                .HasForeignKey(h => h.AdopterId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}