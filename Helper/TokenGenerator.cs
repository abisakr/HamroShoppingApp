using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HamroShoppingApp.Helper
{
    public class TokenGenerator
    {
        private readonly IConfiguration _config;

        public TokenGenerator(IConfiguration config)
        {
            _config = config;
        }



        public string GenerateToken(string Id, string FullName)
        {
            // var issuer = _config["Jwt:Issuer"];
            // var audience = _config["Jwt:Audience"];
            // var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
            // var signingCredentials = new SigningCredentials(
            //                         new SymmetricSecurityKey(key),
            //                         SecurityAlgorithms.HmacSha512Signature
            //                     );

            // var subject = new ClaimsIdentity(new[]
            // {
            //     new Claim(ClaimTypes.NameIdentifier,Id),
            //     new Claim(ClaimTypes.Name,FullName)
            //    });
            // var expires = DateTime.UtcNow.AddHours(3);
            // var tokenDescriptor = new SecurityTokenDescriptor
            // {
            //     Subject = subject,
            //     Expires = expires,
            //     Issuer = issuer,
            //     Audience = audience,
            //     SigningCredentials = signingCredentials
            // };
            // var tokenHandler = new JwtSecurityTokenHandler();
            // var token = tokenHandler.CreateToken(tokenDescriptor);
            // var jwtToken = tokenHandler.WriteToken(token);
            // return jwtToken;
            var issuer = _config["JwtConfig:Issuer"];
            var audience = _config["JwtConfig:Audience"];
            var key = _config["JwtConfig:Key"];
            var tokenValidityMins = _config.GetValue<int>("JwtConfig:TokenValidityMins");
            var tokenExpiryTimeStamp = DateTime.UtcNow.AddMinutes(tokenValidityMins);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                        {
                new Claim(ClaimTypes.NameIdentifier,Id),
                 new Claim(ClaimTypes.Name,FullName)
               }),
                Expires = tokenExpiryTimeStamp,
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key)),
                    SecurityAlgorithms.HmacSha512Signature),
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = tokenHandler.WriteToken(securityToken);
            return jwtToken;
        }

    }
}
