using Microsoft.EntityFrameworkCore;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;
using TFL.Infrastructure.Data;

namespace TFL.Infrastructure.Data.Repositories;

public class DraftRepository(TflDbContext db) : IDraftRepository
{
    public async Task<Draft> GetAsync()
    {
        var draft = await db.Drafts
            .Include(d => d.DraftPlayers)
            .FirstOrDefaultAsync(d => d.Id == 1);

        if (draft is null)
        {
            draft = new Draft { Id = 1, LastModified = DateTime.UtcNow };
            db.Drafts.Add(draft);
            await db.SaveChangesAsync();
        }

        return draft;
    }

    public async Task<Draft> SaveAsync(Draft draft)
    {
        var existing = await db.Drafts
            .Include(d => d.DraftPlayers)
            .FirstOrDefaultAsync(d => d.Id == 1);

        if (existing is null)
        {
            db.Drafts.Add(draft);
        }
        else
        {
            db.DraftPlayers.RemoveRange(existing.DraftPlayers);
            existing.LastModified = draft.LastModified;
            foreach (var dp in draft.DraftPlayers)
            {
                dp.DraftId = 1;
                existing.DraftPlayers.Add(dp);
            }
        }

        await db.SaveChangesAsync();
        return existing ?? draft;
    }
}
