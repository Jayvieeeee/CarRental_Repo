using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace CarRental.Services.Email
{
    public class EmailService
    {
        private readonly EmailSettings _emailSettings;

        public EmailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        public void SendVerificationEmail(string recipientEmail, string code)
        {
            var smtpClient = new SmtpClient(_emailSettings.SmtpServer)
            {
                Port = _emailSettings.Port,
                Credentials = new NetworkCredential(_emailSettings.SenderEmail, _emailSettings.SenderPassword),
                EnableSsl = true,
                UseDefaultCredentials = false

            };


            var mailMessage = new MailMessage
            {
                From = new MailAddress(_emailSettings.SenderEmail),
                Subject = "Password Reset Code",
                Body = $"Your verification code is: {code}",
                IsBodyHtml = false,
            };

            mailMessage.To.Add(recipientEmail);
            smtpClient.Send(mailMessage);
        }
    }
}
