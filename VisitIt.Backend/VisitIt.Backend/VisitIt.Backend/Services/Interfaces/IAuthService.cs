using VisitIt.Backend.DTO;

namespace VisitIt.Backend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<UserResponseDto> Login(UserLoginDto loginDto);
        Task<UserResponseDto> Register(UserRegisterDto registerDto);
    }
}
