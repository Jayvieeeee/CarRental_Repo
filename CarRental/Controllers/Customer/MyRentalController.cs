using Microsoft.AspNetCore.Mvc;

namespace CarRental.Controllers.Customer
{
    public class MyRentalController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
