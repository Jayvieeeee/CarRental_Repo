using Microsoft.AspNetCore.Mvc;
using CarRental.Models.Entites;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using CarRental.Hubs;
using CarRental.Models.ViewModels;
using CarRental.Views.CarList.Data;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CarRental.Controllers.Customer
{
    [Route("api/customer/rentcar")]
    public class RentCarController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public RentCarController(AppDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpPost]
        [Route("RequestRental")]
        public async Task<IActionResult> RequestRental([FromBody] RentalRequestViewModel model)
        {

            var userId = GetCurrentUserId();
            if (userId == null)
            {
               return Unauthorized(new { success = false, message = "User not authenticated." });
            }

            // Create Rental Request object
            var request = new RentalRequest
            {
                CarId = model.CarId,
                RentalDate = model.RentalDate,
                ReturnDate = model.ReturnDate,
                EstimatedPrice = model.EstimatedPrice,
                Status = "Pending", // Default status
                UserId = userId.Value,
                ContactNo = model.ContactNo,
                LicenseNo = model.LicenseNo,
                Address = model.Address
            };

            // Save request to the database
            try
            {
                _context.RentalRequests.Add(request);
                await _context.SaveChangesAsync();

                // Send real-time notification via SignalR
                await _hubContext.Clients.All.SendAsync("ReceiveNotification", "New rental request received!");

                return Ok(new { success = true, message = "Rental request sent successfully!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Database Error: " + ex.Message);
                return StatusCode(500, new { success = false, message = "Internal server error. Please try again later." });
            }
        }

        private List<string> ValidateRentalRequest(RentalRequestViewModel model)
        {
            var errors = new List<string>();

            if (model.CarId <= 0)
                errors.Add("Invalid car ID.");

            if (model.RentalDate == DateTime.MinValue || model.ReturnDate == DateTime.MinValue)
                errors.Add("Invalid rental or return date.");

            if (model.ReturnDate <= model.RentalDate)
                errors.Add("Return date must be later than rental date.");

            if (model.EstimatedPrice <= 0)
                errors.Add("Estimated price must be a positive value.");

            if (string.IsNullOrWhiteSpace(model.ContactNo))
                errors.Add("Contact number is required.");

            if (string.IsNullOrWhiteSpace(model.LicenseNo))
                errors.Add("License number is required.");

            if (string.IsNullOrWhiteSpace(model.Address))
                errors.Add("Address is required.");

            return errors;
        }




        [HttpGet]
        public IActionResult Index()
        {

            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return RedirectToAction("Login", "Account");
            }

            ViewBag.UserId = userId; 

            var user = _context.UserAccounts.FirstOrDefault(u => u.UserId == userId);

            if (user != null)
            {
                ViewBag.FirstName = user.FirstName;
                ViewBag.LastName = user.LastName;
                ViewBag.Email = user.Email;
            }
            else
            {
                ViewBag.FirstName = "";
                ViewBag.LastName = "";
                ViewBag.Email = "";
            }

            var cars = _context.Cars.ToList();
            return View(cars);

        }


        [HttpPost("Cancel/{id}")]
        public IActionResult CancelRequest(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized();

            var request = _context.RentalRequests.Find(id);
            if (request == null || request.UserId != userId.Value) return NotFound();

            if (request.Status == "Pending")
            {
                _context.RentalRequests.Remove(request);
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Rental request canceled!";
            }
            else
            {
                TempData["ErrorMessage"] = "Cannot cancel processed request!";
            }

            return RedirectToAction("Index");
        }

        private int? GetCurrentUserId()
        {

    
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
           
            
            int? userId = userIdClaim != null ? int.Parse(userIdClaim.Value) : (int?)null;

            Console.WriteLine("User Claims: " + string.Join(", ", User.Claims.Select(c => c.Type + "=" + c.Value)));

            Console.WriteLine($"🔍 Extracted User ID: {userId}");
            return userId;

        
        }

    }

}
