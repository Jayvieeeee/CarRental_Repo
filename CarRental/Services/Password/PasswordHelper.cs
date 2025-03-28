using System.Security.Cryptography;
using System.Text;

namespace CarRental.Services.Password
{
    public static class PasswordHelper
    {
        public static string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                foreach (byte b in bytes)
                {
                    builder.Append(b.ToString("x2")); // Converts bytes to hexadecimal string
                }
                return builder.ToString();
            }
        }
    }
}
