namespace PetAdopt.BLL.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string Token { get; set; }
        public DateTime TokenExpiration { get; set; }
    }
}