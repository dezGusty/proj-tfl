using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TFL.Domain.Entities;

namespace TFL.Infrastructure.Data.Configurations;

public class DraftPlayerConfiguration : IEntityTypeConfiguration<DraftPlayer>
{
    public void Configure(EntityTypeBuilder<DraftPlayer> builder)
    {
        builder.HasKey(dp => dp.Id);
        builder.HasIndex(dp => new { dp.DraftId, dp.PlayerId })
            .IsUnique()
            .HasDatabaseName("UX_DraftPlayers_DraftId_PlayerId");
    }
}
