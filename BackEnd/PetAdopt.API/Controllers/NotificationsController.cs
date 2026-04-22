using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAdopt.BLL.Services.Interfaces;

namespace PetAdopt.API.Controllers;

public class NotificationsController : BaseController
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    // GET api/Notifications
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetMyNotifications()
    {
        var notification = await _notificationService
            .GetNotificationsAsync(GetCurrentUserId());
        return Success(notification);
    }

}
