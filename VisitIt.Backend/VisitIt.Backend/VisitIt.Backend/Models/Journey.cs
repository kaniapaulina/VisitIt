namespace VisitIt.Backend.Models
{
    public class Journey
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Country { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Location { get; set; }
        public int DistanceKm { get; set; }
        public string Notes { get; set; }
        public string Status { get; set; } = "draft";

        // Foreign keys
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
