using CarRental.Views.CarList.Data;
using Microsoft.AspNetCore.Mvc;
using CarRental.Models.Entites;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CarRental.Controllers.Shared
{
    [ApiController]
    [Route("shared/messages")]
    public class MessageController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MessageController(AppDbContext context)
        {
            _context = context;
        }

        // Customer sends message (requires subject)
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            if (message == null || string.IsNullOrEmpty(message.Subject) || string.IsNullOrEmpty(message.MessageText))
                return BadRequest("Subject and Message are required!");

            message.SentAt = DateTime.Now;
            message.Status = "unread";
            message.ReplyToMessageId = null; // New message, no parent message

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Message sent successfully!" });
        }

        // Admin replies to a message (no subject needed)
        [HttpPost("reply")]
        public async Task<IActionResult> ReplyToMessage([FromBody] Message reply)
        {
            if (reply == null || reply.ReplyToMessageId == null || string.IsNullOrEmpty(reply.MessageText))
                return BadRequest("Reply must be linked to a message and must have text.");

            // Check if the original message exists
            var originalMessage = await _context.Messages.FindAsync(reply.ReplyToMessageId);
            if (originalMessage == null)
                return NotFound("Original message not found!");

            reply.SentAt = DateTime.Now;
            reply.Status = "unread";
            reply.Subject = originalMessage.Subject; // Use the original subject

            _context.Messages.Add(reply);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Reply sent successfully!" });
        }

        // Get all messages in a conversation
        [HttpGet("conversation/{userId}/{otherUserId}")]
        public async Task<IActionResult> GetConversation(int userId, int otherUserId)
        {
            var messages = await _context.Messages
                .Where(m =>
                    (m.SenderId == userId && m.ReceiverId == otherUserId) ||
                    (m.SenderId == otherUserId && m.ReceiverId == userId))
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            return Ok(messages);
        }
    }
}
