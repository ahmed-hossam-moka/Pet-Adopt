using PetAdopt.BLL.DTOs.Notification;
using PetAdopt.DAL.Repositories.Interfaces;

namespace PetAdopt.BLL.Services.Interfaces
{
    public interface INotificationService
    {
        Task NotifyNewAdoptionRequestAsync(string ownerId, string adopterName, string petName);

        Task NotifyRequestAcceptedAsync(string adopterId, string petName);

        Task NotifyRequestRejectedAsync(string adopterId, string petName);

        Task NotifyNewPetRequestAsync(string petName);

        Task NotifyPetApprovedAsync(string ownerId, string petName);

        Task NotifyPetRejectedAsync(string ownerId, string petName);

        Task NotifyNewUserRequestAsync(string ownerId, string ownerName);


        Task<IEnumerable<NotificationResponse>> GetNotificationsAsync(string userId);


    }
}
