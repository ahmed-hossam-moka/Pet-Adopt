using PetAdopt.BLL.DTOs.AdopterHistory;
using PetAdopt.BLL.DTOs.AdoptionRequest;
using PetAdopt.BLL.Services.Interfaces;
using PetAdopt.DAL.Models;
using PetAdopt.DAL.Repositories.Interfaces;

namespace PetAdopt.BLL.Services.Implementations
{
    public class AdoptionRequestService : IAdoptionRequestService
    {
        private readonly IAdoptionRequestRepository _requestRepository;
        private readonly IPetRepository _petRepository;
        private readonly INotificationService _notificationService;

        public AdoptionRequestService(
            IAdoptionRequestRepository requestRepository,
            IPetRepository petRepository,
            INotificationService notificationService
            )
        {
            _requestRepository = requestRepository;
            _petRepository = petRepository;
            _notificationService = notificationService;

        }

        public async Task<bool> SubmitRequestAsync(
            CreateAdoptionRequestDto dto, string adopterId)
        {
            var pet = await _petRepository.GetByIdAsync(dto.PetId);
            if (pet == null || pet.IsDeleted || !pet.IsApproved)
                throw new Exception("Pet not found or not available");

            if (pet.Status != PetStatus.Available)
                throw new Exception("Pet is not available for adoption");

            var requestExists = await _requestRepository
                .RequestExistsAsync(dto.PetId, adopterId);
            if (requestExists)
                throw new Exception("You already submitted a request for this pet");

            var request = new AdoptionRequest
            {
                PetId = dto.PetId,
                AdopterId = adopterId,
                Status = RequestStatus.Pending,
                Message = dto.Message,
                CreatedAt = DateTime.UtcNow
            };

            await _requestRepository.AddAsync(request);
            await _requestRepository.SaveAsync();

        var adopter = await _requestRepository
            .GetRequestWithDetailsAsync(request.RequestId);

        await _notificationService.NotifyNewAdoptionRequestAsync(
            ownerId:     pet.OwnerId,
            adopterName: adopter.Adopter.Name,
            petName:     pet.Name);


            return true;
        }

        public async Task<IEnumerable<AdoptionRequestResponseAdoptDto>> GetMyRequestsAsync(
            string adopterId)
        {
            var requests = await _requestRepository
                .GetRequestsByAdopterAsync(adopterId);
            return requests.Select(MapToResponseAdopterDto);
        }

        public async Task<IEnumerable<AdoptionRequestResponseDto>> GetRequestsByPetAsync(
            int petId, string ownerId)
        {
            var pet = await _petRepository.GetByIdAsync(petId);
            if (pet == null || pet.IsDeleted || pet.OwnerId != ownerId)
                throw new Exception("Unauthorized");

            var requests = await _requestRepository.GetRequestsByPetAsync(petId);
            
            return requests.Select(MapToResponseDto);
        }

        public async Task<bool> AcceptRequestAsync(int requestId, string ownerId)
        {
            var request = await _requestRepository
                .GetRequestWithDetailsAsync(requestId);
            if (request == null)
                throw new Exception("Request not found");

            if (request.Pet.OwnerId != ownerId)
                throw new Exception("Unauthorized");

            request.Status = RequestStatus.Accepted;
            request.UpdatedAt = DateTime.UtcNow;
            _requestRepository.Update(request);

            request.Pet.Status = PetStatus.Adopted;
            _petRepository.Update(request.Pet);

            var otherRequests = await _requestRepository
                .GetPendingRequestsByPetAsync(request.PetId);

            foreach (var other in otherRequests)
            {
                if (other.RequestId != requestId)
                {
                    other.Status = RequestStatus.Rejected;
                    other.UpdatedAt = DateTime.UtcNow;
                    _requestRepository.Update(other);

                // 🔔 Notify Other Adopters (Rejected)
                await _notificationService.NotifyRequestRejectedAsync(
                    adopterId: other.AdopterId,
                    petName:   request.Pet.Name,
                    ownerName: request.Pet.Owner.Name);
                }
            }

            await _requestRepository.SaveAsync();

            await _notificationService.NotifyRequestAcceptedAsync(
            adopterId: request.AdopterId,
            petName:   request.Pet.Name,
            ownerName: "");
            return true;
        }
        public async Task<bool> RejectRequestAsync(int requestId, string ownerId)
        {
            var request = await _requestRepository
                .GetRequestWithDetailsAsync(requestId);
            if (request == null)
                throw new Exception("Request not found");

            if (request.Pet.OwnerId != ownerId)
                throw new Exception("Unauthorized");

            request.Status = RequestStatus.Rejected;
            request.UpdatedAt = DateTime.UtcNow;
            _requestRepository.Update(request);

            var pendingRequests = await _requestRepository
                .GetPendingRequestsByPetAsync(request.PetId);

            if (!pendingRequests.Any())
            {
                request.Pet.Status = PetStatus.Available;
                _petRepository.Update(request.Pet);
            }

            await _requestRepository.SaveAsync();

            await _notificationService.NotifyRequestRejectedAsync(
            adopterId: request.AdopterId,
            petName:   request.Pet.Name,
            ownerName: request.Pet.Owner.Name);

            
            return true;
        }

        private AdoptionRequestResponseDto MapToResponseDto(AdoptionRequest request)
        {
            return new AdoptionRequestResponseDto
            {
                RequestId = request.RequestId,
                PetId = request.PetId,
                PetName = request.Pet?.Name ?? "",
                PetPrimaryImage = request.Pet!.PrimaryImageUrl,
                AdopterId = request.AdopterId,
                AdopterName = request.Adopter?.Name ?? "",
                AdopterEmail = request.Adopter?.Email ?? "",
                Status = request.Status.ToString(),
                Message = request.Message,
                CreatedAt = request.CreatedAt,
                AdopterHistories = request.Adopter?.AdopterHistories?
                    .Select(h => new AdopterHistoryResponseDto
                    {
                        HistoryId = h.HistoryId,
                        PreviousPetName = h.PreviousPetName,
                        PreviousPetType = h.PreviousPetType,
                        VeterinaryReference = h.VeterinaryReference,
                        Experience = h.Experience,
                        YearOfAdoption = h.YearOfAdoption
                    }).ToList() ?? new()
            };
        }
        private AdoptionRequestResponseAdoptDto MapToResponseAdopterDto(AdoptionRequest request)
        {
            return new AdoptionRequestResponseAdoptDto
            {
                RequestId = request.RequestId,
                PetId = request.PetId,
                PetName = request.Pet?.Name ?? "",
                PetPrimaryImage = request.Pet!.PrimaryImageUrl,
                Status = request.Status.ToString(),
                Message = request.Message,
                CreatedAt = request.CreatedAt,
            };
        }
    }
}