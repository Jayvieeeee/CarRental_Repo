using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CarRental.Models.Entites
{
    public class Renters
    {

        [Key]
        public int RenterId { get; set; } // Primary Key

        [ForeignKey("UserAccount")]
        public int UserAccountId { get; set; }
        public string ContactNo { get; set; }
        public string LicenseNo { get; set; }
        public string Address { get; set; }

        public UserAccount UserAccount { get; set; }
    }
}
