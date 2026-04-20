using Microsoft.EntityFrameworkCore;
using PetAdopt.DAL.Data;
using PetAdopt.DAL.Models;
using PetAdopt.DAL.Repositories.Interfaces;

namespace PetAdopt.DAL.Repositories.Implementations
{
    public class NotificationRepository : GenericRepository<Notification>, INotificationRepository
    {
        public NotificationRepository(AppDbContext context) : base(context) { }
        public async Task<IEnumerable<Notification>> GetNotificationByUserAsync(string userId)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }
        public async Task MarkAsRead(string userId)
        {
            await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ExecuteUpdateAsync(n => n
                    .SetProperty(x => x.IsRead, true));
        }

    }
}