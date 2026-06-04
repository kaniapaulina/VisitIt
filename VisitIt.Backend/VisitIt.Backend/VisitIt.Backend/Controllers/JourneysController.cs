using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using VisitIt.Backend.Data;
using VisitIt.Backend.DTO;
using VisitIt.Backend.Models;

namespace VisitIt.Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class JourneysController : ControllerBase
    {
        private readonly AppDbContext _context;

        public JourneysController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<JourneyDto>>> GetJourneys()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var journeys = await _context.Journeys
                .Where(j => j.UserId == userId)
                .Select(j => new JourneyDto
                {
                    Id = j.Id,
                    Title = j.Title,
                    Description = j.Description,
                    StartDate = j.StartDate,
                    EndDate = j.EndDate,
                    Location = j.Location,
                    DistanceKm = j.DistanceKm,
                    Notes = j.Notes
                }).ToListAsync();

            return Ok(journeys);
        }

        [HttpPost]
        public async Task<ActionResult<JourneyDto>> CreateJourney(CreateJourneyDto createDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var journey = new Journey
            {
                Title = createDto.Title,
                Description = createDto.Description,
                StartDate = createDto.StartDate,
                EndDate = createDto.EndDate,
                Location = createDto.Location,
                DistanceKm = createDto.DistanceKm,
                Notes = createDto.Notes,
                UserId = userId
            };

            _context.Journeys.Add(journey);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJourney), new { id = journey.Id },
                MapToDto(journey));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<JourneyDto>> GetJourney(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var journey = await _context.Journeys
                .FirstOrDefaultAsync(j => j.Id == id && j.UserId == userId);

            if (journey == null)
                return NotFound();

            return Ok(MapToDto(journey));
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<JourneyDto>>> GetAllJourneys()
        {
            var journeys = await _context.Journeys
                .Include(j => j.User)
                .Select(j => new JourneyDto
                {
                    // mapping
                })
                .ToListAsync();

            return Ok(journeys);
        }

        private static JourneyDto MapToDto(Journey journey)
        {
            return new JourneyDto
            {
                Id = journey.Id,
                Title = journey.Title,
                Description = journey.Description,
                StartDate = journey.StartDate,
                EndDate = journey.EndDate,
                Location = journey.Location,
                DistanceKm = journey.DistanceKm,
                Notes = journey.Notes
            };
        }
    }
}
