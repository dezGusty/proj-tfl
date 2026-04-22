using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TFL.Domain.Entities;

namespace TFL.Infrastructure.Data.Configurations;

public class DraftConfiguration : IEntityTypeConfiguration<Draft>
{
    public void Configure(EntityTypeBuilder<Draft> builder)
    {
        builder.HasKey(d => d.Id);
        builder.HasMany(d => d.DraftPlayers)
            .WithOne(dp => dp.Draft)
            .HasForeignKey(dp => dp.DraftId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
