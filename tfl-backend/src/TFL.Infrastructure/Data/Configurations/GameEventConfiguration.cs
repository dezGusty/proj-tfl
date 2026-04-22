using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TFL.Domain.Entities;

namespace TFL.Infrastructure.Data.Configurations;

public class GameEventConfiguration : IEntityTypeConfiguration<GameEvent>
{
    public void Configure(EntityTypeBuilder<GameEvent> builder)
    {
        builder.HasKey(e => e.Name);
        builder.HasIndex(e => e.Inactive).HasDatabaseName("IX_GameEvents_Inactive");
        builder.HasIndex(e => e.MatchDate).HasDatabaseName("IX_GameEvents_MatchDate");

        builder.HasMany(e => e.Registrations)
            .WithOne(r => r.GameEvent)
            .HasForeignKey(r => r.GameEventName)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
