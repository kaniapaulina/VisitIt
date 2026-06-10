using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;

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
        public string? ImagePaths { get; set; }

        // Foreign keys
        public int UserId { get; set; }
        public User User { get; set; }

        // Wyciaganie ratingu z description poniewaz cykam sie cokolwiek psuc w bazie
        // nie wierze, ze Regex przydal sie do czegos , co nie jest zdaniem egzaminu z obiektowego
        [NotMapped] 
        public double Rating => ExtractRating(Description);

        private double ExtractRating(string description)
        {
            if (string.IsNullOrEmpty(description)) return 0;
            var match = Regex.Match(description, @"Rating:\s*(\d+(\.\d+)?)", RegexOptions.IgnoreCase);

            if (match.Success)
            {
                string value = match.Groups[1].Value.Replace('.', ',');
                return double.Parse(value);
            }
            return 0;
        }
    }
}
