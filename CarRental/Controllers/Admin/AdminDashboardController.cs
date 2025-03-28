using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CarRental.Controllers.Admin
{

    [Authorize(Roles = "Admin")]
    public class AdminDashboardController : Controller
    {
        public IActionResult AdminDashboard()
        {
            return View();
        }
    }
}
