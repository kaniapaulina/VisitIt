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

        private int GetUserId()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value;

            return int.Parse(userIdClaim);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<JourneyResponseDto>>> GetMyJourneys()
        {
            var userId = GetUserId();

            var journeys = await _context.Journeys
                .Where(j => j.UserId == userId)
                .Select(j => new JourneyResponseDto
                {
                    Id = j.Id,
                    Title = j.Title,
                    Description = j.Description,
                    StartDate = j.StartDate,
                    EndDate = j.EndDate,
                    Country = j.Country,
                    Location = j.Location,
                    DistanceKm = j.DistanceKm,
                    Notes = j.Notes,
                    UserName = j.User.Username

                }).ToListAsync();

            return Ok(journeys);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<JourneyResponseDto>> GetJourney(int id)
        {
            var userId = GetUserId();

            var journey = await _context.Journeys
                .FirstOrDefaultAsync(j => j.Id == id && j.UserId == userId);

            if (journey == null)
                return NotFound();

            return Ok(MapToDto(journey));
        }

        [HttpPost]
        public async Task<ActionResult<JourneyResponseDto>> CreateJourney(CreateJourneyDto dto)
        {
            var userId = GetUserId();

            if (dto.EndDate < dto.StartDate)
                return BadRequest("End date cannot be before start date");

            var journey = new Journey
            {
                Title = dto.Title,
                Description = dto.Description,
                Country = dto.Country,
                Location = dto.Location,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                DistanceKm = dto.DistanceKm,
                Notes = dto.Notes,
                UserId = userId,
            };

            _context.Journeys.Add(journey);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJourney), new { id = journey.Id }, MapToDto(journey));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJourney(int id, CreateJourneyDto dto)
        {
            var userId = GetUserId();

            var journey = await _context.Journeys
                .FirstOrDefaultAsync(j => j.Id == id && j.UserId == userId);

            if (journey == null)
                return NotFound();

            journey.Title = dto.Title;
            journey.Description = dto.Description;
            journey.Country = dto.Country;
            journey.Location = dto.Location;
            journey.StartDate = dto.StartDate;
            journey.EndDate = dto.EndDate;
            journey.DistanceKm = dto.DistanceKm;
            journey.Notes = dto.Notes;

            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJourney(int id)
        {
            var userId = GetUserId();

            var journey = await _context.Journeys
                .FirstOrDefaultAsync(j => j.Id == id && j.UserId == userId);

            if (journey == null)
                return NotFound();

            _context.Journeys.Remove(journey);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("country/{countryCode}")]
        public async Task<ActionResult<IEnumerable<JourneyResponseDto>>> GetJourneysByCountry(string countryCode)
        {
            var userId = GetUserId();

            var journeys = await _context.Journeys
                .Where(j => j.UserId == userId && j.Country == countryCode)
                .OrderByDescending(j => j.StartDate)
                .Select(j => MapToDto(j))
                .ToListAsync();

            return Ok(journeys);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<JourneyResponseDto>>> GetAllJourneys()
        {
            var journeys = await _context.Journeys
                .Include(j => j.User)
                .OrderByDescending(j => j.StartDate)
                .Select(j => MapToDto(j))
                .ToListAsync();

            return Ok(journeys);
        }

        private static JourneyResponseDto MapToDto(Journey journey)
        {
            return new JourneyResponseDto
            {
                Id = journey.Id,
                Title = journey.Title,
                Description = journey.Description,
                Country = journey.Country,
                Location = journey.Location,
                StartDate = journey.StartDate,
                EndDate = journey.EndDate,
                DistanceKm = journey.DistanceKm,
                Notes = journey.Notes,
                UserName = journey.User?.Username ?? "Unknown"
            };
        }
    }
}
