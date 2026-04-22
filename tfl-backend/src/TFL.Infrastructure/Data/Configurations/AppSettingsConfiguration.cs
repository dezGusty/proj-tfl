using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TFL.Domain.Entities;

namespace TFL.Infrastructure.Data.Configurations;

public class AppSettingsConfiguration : IEntityTypeConfiguration<AppSettings>
{
    public void Configure(EntityTypeBuilder<AppSettings> builder)
    {
        builder.HasKey(s => s.Id);
        builder.HasData(new AppSettings
        {
            Id = 1,
            AutoSave = true,
            ShowPlayerStatusIcons = true,
            AutoNavigateToTransferredDraft = true,
            RandomizePlayerOrder = false,
            RecentMatchesToStore = 8,
            DefaultMatchSchedule = """[{"dayOfWeek":2,"time":"20:00"},{"dayOfWeek":4,"time":"20:00"}]"""
        });
    }
}
