namespace DAPM.ClientApi.Services.Interfaces
{
    public interface IAuthenticationService
    {
        string Login(string username, string password, Guid orgId);
        string GenerateJwtToken(string username, Guid orgId);
        bool ValidateJwtToken(string token);
    }
}
