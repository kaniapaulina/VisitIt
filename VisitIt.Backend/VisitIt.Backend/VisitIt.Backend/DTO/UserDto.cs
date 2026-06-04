using VisitIt.Backend.Models;

namespace VisitIt.Backend.DTO
{
    public class UserLoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class UserRegisterDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role {  get; set; }

        // JWT token for authentication
        public string Token { get; set; } 
    }

  
}
