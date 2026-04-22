using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TFL.Domain.Entities;

namespace TFL.Infrastructure.Data.Configurations;

public class GameEventRegistrationConfiguration : IEntityTypeConfiguration<GameEventRegistration>
{
    public void Configure(EntityTypeBuilder<GameEventRegistration> builder)
    {
        builder.HasKey(r => r.Id);
        builder.HasIndex(r => new { r.GameEventName, r.PlayerId })
            .IsUnique()
            .HasDatabaseName("UX_GameEventRegistrations_EventName_PlayerId");
    }
}
