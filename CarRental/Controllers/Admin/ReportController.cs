using Microsoft.AspNetCore.Mvc;

namespace CarRental.Controllers.Admin
{
    public class ReportController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
