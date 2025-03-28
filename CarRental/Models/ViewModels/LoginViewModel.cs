using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace CarRental.Models.ViewModels
{
    public class LoginViewModel
    {

        [Required(ErrorMessage = "Username is required.")]
        [DisplayName("Username or Email")]
        public string UsernameOrEmail { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
