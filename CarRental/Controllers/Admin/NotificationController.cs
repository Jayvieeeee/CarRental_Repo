using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Linq;
using CarRental.Hubs;
using CarRental.Models;
using CarRental.Views.CarList.Data;
using System;
using CarRental.Models.Entites;

namespace CarRental.Controllers.Admin
{
    [Route("api/admin/notification")]
    public class NotificationController : Controller
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly AppDbContext _context;

        public NotificationController(IHubContext<NotificationHub> hubContext, AppDbContext context)
        {
            _hubContext = hubContext;
            _context = context;
        }

        [HttpGet]
        public IActionResult Index()
        {
            var notifications = _context.Notifications.OrderByDescending(n => n.CreatedAt).ToList();
            return View(notifications);
        }

        [HttpPost("send-message")]
        public async Task<IActionResult> SendRentalRequestNotification()
        {
            var notification = new Notification
            {
                Title = "📌 New Rental Request",
                Message = "User123 requested to rent a car.",
                CreatedAt = DateTime.Now
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveNotification", notification);
            return Ok(new { message = "Notification sent successfully!" });
        }

        [HttpPost("send-message2")]
        public async Task<IActionResult> SendMessageNotification()
        {
            var notification = new Notification
            {
                Title = "📩 New Customer Message",
                Message = "User456 sent an inquiry.",
                CreatedAt = DateTime.Now
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveNotification", notification);
            return Ok(new { message = "Message notification sent!" });
        }
    }
}
