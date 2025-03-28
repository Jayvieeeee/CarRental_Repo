namespace CarRental.Models.ViewModels
{
    public class RentalRequestViewModel
    {
        public int CarId { get; set; }

        //public int UserId { get; set; }
        public DateTime RentalDate { get; set; }
        public DateTime ReturnDate { get; set; }
        public decimal EstimatedPrice { get; set; }

        // Renter Details (If not yet registered)

        public string ContactNo { get; set; }
        public string LicenseNo { get; set; }
        public string Address { get; set; }
    }
}
