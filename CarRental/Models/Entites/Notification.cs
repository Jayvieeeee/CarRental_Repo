namespace CarRental.Models.Entites
{
    public class Notification
    {
        public int Id { get; set; }
        public string Title { get; set; } // e.g. "New Rental Request", "New Message"
        public string Message { get; set; } // e.g. "You have a new rental request from User123"
        public string Type { get; set; } // e.g. "rental", "message"
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
