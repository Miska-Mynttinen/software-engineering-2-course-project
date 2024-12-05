namespace DAPM.ClientApi.Services.Interfaces
{
    public interface IAuthenticationService
    {
        public (string token, Guid ticketId) Login(string username, string password, Guid orgId);
        string GenerateJwtToken(string username, Guid orgId, Guid ticketId);
        bool ValidateJwtToken(string token);
        void RevokeToken(string token);
    }
}
