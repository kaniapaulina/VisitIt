using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using VisitIt.Backend.DTO;
using VisitIt.Backend.Exceptions;
using VisitIt.Backend.Models;
using VisitIt.Backend.Services.Interfaces;


namespace VisitIt.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserResponseDto>> Login(UserLoginDto loginDto)
        {
            try
            {
                var user = await _authService.Login(loginDto);
                return Ok(user);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid username or password");
            }
            catch (BannedUserException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserResponseDto>> Register([FromBody] UserRegisterDto registerDto)
        {
            try
            {
                var user = await _authService.Register(registerDto);
                return CreatedAtAction(nameof(Register), user);
            }
            catch (InvalidOperationException)
            {
                return Unauthorized("Invalid username or password or email?");
            }
        }


        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(new { message = "API is working!" });
        }
    }
}