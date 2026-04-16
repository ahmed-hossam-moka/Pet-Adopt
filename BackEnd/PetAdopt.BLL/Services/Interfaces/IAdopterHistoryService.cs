using PetAdopt.BLL.DTOs.AdopterHistory;

namespace PetAdopt.BLL.Services.Interfaces
{
    public interface IAdopterHistoryService
    {
        Task<bool> AddHistoryAsync(CreateAdopterHistoryDto dto, string adopterId);
        Task<IEnumerable<AdopterHistoryResponseDto>> GetMyHistoriesAsync(string adopterId);
        Task<bool> DeleteHistoryAsync(int historyId, string adopterId);
    }
}