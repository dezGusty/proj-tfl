using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TFL.Domain.Entities;

namespace TFL.Infrastructure.Data.Configurations;

public class PlayerConfiguration : IEntityTypeConfiguration<Player>
{
    public void Configure(EntityTypeBuilder<Player> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Name).IsRequired();
        builder.Property(p => p.Rating).IsRequired();
        builder.Property(p => p.LastModified).IsRequired();
        builder.HasIndex(p => p.IsArchived).HasDatabaseName("IX_Players_IsArchived");
        builder.HasIndex(p => p.LastModified).HasDatabaseName("IX_Players_LastModified");

        builder.HasOne(p => p.LinkedUser)
            .WithMany()
            .HasForeignKey(p => p.LinkedUserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(p => p.RecentEntries)
            .WithOne(e => e.Player)
            .HasForeignKey(e => e.PlayerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
