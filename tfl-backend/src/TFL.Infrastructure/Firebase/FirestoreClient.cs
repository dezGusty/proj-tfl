using Google.Cloud.Firestore;
using TFL.Application.Interfaces;

namespace TFL.Infrastructure.Firebase;

public class FirestoreClient : IFirestoreClient
{
    private readonly FirestoreDb _db;

    public FirestoreClient(string projectId, string? serviceAccountKeyPath = null)
    {
        if (!string.IsNullOrEmpty(serviceAccountKeyPath))
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", serviceAccountKeyPath);

        _db = FirestoreDb.Create(projectId);
    }

    public async Task<IReadOnlyList<FirestoreDocumentSnapshot>> GetCollectionAsync(string collectionPath)
    {
        var collection = _db.Collection(collectionPath);
        var snapshot = await collection.GetSnapshotAsync();
        return snapshot.Documents
            .Select(doc => new FirestoreDocumentSnapshot(
                doc.Reference.Path,
                doc.ToDictionary().ToDictionary(
                    kv => kv.Key,
                    kv => (object?)kv.Value),
                doc.UpdateTime.HasValue
                    ? new DateTimeOffset(doc.UpdateTime.Value.ToDateTime())
                    : DateTimeOffset.UtcNow))
            .ToList();
    }

    public async Task<FirestoreDocumentSnapshot?> GetDocumentAsync(string documentPath)
    {
        var parts = documentPath.Split('/', 2);
        if (parts.Length < 2) return null;

        var docRef = _db.Document(documentPath);
        var snapshot = await docRef.GetSnapshotAsync();
        if (!snapshot.Exists) return null;

        return new FirestoreDocumentSnapshot(
            snapshot.Reference.Path,
            snapshot.ToDictionary().ToDictionary(
                kv => kv.Key,
                kv => (object?)kv.Value),
            snapshot.UpdateTime.HasValue
                ? new DateTimeOffset(snapshot.UpdateTime.Value.ToDateTime())
                : DateTimeOffset.UtcNow);
    }

    public async Task SetDocumentAsync(string documentPath, object data)
    {
        var docRef = _db.Document(documentPath);
        await docRef.SetAsync(data);
    }

    public async Task<bool> DocumentExistsAsync(string documentPath)
    {
        var docRef = _db.Document(documentPath);
        var snapshot = await docRef.GetSnapshotAsync();
        return snapshot.Exists;
    }
}
