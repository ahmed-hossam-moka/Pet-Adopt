using PetAdopt.BLL.DTOs.Pet;
using PetAdopt.BLL.DTOs.PetImage;
using PetAdopt.BLL.Services.Interfaces;
using PetAdopt.DAL.Models;
using PetAdopt.DAL.Pagination;
using PetAdopt.DAL.Repositories.Interfaces;

namespace PetAdopt.BLL.Services.Implementations
{
    public class PetService : IPetService
    {
        private readonly IPetRepository _petRepository;
        private readonly INotificationService _notificationService;

        public PetService(
            IPetRepository petRepository,
            INotificationService notificationService)
        {
            _petRepository = petRepository;
            _notificationService = notificationService;
        }
        public async Task<PagedResult<PetHomeResponseDto>> GetApprovedPetsAsync(PaginationParams param)
        {
            return await _petRepository.GetApprovedPetsAsync(param);
        }  

        public async Task<PetResponseDto?> GetPetByIdAsync(int petId)
        {
            var pet = await _petRepository.GetPetWithDetailsAsync(petId);
            if (pet == null) return null;
            return MapToResponseDto(pet);
        }

        public async Task<PagedResult<PetHomeResponseDto>> SearchPetsAsync(PaginationParams paginationParams,
            string? animalType,
            string? breed,
            int? maxAge,
            string? location)
        {
            return await _petRepository.SearchPetsAsync(paginationParams,
                animalType, breed, maxAge, location);
        }

        public async Task<PetResponseDto> CreatePetAsync(CreatePetDto dto, string ownerId)
        {

            var pet = new Pet
            {
                OwnerId = ownerId,
                Name = dto.Name,
                AnimalType = dto.AnimalType,
                Breed = dto.Breed,
                Age = dto.Age,
                Gender = Enum.Parse<PetGender>(dto.Gender),
                HealthStatus = dto.HealthStatus,
                Description = dto.Description,
                Location = dto.Location,
                Status = PetStatus.Available,
                IsApproved = false,
                IsDeleted = false,
                CreatedAt = DateTime.UtcNow,
                PrimaryImageUrl = dto.ImageUrls[0]
            };

            await _petRepository.AddAsync(pet);
            await _petRepository.SaveAsync();


            await _notificationService.NotifyNewPetRequestAsync(
            petName: pet.Name);

            return MapToResponseDto(pet);
        }

        public async Task<bool> UpdatePetAsync(int petId, UpdatePetDto dto, string ownerId)
        {
            var pet = await _petRepository.GetByIdAsync(petId);
            if (pet == null || pet.OwnerId != ownerId || pet.IsDeleted)
                return false;

            if (dto.Name != null) pet.Name = dto.Name;
            if (dto.AnimalType != null) pet.AnimalType = dto.AnimalType;
            if (dto.Breed != null) pet.Breed = dto.Breed;
            if (dto.Age.HasValue) pet.Age = dto.Age.Value;
            if (dto.Gender != null) pet.Gender = Enum.Parse<PetGender>(dto.Gender);
            if (dto.HealthStatus != null) pet.HealthStatus = dto.HealthStatus;
            if (dto.Description != null) pet.Description = dto.Description;
            if (dto.Location != null) pet.Location = dto.Location;

            pet.UpdatedAt = DateTime.UtcNow;

            _petRepository.Update(pet);
            await _petRepository.SaveAsync();
            return true;
        }

        public async Task<bool> DeletePetAsync(int petId, string ownerId)
        {
            var pet = await _petRepository.GetByIdAsync(petId);
            if (pet == null || pet.OwnerId != ownerId)
                return false;

            pet.IsDeleted = true;
            pet.UpdatedAt = DateTime.UtcNow;

            _petRepository.Update(pet);
            await _petRepository.SaveAsync();
            return true;
        }

        public async Task<IEnumerable<PetResponseDto>> GetMyPetsAsync(string ownerId)
        {
            var pets = await _petRepository.GetPetsByOwnerAsync(ownerId);
            return pets.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<PetResponseDto>> GetPendingApprovalPetsAsync()
        {
            var pets = await _petRepository.GetPendingApprovalPetsAsync();
            return pets.Select(MapToResponseDto);
        }

        public async Task<bool> ApprovePetAsync(int petId)
        {
            var pet = await _petRepository.GetByIdAsync(petId);
            if (pet == null) return false;

            if(pet.IsDeleted)
                throw new Exception("This Pet is Deleted");

            pet.IsApproved = true;
            pet.UpdatedAt = DateTime.UtcNow;

            _petRepository.Update(pet);
            await _petRepository.SaveAsync();

        await _notificationService.NotifyPetApprovedAsync(
            ownerId: pet.OwnerId,
            petName: pet.Name);

            return true;
        }

        public async Task<bool> RejectPetAsync(int petId)
        {
            var pet = await _petRepository.GetByIdAsync(petId);
            if (pet == null) return false;

            if(pet.IsDeleted)
                throw new Exception("This Pet is Deleted");

            pet.IsApproved = false;
            pet.IsDeleted = true;
            pet.UpdatedAt = DateTime.UtcNow;

            _petRepository.Update(pet);
            await _petRepository.SaveAsync();

        await _notificationService.NotifyPetRejectedAsync(
            ownerId: pet.OwnerId,
            petName: pet.Name);

            return true;
        }

        
        private PetResponseDto MapToResponseDto(Pet pet)
        {
            return new PetResponseDto
            {
                PetId = pet.PetId,
                OwnerName = pet.Owner?.Name ?? "",
                Name = pet.Name,
                AnimalType = pet.AnimalType,
                Breed = pet.Breed,
                Age = pet.Age,
                Gender = pet.Gender.ToString(),
                HealthStatus = pet.HealthStatus,
                Description = pet.Description,
                Location = pet.Location,
                Status = pet.Status.ToString(),
                IsApproved = pet.IsApproved,
                CreatedAt = pet.CreatedAt,
                Images = pet.Images?.Select(i => new PetImageResponseDto
                {
                    ImageId = i.ImageId,
                    ImageUrl = i.ImageUrl,
                    IsPrimary = i.IsPrimary
                }).ToList() ?? new List<PetImageResponseDto>(),
                PrimaryImageUrl = pet.PrimaryImageUrl
            };
        }
    }
}
