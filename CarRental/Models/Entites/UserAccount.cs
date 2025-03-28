using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace CarRental.Models.Entites
{
    [Index(nameof(Email), IsUnique = true)]
    [Index(nameof(Username), IsUnique = true)]
    public class UserAccount
    {
        [Key]
        public int UserId { get; set; }


        [Required(ErrorMessage = "First name is required.")]
        [MaxLength(50, ErrorMessage = "Max 50 characters allowed.")]

        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last name is required.")]
        [MaxLength(50, ErrorMessage = "Max 50 characters allowed.")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [MaxLength(100, ErrorMessage = "Max 100 characters allowed.")]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }


        [Required(ErrorMessage = "Username is required.")]

        public string Username { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [MaxLength(200, ErrorMessage = "Max 200 characters allowed.")]
        [DataType(DataType.Password)]
        public string Password { get; set; }


        [Required]
        public string Role { get; set; } // "Admin" or "User"

        public string? VerificationCode { get; set; }
        public DateTime? CodeExpiry { get; set; }

    }
}
