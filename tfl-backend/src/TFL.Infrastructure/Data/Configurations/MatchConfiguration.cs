using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TFL.Domain.Entities;

namespace TFL.Infrastructure.Data.Configurations;

public class MatchConfiguration : IEntityTypeConfiguration<Match>
{
    public void Configure(EntityTypeBuilder<Match> builder)
    {
        builder.HasKey(m => m.DateKey);
        builder.HasIndex(m => m.LastModified).HasDatabaseName("IX_Matches_LastModified");
        builder.HasIndex(m => m.Status).HasDatabaseName("IX_Matches_Status");

        builder.HasMany(m => m.MatchPlayers)
            .WithOne(mp => mp.Match)
            .HasForeignKey(mp => mp.MatchDateKey)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
