using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAdopt.BLL.DTOs.AdopterHistory;
using PetAdopt.BLL.Services.Interfaces;

namespace PetAdopt.API.Controllers;
    public class AdopterHistoryController : BaseController
    {
        private readonly IAdopterHistoryService _historyService;

        public AdopterHistoryController(IAdopterHistoryService historyService)
        {
            _historyService = historyService;
        }

        // GET api/adopterhistory
        [HttpGet]
        [Authorize(Roles = "Adopter")]
        public async Task<IActionResult> GetMyHistories()
        {
 
                var histories = await _historyService
                    .GetMyHistoriesAsync(GetCurrentUserId());
                return Success(histories);
 
        }

        // POST api/adopterhistory
        [HttpPost]
        [Authorize(Roles = "Adopter")]
        public async Task<IActionResult> AddHistory(
            [FromBody] CreateAdopterHistoryDto dto)
        {
 
                await _historyService.AddHistoryAsync(dto, GetCurrentUserId());
                return Success(null, "History added successfully");
 
        }

        // DELETE api/adopterhistory/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Adopter")]
        public async Task<IActionResult> DeleteHistory(int id)
        {
 
                await _historyService.DeleteHistoryAsync(id, GetCurrentUserId());
                return Success(null, "History deleted successfully");
 
        }
    }
