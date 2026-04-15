using PetAdopt.DAL.Pagination;

namespace PetAdopt.BLL.DTOs.Review
{
    public class OwnerReviewsDto
    {
        public string OwnerId { get; set; }
        public string OwnerName { get; set; }
        public bool IsApproved { get; set; }
        public bool IsActive { get; set; }
        public DateTime JoinnedIn { get; set; }
        public PagedResult<ReviewResponseDto> Reviews { get; set; }
    }
}