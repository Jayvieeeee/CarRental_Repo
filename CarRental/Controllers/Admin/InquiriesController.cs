using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using CarRental.Models;
using CarRental.Hubs;
using System.Threading.Tasks;
using CarRental.Models.Entites;
using CarRental.Views.CarList.Data;

namespace CarRental.Controllers.Admin
{
    [Route("admin/inquiries")]
    public class InquiriesController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public InquiriesController(AppDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpPost("submit")]
        public async Task<IActionResult> SubmitInquiry(CustomerInquiry model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

     
            _context.CustomerInquiries.Add(model);
            await _context.SaveChangesAsync();

     
            var notification = new Notification
            {
                Title = "📩 New Customer Inquiry",
                Message = $"New inquiry from {model.Name}",
                Type = "Inquiry"
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // Notify Admin via SignalR
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", notification.Title, notification.Message);

            // Redirect to Contact Us page with success message
            TempData["SuccessMessage"] = "Your message has been sent successfully!";
            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public IActionResult Index()
        {
            var inquiries = _context.CustomerInquiries.ToList();
            return View(inquiries);
        }
    }
}
