namespace PetAdopt.BLL.DTOs.Notification
{
    public class NotificationResponse
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}