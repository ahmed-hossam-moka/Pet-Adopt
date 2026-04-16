using PetAdopt.BLL.DTOs.AdopterHistory;
using PetAdopt.BLL.Services.Interfaces;
using PetAdopt.DAL.Models;
using PetAdopt.DAL.Repositories.Interfaces;

namespace PetAdopt.BLL.Services.Implementations
{
    public class AdopterHistoryService : IAdopterHistoryService
    {
        private readonly IAdopterHistoryRepository _historyRepository;

        public AdopterHistoryService(IAdopterHistoryRepository historyRepository)
        {
            _historyRepository = historyRepository;
        }

        public async Task<bool> AddHistoryAsync(
            CreateAdopterHistoryDto dto, string adopterId)
        {
            var history = new AdopterHistory
            {
                AdopterId = adopterId,
                PreviousPetName = dto.PreviousPetName,
                PreviousPetType = dto.PreviousPetType,
                VeterinaryReference = dto.VeterinaryReference,
                Experience = dto.Experience,
                YearOfAdoption = dto.YearOfAdoption
            };

            await _historyRepository.AddAsync(history);
            await _historyRepository.SaveAsync();
            return true;
        }

        public async Task<IEnumerable<AdopterHistoryResponseDto>> GetMyHistoriesAsync(
            string adopterId)
        {
            var histories = await _historyRepository
                .GetHistoriesByAdopterAsync(adopterId);

            return histories.Select(h => new AdopterHistoryResponseDto
            {
                HistoryId = h.HistoryId,
                PreviousPetName = h.PreviousPetName,
                PreviousPetType = h.PreviousPetType,
                VeterinaryReference = h.VeterinaryReference,
                Experience = h.Experience,
                YearOfAdoption = h.YearOfAdoption
            });
        }

        public async Task<bool> DeleteHistoryAsync(int historyId, string adopterId)
        {
            var history = await _historyRepository.GetByIdAsync(historyId);
            if (history == null || history.AdopterId != adopterId)
                throw new Exception("History not found");

            _historyRepository.Delete(history);
            await _historyRepository.SaveAsync();
            return true;
        }
    }
}