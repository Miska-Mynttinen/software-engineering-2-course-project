using System.IdentityModel.Tokens.Jwt;

public class TokenRevocationService
{
    // This dictionary will store the token identifier (jti) and its expiration time
    private static readonly Dictionary<string, DateTime> RevokedTokens = new();

    // Add token to the revoked list
    public void RevokeToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var jwtToken = tokenHandler.ReadJwtToken(token);
        var jti = jwtToken?.Payload?.GetValueOrDefault("jti")?.ToString(); // JWT ID (jti) is unique to each token

        if (jti != null)
        {
            // Add to revoked tokens list with its expiration time
            RevokedTokens[jti] = jwtToken.ValidTo;
            Console.WriteLine($"Token {jti} has been revoked.");
        }
    }

    // Check if a token has been revoked
    public bool IsTokenRevoked(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var jwtToken = tokenHandler.ReadJwtToken(token);
        var jti = jwtToken?.Payload?.GetValueOrDefault("jti")?.ToString();

        if (jti != null && RevokedTokens.ContainsKey(jti))
        {
            // Check if the token is expired, and remove from revoked list if expired
            if (RevokedTokens[jti] < DateTime.UtcNow)
            {
                RevokedTokens.Remove(jti);
                Console.WriteLine($"Token {jti} has expired and been removed from the revoked list.");
                return false; // Expired token is no longer revoked
            }
            return true; // Token is still revoked
        }
        return false; // Token not found in revoked list
    }
}
