namespace DAPM.ClientApi.Models.DTOs
{
    public class User
    {
        public Guid UserId { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        public string Email { get; set; }

        public string UserType { get; set; }

        public string UserStatus { get; set; }

        public List<string> UserGroups { get; set; }
    }
}
