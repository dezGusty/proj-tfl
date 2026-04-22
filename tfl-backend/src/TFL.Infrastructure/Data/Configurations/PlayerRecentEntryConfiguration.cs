using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TFL.Domain.Entities;

namespace TFL.Infrastructure.Data.Configurations;

public class PlayerRecentEntryConfiguration : IEntityTypeConfiguration<PlayerRecentEntry>
{
    public void Configure(EntityTypeBuilder<PlayerRecentEntry> builder)
    {
        builder.HasKey(e => e.Id);
        builder.HasIndex(e => e.PlayerId).HasDatabaseName("IX_PlayerRecentEntries_PlayerId");
    }
}
