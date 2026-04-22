using WebPush;
using TFL.Application.Interfaces;

namespace TFL.Infrastructure.Push;

public class VapidPushService(string publicKey, string privateKey, string subject) : IPushService
{
    private readonly WebPushClient _client = new();

    public async Task SendAsync(string endpoint, string p256dh, string auth, string payload)
    {
        var subscription = new PushSubscription(endpoint, p256dh, auth);
        var vapidDetails = new VapidDetails(subject, publicKey, privateKey);
        await _client.SendNotificationAsync(subscription, payload, vapidDetails);
    }
}
