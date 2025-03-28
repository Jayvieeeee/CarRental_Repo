using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace CarRental.Models.Entites;

[Table("Cars")]  // Explicitly map the class to the Cars table
public class Car
{
  [Key]
    public int CarId { get; set; }

    [Required]
    public string Brand { get; set; }

    [Required]
    public string Model { get; set; }

    [Required]
    public int Seaters { get; set; }

    [Required]
    public int LuggageCapacity { get; set; }

    [Required]
    public string FuelType { get; set; }

    [Required]
    public int FuelTankCapacity { get; set; }

    [Required]
    public string FuelEfficiency { get; set; }

    [Required]
    public string Transmission { get; set; }

    [Required]
    public int GroundClearance { get; set; }

    [Required]
    public string Airbags { get; set; }

    [Required]
    public string BrakingSystem { get; set; }

    [Required]
    public string TireSize { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal RentalPrice { get; set; }

    public string ImageUrl { get; set; }

    [Required]
    public string Status { get; set; } = "Available";
}
