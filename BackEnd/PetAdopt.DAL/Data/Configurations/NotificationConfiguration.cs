
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetAdopt.DAL.Models;

namespace PetAdopt.DAL.Data.Configurations
{
    public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            builder.HasKey(n => n.Id);

            builder.Property(n => n.UserId)
                    .IsRequired();

            builder.Property(n => n.Message)
                    .IsRequired()
                    .HasMaxLength(500);

            builder.Property(n => n.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

            builder.Property(n => n.IsRead)
                    .HasDefaultValue(false);

            builder.HasOne(n => n.User)
                    .WithMany(n => n.Notifications)
                    .HasForeignKey(n => n.UserId);

        }
    }
}