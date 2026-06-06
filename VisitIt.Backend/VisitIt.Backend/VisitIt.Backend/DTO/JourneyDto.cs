namespace VisitIt.Backend.DTO
{
    public class CreateJourneyDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Country { get; set; }
        public string Location { get; set; }
        public int DistanceKm { get; set; }
        public string Notes { get; set; }
        public string Status { get; set; } = "draft";
    }

    public class JourneyResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Country { get; set; }
        public string Location { get; set; }
        public int DistanceKm { get; set; }
        public string Notes { get; set; }
        public string Status { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
    }
}
