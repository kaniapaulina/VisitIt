namespace VisitIt.Backend.Models
{
    public class User
    {
        public int Id {  get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }

        // User or Admin
        public string Role { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Journey> Journeys { get; set;}

        public bool IsBanned { get; set; }
    }

    public class Users
    {
        public List<User> users;

        public void AddUser(User user)
        {
            users.Add(user);
        }
    }
}
