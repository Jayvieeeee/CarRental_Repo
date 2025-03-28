using System.Diagnostics;
using CarRental.Models.Entites;
using CarRental.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Collections.Generic;
using CarRental.Views.CarList.Data;

namespace CarRental.Controllers.Guest
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly AppDbContext _context; // Add database context

        public HomeController(ILogger<HomeController> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var cars = await _context.Cars
                .OrderBy(c => c.CarId)
                .ToListAsync();


            return View( cars);
        }

     

        public IActionResult Privacy()
        {
            return View();
        }

        [HttpPost]
     

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
