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

        //public string GenerateTokens(string Id, string FullName)
        //{
        //    //var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Authentication:SecurityKey"]));

        //    string securityKeyString = _config["Authentication:SecurityKey"] ?? "DefaultSecurityKey";
        //    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKeyString));
        //    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        //    var claims = new[]
        //    {
        //        new Claim(ClaimTypes.NameIdentifier,Id),
        //        new Claim(ClaimTypes.Name,FullName)
        //    };
        //    var token = new JwtSecurityToken(_config["Authentication:Issuer"],
        //        _config["Authentication:Audience"],
        //        claims,
        //        expires: DateTime.Now.AddMinutes(60),
        //        signingCredentials: credentials);


        //    return new JwtSecurityTokenHandler().WriteToken(token);

        //}


        public string GenerateToken(string Id, string FullName)
        {
            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
            var signingCredentials = new SigningCredentials(
                                    new SymmetricSecurityKey(key),
                                    SecurityAlgorithms.HmacSha512Signature
                                );

            var subject = new ClaimsIdentity(new[]
            {
  //            new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
  //            new Claim(JwtRegisteredClaimNames.Email, user.UserName),
                new Claim(ClaimTypes.NameIdentifier,Id),
                new Claim(ClaimTypes.Name,FullName)
               });
            var expires = DateTime.UtcNow.AddMinutes(100);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = subject,
                Expires = expires,
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = signingCredentials
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = tokenHandler.WriteToken(token);
            return jwtToken;
        }

    }
}
