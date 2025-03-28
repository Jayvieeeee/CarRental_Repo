using Microsoft.AspNetCore.Mvc;
using System.Linq;
using CarRental.Models.Entites;
using CarRental.Views.CarList.Data;
using Microsoft.EntityFrameworkCore;

namespace CarRental.Controllers.Admin
{
    [Route("Admin/Rentals")]
    public class TransactionController : Controller
    {
        private readonly AppDbContext _context;

        public TransactionController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet("Requests")]
        public IActionResult RentalRequests()
        {
            var requests = _context.RentalRequests.Where(r => r.Status == "Pending").ToList();
            return View(requests);
        }


        /*[HttpPost]
        [Route("ApproveRentalRequest")]
        public async Task<IActionResult> ApproveRentalRequest(int requestId)
        {
            var rentalRequest = await _context.RentalRequests
                .Include(r => r.Renters)
                .FirstOrDefaultAsync(r => r.RequestId == requestId);

            if (rentalRequest == null)
            {
                return NotFound(new { success = false, message = "Rental request not found." });
            }

            // Check if it's already approved
            if (rentalRequest.Status == "Approved")
            {
                return BadRequest(new { success = false, message = "This rental request has already been approved." });
            }

            // Add user details to Renters table
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == rentalRequest.Id);

            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found." });
            }

            var newRenter = new Renters
            {
                UserAccountId = user.Id,
                ContactNo = rentalRequest.ContactNo,
                LicenseNo = rentalRequest.LicenseNo,
                Address = rentalRequest.Address
            };

            _context.Renters.Add(newRenter);

            // Update rental request status
            rentalRequest.Status = "Approved";

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Rental request approved and user added to Renters." });
        }*/

        [HttpPost("Approve/{id}")]
        public IActionResult ApproveRental(int id)
        {
            var request = _context.RentalRequests.Find(id);
            if (request == null) return NotFound();


            //var rental = new Rentals
            //{
            //    CarId = request.CarId,
            //    RenterId = request.RenterId,
            //    RentalDate = request.RentalDate,
            //    ReturnDate = request.ReturnDate,
            //    Status = "Ongoing"
            //};

            //_context.Rentals.Add(rental);
            _context.RentalRequests.Remove(request);
            _context.SaveChanges();

            TempData["SuccessMessage"] = "Rental request approved!";
            return RedirectToAction("RentalRequests");
        }

        [HttpPost("Reject/{id}")]
        public IActionResult RejectRental(int id)
        {
            var request = _context.RentalRequests.Find(id);
            if (request == null) return NotFound();

            _context.RentalRequests.Remove(request);
            _context.SaveChanges();

            TempData["ErrorMessage"] = "Rental request rejected!";
            return RedirectToAction("RentalRequests");
        }


        [HttpGet("Ongoing")]
        public IActionResult OngoingRentals()
        {
            var rentals = _context.Rentals.Where(r => r.Status == "Ongoing").ToList();
            return View(rentals);
        }


        [HttpGet("History")]
        public IActionResult RentalHistory()
        {
            var rentals = _context.Rentals.Where(r => r.Status == "Completed").ToList();
            return View(rentals);
        }

        [HttpPost("Cancel/{id}")]
        public IActionResult CancelRental(int id)
        {
            var rental = _context.Rentals.Find(id);
            if (rental == null) return NotFound();

            rental.Status = "Canceled";
            _context.SaveChanges();

            TempData["WarningMessage"] = "Rental has been canceled!";
            return RedirectToAction("OngoingRentals");
        }
    }
}
