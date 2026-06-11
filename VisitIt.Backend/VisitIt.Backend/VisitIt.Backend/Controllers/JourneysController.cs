using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;
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



        [HttpPost("upload/{journeyId}")]
        public async Task<IActionResult> UploadImages(int journeyId, [FromForm] List<IFormFile> files)
        {
            var userId = GetUserId();

            var journey = await _context.Journeys
                .FirstOrDefaultAsync(j => j.Id == journeyId && j.UserId == userId);

            if (journey == null)
                return NotFound();

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
                Console.WriteLine($"Stworzono folder: {uploadsFolder}");
            }

            var imagePaths = new List<string>();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                    var filePath = Path.Combine("wwwroot", "uploads", fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    imagePaths.Add($"/uploads/{fileName}");
                    Console.WriteLine($"Zapisano: {fileName}");
                }
            }

            var existingImages = string.IsNullOrEmpty(journey.ImagePaths)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(journey.ImagePaths);

            existingImages.AddRange(imagePaths);
            journey.ImagePaths = JsonSerializer.Serialize(existingImages);

            await _context.SaveChangesAsync();

            Console.WriteLine($"📷 Dodano {imagePaths.Count} zdjęć. Łącznie: {existingImages.Count}");

            return Ok(new { images = imagePaths, total = existingImages.Count });
        }

        [HttpGet("images/{journeyId}")]
        public async Task<IActionResult> GetImages(int journeyId)
        {
            var journey = await _context.Journeys.FindAsync(journeyId);

            if (journey == null || string.IsNullOrEmpty(journey.ImagePaths))
                return Ok(new List<string>());

            var images = System.Text.Json.JsonSerializer.Deserialize<List<string>>(journey.ImagePaths);
            return Ok(images);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<JourneyResponseDto>>> GetJourneysByUserId(int userId)
        {
            var journeys = await _context.Journeys
                .Where(j => j.UserId == userId)
                .Include(j => j.User) 
                .OrderByDescending(j => j.StartDate)
                .Select(j => MapToDto(j))
                .ToListAsync();

            return Ok(journeys);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("admin-delete/{journeyId}")]
        public async Task<IActionResult> AdminDeleteJourney(int journeyId)
        {
            var journey = await _context.Journeys.FindAsync(journeyId);

            if (journey == null)
                return NotFound("Post not found.");

            _context.Journeys.Remove(journey);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("analytics")]
        public async Task<ActionResult> GetAnalytics()
        {
            var journeys = await _context.Journeys.ToListAsync();

            var stats = journeys
                .GroupBy(j => j.Country)
                .Select(g => new {
                    Name = g.Key,
                    Rating = Math.Round(g.Average(j => j.Rating), 1),
                    Visits = g.Count()
                })
                .ToList();

            return Ok(stats);
        }

    }
}
