using TFL.Application.DTOs;
using TFL.Application.Interfaces;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;

namespace TFL.Application.Services;

public class NotificationService(
    IEmailService emailService,
    IPushService pushService,
    IPushSubscriptionRepository pushSubscriptionRepository,
    IExternalMailRepository externalMailRepository,
    IAppUserRepository userRepository)
{
    public async Task SendGameEventCreatedAsync(string eventName, string matchDate)
    {
        var subject = $"TFL: New game event on {matchDate}";
        var body = $"<p>A new game event has been scheduled: <strong>{eventName}</strong> on {matchDate}.</p>";

        var externalEmails = (await externalMailRepository.GetAllActiveAsync()).Select(e => e.Email).ToList();
        if (externalEmails.Any())
            await emailService.SendAsync(externalEmails, subject, body);

        // Push to all subscribed users
        var users = await userRepository.GetAllAsync();
        foreach (var user in users.Where(u => u.Approved && u.IsActive))
        {
            var subscriptions = await pushSubscriptionRepository.GetByUserIdAsync(user.Id);
            foreach (var sub in subscriptions)
            {
                await pushService.SendAsync(sub.Endpoint, sub.P256dh, sub.Auth,
                    $"{{\"title\":\"New game event\",\"body\":\"Game on {matchDate}\"}}");
            }
        }
    }

    public async Task SubscribeAsync(string userId, PushSubscribeRequest request)
    {
        var existing = await pushSubscriptionRepository.GetByEndpointAsync(request.Endpoint);
        if (existing is not null) return;

        await pushSubscriptionRepository.CreateAsync(new PushSubscription
        {
            UserId = userId,
            Endpoint = request.Endpoint,
            P256dh = request.Keys.P256dh,
            Auth = request.Keys.Auth
        });
    }

    public async Task UnsubscribeAsync(string endpoint)
    {
        await pushSubscriptionRepository.DeleteByEndpointAsync(endpoint);
    }
}
