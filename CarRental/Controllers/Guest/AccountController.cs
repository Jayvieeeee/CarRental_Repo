using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarRental.Models.Entites;
using CarRental.Models.ViewModels;
using CarRental.Services.Email;
using CarRental.Services.Password;
using CarRental.Views.CarList.Data;

namespace CarRental.Controllers.Guest
{
    [Route("Guest/Account")]
    public class AccountController : Controller
    {
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;

        public AccountController(AppDbContext accesDb, EmailService emailService)
        {
            _context = accesDb;
            _emailService = emailService;
        }

        [Route("")]
        public IActionResult Index()
        {
            return View(_context.UserAccounts.ToList());
        }

        [Route("Signup")]
        public IActionResult Signup()
        {
            return View();
        }

        [HttpPost]
        [Route("Signup")]
        public IActionResult Signup(SignupViewModel model)
        {
            if (ModelState.IsValid)
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        bool userExists = _context.UserAccounts.Any(u => u.Email == model.Email || u.Username == model.Username);
                        if (userExists)
                        {
                            ModelState.AddModelError("", "Email or Username is already taken. Please choose another.");
                            return View(model);
                        }

                        UserAccount account = new UserAccount
                        {
                            Email = model.Email,
                            FirstName = model.FirstName,
                            LastName = model.LastName,
                            Password = PasswordHelper.HashPassword(model.Password),
                            Username = model.Username,
                            Role = "User"
                        };

                        _context.UserAccounts.Add(account);
                        _context.SaveChanges();
                        transaction.Commit();

                        ModelState.Clear();
                        ViewBag.Message = $"{account.FirstName} {account.LastName} registered successfully. Please login.";
                        return RedirectToAction("Login", "Account");
                    }
                    catch (DbUpdateException ex)
                    {
                        transaction.Rollback();
                        ModelState.AddModelError("", $"Database Error: {ex.InnerException?.Message}");
                        Console.WriteLine($"Database Error: {ex.InnerException?.Message}");
                        return View(model);
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        ModelState.AddModelError("", $"An unexpected error occurred: {ex.Message}");
                        Console.WriteLine($"Unexpected Error: {ex.Message}");
                        return View(model);
                    }
                }
            }
            return View(model);
        }

        [Route("Login")]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        [Route("Login")]
        public IActionResult Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                string hashedInputPassword = PasswordHelper.HashPassword(model.Password);
                var user = _context.UserAccounts
                    .FirstOrDefault(x => (x.Username == model.UsernameOrEmail || x.Email == model.UsernameOrEmail)
                                        && x.Password == hashedInputPassword);

                if (user != null)
                {
                    var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()), // ✅ Store User ID here!
                new Claim(ClaimTypes.Name, user.Email),
                new Claim("Name", user.FirstName),
                new Claim(ClaimTypes.Role, user.Role),
            };

                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                    HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

                    return user.Role == "Admin"
                        ? RedirectToAction("CarList", "CarList")
                        : RedirectToAction("Index", "CustomerDashboard");
                }
                else
                {
                    ModelState.AddModelError("", "Username/Email or Password is incorrect");
                }
            }
            return View(model);
        }

        [HttpPost] 
        [Route("Logout")]
        [IgnoreAntiforgeryToken]
        public ActionResult Logout()
        {
            HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login", "Account");
        }

        [Route("ForgotPassword")]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("ForgotPassword")]
        public IActionResult ForgotPassword(ForgotPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = _context.UserAccounts.FirstOrDefault(u => u.Email == model.Email);
            if (user == null)
            {
                ViewBag.ErrorMessage = "User not found.";
                return View();
            }

         
            if (user.CodeExpiry.HasValue && user.CodeExpiry > DateTime.Now)
            {
                StoreTempData(user);
                return PartialView("VerifyCode", model);
            }

            GenerateNewVerificationCode(user);
            _context.SaveChanges();

  
            _emailService.SendVerificationEmail(user.Email, user.VerificationCode);

            StoreTempData(user);
            return PartialView("VerifyCode", model);
        }

        [Route("VerifyCode")]
        public IActionResult VerifyCode()
        {
            if (TempData["Email"] == null)
            {
                return RedirectToAction("ForgotPassword");
            }

            TempData.Keep("Email");
            TempData.Keep("VerificationCode");
            TempData.Keep("CodeExpiry");

            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("VerifyCode")]
        public IActionResult VerifyCode(string email, string code)
        {
            var user = _context.UserAccounts.FirstOrDefault(u => u.Email == email);

            if (user == null)
            {
                return Json(new { success = false, message = "User not found." });
            }

            if (user.VerificationCode != code || user.CodeExpiry < DateTime.Now)
            {
                return Json(new { success = false, message = "Invalid or expired verification code." });
            }

            user.VerificationCode = null;
            user.CodeExpiry = null;
            _context.SaveChanges();

            return Json(new { success = true, redirectUrl = Url.Action("ResetPassword", "Account", new { email }) });
        }

        [HttpPost]
        [Route("ResendCode")]
        public IActionResult ResendCode()
        {
            if (TempData["Email"] == null)
            {
                return Json(new { success = false, message = "Session expired. Please try again." });
            }

            string email = TempData["Email"].ToString();
            TempData.Keep("Email");

            var user = _context.UserAccounts.FirstOrDefault(u => u.Email == email);
            if (user == null)
            {
                return Json(new { success = false, message = "User not found." });
            }

            if (user.CodeExpiry != null && user.CodeExpiry > DateTime.Now)
            {
                TimeSpan remainingTime = user.CodeExpiry.Value - DateTime.Now;
                return Json(new { success = false, message = $"Please wait {remainingTime.Minutes} minutes and {remainingTime.Seconds} seconds before requesting a new code." });
            }

            Random random = new Random();
            string verificationCode = random.Next(100000, 999999).ToString();

            user.VerificationCode = verificationCode;
            user.CodeExpiry = DateTime.Now.AddMinutes(5);

            _context.UserAccounts.Update(user);
            _context.SaveChanges();

        
            var checkUser = _context.UserAccounts.FirstOrDefault(u => u.Email == email);
          
                try
                {
                    _emailService.SendVerificationEmail(user.Email, verificationCode);
                }
                catch (Exception ex)
                {
                    return Json(new { success = false, message = "Failed to send email. Please try again." });
                }

            TempData["VerificationCode"] = verificationCode;
            TempData["CodeExpiry"] = user.CodeExpiry;
            TempData.Keep("VerificationCode");
            TempData.Keep("CodeExpiry");

            return Json(new { success = true, message = "New verification code sent successfully." });
        }


        private void StoreTempData(UserAccount user)
        {
            TempData["Email"] = user.Email;
            TempData["VerificationCode"] = user.VerificationCode;
            TempData["CodeExpiry"] = user.CodeExpiry;

            TempData.Keep("Email");
            TempData.Keep("VerificationCode");
            TempData.Keep("CodeExpiry");
        }


        private void GenerateNewVerificationCode(UserAccount user)
        {
            Random random = new Random();
            user.VerificationCode = random.Next(100000, 999999).ToString();
            user.CodeExpiry = DateTime.Now.AddMinutes(1); // 1-minute expiry
        }


        [Route("ResetPassword")]
        public IActionResult ResetPassword()
        {
            return View();
        }

        [HttpPost]
        [Route("ResetPassword")]
        public IActionResult ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = _context.UserAccounts.FirstOrDefault(u => u.Email == model.Email);
            if (user != null)
            {
                if (model.NewPassword != model.ConfirmPassword)
                {
                    ViewBag.ErrorMessage = "Passwords do not match.";
                    return View(model);
                }

                user.Password = PasswordHelper.HashPassword(model.NewPassword); 
                _context.SaveChanges();

                TempData.Clear();
                return RedirectToAction("Login", "Account");
            }

            ViewBag.ErrorMessage = "Error resetting password.";
            return View();
        }

        [HttpGet]
        [Route("Userinfo")]
        public IActionResult GetUserInfo()
        {
            if (User.Identity.IsAuthenticated)
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var name = User.FindFirst(ClaimTypes.Name)?.Value;
                var role = User.FindFirst(ClaimTypes.Role)?.Value;

                return Ok(new { userId, name, role });
            }
            return Unauthorized();
        }

    }
}
