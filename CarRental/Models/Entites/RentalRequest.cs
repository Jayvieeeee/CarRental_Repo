using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.ConstrainedExecution;

namespace CarRental.Models.Entites
{
    public class RentalRequest
    {
        [Key]
        public int RequestId { get; set; }

        [ForeignKey("UserAccount")]
        public int UserId { get; set; }

        [ForeignKey("Car")]
        public int CarId { get; set; }

        public DateTime RentalDate { get; set; }
        public DateTime ReturnDate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal EstimatedPrice { get; set; }

        public string ContactNo { get; set; }
        public string LicenseNo { get; set; }
        public string Address { get; set; }

        public string Status { get; set; } = "Pending";

        public UserAccount UserAccount { get; set; }
        public Car Car { get; set; }
    }
}
