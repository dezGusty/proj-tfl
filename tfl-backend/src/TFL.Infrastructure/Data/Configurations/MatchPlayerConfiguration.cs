using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TFL.Domain.Entities;

namespace TFL.Infrastructure.Data.Configurations;

public class MatchPlayerConfiguration : IEntityTypeConfiguration<MatchPlayer>
{
    public void Configure(EntityTypeBuilder<MatchPlayer> builder)
    {
        builder.HasKey(mp => mp.Id);
        builder.HasIndex(mp => new { mp.MatchDateKey, mp.PlayerId })
            .IsUnique()
            .HasDatabaseName("UX_MatchPlayers_MatchDateKey_PlayerId");
    }
}
