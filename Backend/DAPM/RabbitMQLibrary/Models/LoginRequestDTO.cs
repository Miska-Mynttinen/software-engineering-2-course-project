namespace DAPM.ClientApi.Models.DTOs
{
    // DTO for login requests
    public class LoginRequestDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public Guid OrgId {get; set;}
    }

}
