using Microsoft.AspNetCore.Mvc;

namespace CarRental.Controllers.Customer
{
    public class ProfileController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult ResetPassword()
        {
            return View();
        }
    }
}
