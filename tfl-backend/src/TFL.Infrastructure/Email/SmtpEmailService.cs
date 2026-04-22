using MailKit.Net.Smtp;
using MimeKit;
using TFL.Application.Interfaces;

namespace TFL.Infrastructure.Email;

public class SmtpEmailService(
    string host, int port, string username, string password,
    string fromAddress, string fromName) : IEmailService
{
    public async Task SendAsync(IEnumerable<string> recipients, string subject, string htmlBody)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(fromName, fromAddress));
        foreach (var recipient in recipients)
            message.To.Add(MailboxAddress.Parse(recipient));
        message.Subject = subject;
        message.Body = new TextPart("html") { Text = htmlBody };

        using var client = new SmtpClient();
        await client.ConnectAsync(host, port, MailKit.Security.SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(username, password);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}
