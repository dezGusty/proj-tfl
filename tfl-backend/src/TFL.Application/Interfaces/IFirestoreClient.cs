namespace TFL.Application.Interfaces;

public record FirestoreDocumentSnapshot(
    string DocumentPath,
    IReadOnlyDictionary<string, object?> Fields,
    DateTimeOffset UpdateTime);

public interface IFirestoreClient
{
    Task<IReadOnlyList<FirestoreDocumentSnapshot>> GetCollectionAsync(string collectionPath);
    Task<FirestoreDocumentSnapshot?> GetDocumentAsync(string documentPath);
    Task SetDocumentAsync(string documentPath, object data);
    Task<bool> DocumentExistsAsync(string documentPath);
}
