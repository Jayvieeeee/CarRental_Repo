namespace CarRental.Models.Entites
{
    public class Message
    {
        public int Id { get; set; }
        public int SenderId { get; set; }  // Customer or Admin
        public int ReceiverId { get; set; }  // Sino tatanggap
        public string? Subject { get; set; }  // Required for customers only
        public string MessageText { get; set; }
        public DateTime SentAt { get; set; } = DateTime.Now;
        public string Status { get; set; } = "unread";
        public int? ReplyToMessageId { get; set; } // Nullable, only for replies
    }

}
