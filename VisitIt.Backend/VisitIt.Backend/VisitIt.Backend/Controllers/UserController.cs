using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VisitIt.Backend.Data;
using VisitIt.Backend.Models; 

namespace VisitIt.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        // POST: api/users/toggle-ban/{id}
        [HttpPost("toggle-ban/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ToggleBan(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound("User does not exist");

            user.IsBanned = !user.IsBanned;
            await _context.SaveChangesAsync();

            return Ok(new { isBanned = user.IsBanned });
        }
    }
}