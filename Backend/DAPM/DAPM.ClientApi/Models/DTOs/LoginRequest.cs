namespace DAPM.ClientApi.Models.DTOs
{
    // DTO for login requests
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public Guid OrganizationId {get; set;}
    }
}
