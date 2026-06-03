using Microsoft.AspNetCore.Identity;

namespace VisitIt.Backend.Models
{
    public class User : IdentityUser
    {
        private string? nickName;

        public string? NickName { get; set; }
    }
}
