using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CarRental.Controllers.Customer
{
    [Authorize]
    public class CustomerDashboardController : Controller
    {

        public IActionResult Index()
        {
            return View();
        }
    }
}
