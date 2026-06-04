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
                    Role = "admin",
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 2,
                    Username = "defaultuser",
                    Email = "user@travel.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("user123"),
                    Role = "user",
                    CreatedAt = DateTime.UtcNow
                }
            );
        }
    }
}
