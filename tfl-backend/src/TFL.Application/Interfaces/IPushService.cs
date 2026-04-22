namespace TFL.Application.Interfaces;

public interface IPushService
{
    Task SendAsync(string endpoint, string p256dh, string auth, string payload);
}
