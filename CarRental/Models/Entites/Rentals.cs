using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CarRental.Models.Entites
{
    public class Rentals
    {

        [Key]
        public int RentalId { get; set; }

        [ForeignKey("Renters")]
        public int RenterId { get; set; }

        [ForeignKey("Car")]
        public int CarId { get; set; }

        public DateTime RentalDate { get; set; }
        public DateTime ReturnDate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }

        public string Status { get; set; } // "On-Going", "Completed", "Cancelled"

        public Renters Renters { get; set; }
        public Car Cars { get; set; }
    }
}
