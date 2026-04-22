using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TFL.Domain.Entities;

namespace TFL.Infrastructure.Data.Configurations;

public class SyncConflictConfiguration : IEntityTypeConfiguration<SyncConflict>
{
    public void Configure(EntityTypeBuilder<SyncConflict> builder)
    {
        builder.HasKey(c => c.Id);
        builder.HasIndex(c => new { c.EntityType, c.EntityKey })
            .IsUnique()
            .HasDatabaseName("UX_SyncConflicts_EntityType_EntityKey");
    }
}
