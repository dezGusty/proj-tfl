using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TFL.Domain.Entities;

namespace TFL.Infrastructure.Data.Configurations;

public class ExternalMailEntryConfiguration : IEntityTypeConfiguration<ExternalMailEntry>
{
    public void Configure(EntityTypeBuilder<ExternalMailEntry> builder)
    {
        builder.HasKey(e => e.Id);
        builder.HasIndex(e => e.Email).IsUnique();
    }
}
