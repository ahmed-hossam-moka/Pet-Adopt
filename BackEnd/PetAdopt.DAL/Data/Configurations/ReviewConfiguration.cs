using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetAdopt.DAL.Models;

namespace PetAdopt.DAL.Data.Configurations
{
    public class ReviewConfiguration : IEntityTypeConfiguration<Review>
    {
        public void Configure(EntityTypeBuilder<Review> builder)
        {
            builder.HasKey(r => r.ReviewId);

            builder.Property(r => r.Rating)
                .IsRequired();

            builder.Property(r => r.Comment)
                .HasColumnType("nvarchar(max)");

            builder.Property(r => r.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Unique: review واحدة بس لكل adoption
            builder.HasIndex(r => new { r.ReviewerId, r.PetId })
                .IsUnique();

            // Relationship → Pet
            builder.HasOne(r => r.Pet)
                .WithMany(p => p.Reviews)
                .HasForeignKey(r => r.PetId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relationship → Reviewer (Adopter)
            builder.HasOne(r => r.Reviewer)
                .WithMany(u => u.ReviewsGiven)
                .HasForeignKey(r => r.ReviewerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relationship → Owner
            builder.HasOne(r => r.Owner)
                .WithMany(u => u.ReviewsReceived)
                .HasForeignKey(r => r.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}