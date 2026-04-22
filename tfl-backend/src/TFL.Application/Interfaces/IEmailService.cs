namespace TFL.Application.Interfaces;

public interface IEmailService
{
    Task SendAsync(IEnumerable<string> recipients, string subject, string htmlBody);
}
