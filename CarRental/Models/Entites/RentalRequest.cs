using CarRental.Models.Entites;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

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

    public string ReferenceNumber { get; set; } // ✅ ADD THIS

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // ✅ ADD THIS (for tracking)

    public UserAccount UserAccount { get; set; }
    public Car Car { get; set; }
}
