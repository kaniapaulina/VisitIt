namespace VisitIt.Backend.DTO
{
    public class JourneyDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Location { get; set; }
        public int DistanceKm { get; set; }
        public string Notes { get; set; }
    }

    public class CreateJourneyDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Location { get; set; }
        public int DistanceKm { get; set; }
        public string Notes { get; set; }
    }
}
