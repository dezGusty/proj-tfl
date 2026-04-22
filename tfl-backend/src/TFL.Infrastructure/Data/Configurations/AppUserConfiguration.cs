using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TFL.Domain.Entities;

namespace TFL.Infrastructure.Data.Configurations;

public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
{
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Email).IsRequired();
        builder.HasIndex(u => u.Email).IsUnique().HasDatabaseName("IX_AppUsers_Email");

        builder.HasOne(u => u.LinkedPlayer)
            .WithMany()
            .HasForeignKey(u => u.LinkedPlayerId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(u => u.PushSubscriptions)
            .WithOne(ps => ps.User)
            .HasForeignKey(ps => ps.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
