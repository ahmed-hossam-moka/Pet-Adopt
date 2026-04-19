using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using PetAdopt.BLL.DTOs.Notification;
using PetAdopt.BLL.Services.Interfaces;
using PetAdopt.DAL.Models;
using PetAdopt.DAL.Repositories.Interfaces;

namespace PetAdopt.API.Hubs
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly INotificationRepository _notificationRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public NotificationService(IHubContext<NotificationHub> hubContext,
                                    INotificationRepository notificationRepository,
                                    UserManager<ApplicationUser> userManager
         )
        {
            _hubContext = hubContext;
            _notificationRepository = notificationRepository;
            _userManager = userManager;
        }


        public async Task NotifyNewAdoptionRequestAsync(
            string ownerId,
            string adopterName,
            string petName)
        {
            var message = $"'{adopterName}' sent an adoption request for '{petName}'";
            await _notificationRepository.AddAsync(MapToNotification(ownerId, message));
            await _notificationRepository.SaveAsync();

            await _hubContext.Clients
                .Group(ownerId)
                .SendAsync("NewAdoptionRequest", new
                {
                    message,
                    type = "NewAdoptionRequest",
                });

        }

        public async Task NotifyRequestAcceptedAsync(
            string adopterId,
            string petName
            )
        {
            var message = $"Your adoption request for '{petName}' has been accepted";
            await _notificationRepository.AddAsync(MapToNotification(adopterId, message));
            await _notificationRepository.SaveAsync();

            await _hubContext.Clients
                .Group(adopterId)
                .SendAsync("AdoptionRequestAccepted", new
                {
                    message,
                    type = "AdoptionRequestAccepted",
                });
        }

        public async Task NotifyRequestRejectedAsync(
            string adopterId,
            string petName
            )
        {
            var message = $"Your adoption request for '{petName}' has been rejected ";
            await _notificationRepository.AddAsync(MapToNotification(adopterId, message));
            await _notificationRepository.SaveAsync();

            await _hubContext.Clients
                .Group(adopterId)
                .SendAsync("AdoptionRequestRejected", new
                {
                    message,
                    type = "AdoptionRequestRejected",
                });
        }

        public async Task NotifyNewPetRequestAsync(string petName)
        {
            var admins = await _userManager.GetUsersInRoleAsync("Admin");
            var message = $"You have a new Pet Approve request for this pet '{petName}'";

            foreach (var admin in admins)
            {
                await _hubContext.Clients.Group(admin.Id)
                    .SendAsync("NewPetRequest", new
                    {
                        message,
                        type = "NewPetRequest",
                    });

                await _notificationRepository.AddAsync(MapToNotification(admin.Id, message));
            }
            await _notificationRepository.SaveAsync();
        }


        public async Task NotifyPetApprovedAsync(
            string ownerId,
            string petName)
        {
            var message = $"Your pet post '{petName}' has been approved and is now public";
            await _notificationRepository.AddAsync(MapToNotification(ownerId, message));
            await _notificationRepository.SaveAsync();

            await _hubContext.Clients
                .Group(ownerId)
                .SendAsync("PetApproved", new
                {
                    message,
                    type = "PetApproved",
                });
        }

        public async Task NotifyPetRejectedAsync(
            string ownerId,
            string petName)
        {

            var message = $"Your pet post '{petName}' has been rejected by the admin";
            await _notificationRepository.AddAsync(MapToNotification(ownerId, message));
            await _notificationRepository.SaveAsync();

            await _hubContext.Clients
                .Group(ownerId)
                .SendAsync("PetRejected", new
                {
                    message,
                    type = "PetRejected",
                });
        }
        public async Task NotifyNewUserRequestAsync(string ownerId, string ownerName)
        {
            var admins = await _userManager.GetUsersInRoleAsync("Admin");
            var message = $"New request for user: '{ownerName}', which is had id: '{ownerId}'";

            foreach (var admin in admins)
            {
                await _hubContext.Clients.Group(admin.Id)
                    .SendAsync("NewUserRequest", new
                    {
                        message,
                        type = "NewUserRequest",
                    });

                await _notificationRepository.AddAsync(MapToNotification(admin.Id, message));
            }
            await _notificationRepository.SaveAsync();
        }



        public async Task<IEnumerable<NotificationResponse>> GetNotificationsAsync(string userId)
        {
            var notifications = await _notificationRepository
                                        .GetNotificationByUserAsync(userId);

            await _notificationRepository
                    .MarkAsRead(userId);

            return MapToNotificationResponses(notifications);
        }


        private IEnumerable<NotificationResponse> MapToNotificationResponses(IEnumerable<Notification> notifications)
        {
            if (notifications == null || !notifications.Any())
                return new List<NotificationResponse>();

            return notifications.Select(n => new NotificationResponse
            {
                Id = n.Id,
                Message = n.Message,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            }).ToList();
        }

        private Notification MapToNotification(string uId, string msg)
        {
            return new Notification
            {
                UserId = uId,
                Message = msg,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };
        }


    }
}