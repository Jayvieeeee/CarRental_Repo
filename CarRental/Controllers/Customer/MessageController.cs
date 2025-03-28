using Microsoft.AspNetCore.Mvc;

namespace CarRental.Controllers.Customer
{
    public class MessageController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
