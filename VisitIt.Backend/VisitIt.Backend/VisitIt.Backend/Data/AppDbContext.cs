using Microsoft.EntityFrameworkCore;
using VisitIt.Backend.Models;

namespace VisitIt.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Journey> Journeys { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // 1 user - many journeys (1:N)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Journeys)
                .WithOne(j => j.User)
                .HasForeignKey(j => j.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    Email = "admin@travel.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow,
                    IsBanned = false
                },
                new User
                {
                    Id = 2,
                    Username = "user",
                    Email = "user@travel.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("user123"),
                    Role = "User",
                    CreatedAt = DateTime.UtcNow,
                    IsBanned = false
                }
            );

            modelBuilder.Entity<Journey>().HasData(
                new Journey
                {
                    Id = 2,
                    Title = "Visiting Family",
                    Description = "It was so nice eating grannys food again! Can't wait to return again <3",
                    StartDate = new DateTime(2025, 01, 01),
                    EndDate = new DateTime(2025, 02, 01),
                    Country = "DEU",
                    Location = "Berlin",
                    DistanceKm = 300,
                    Notes = "Book tickets in advance - flights to Germany are expensive..",
                    UserId = 2
                }
            );
        }
    }
}
