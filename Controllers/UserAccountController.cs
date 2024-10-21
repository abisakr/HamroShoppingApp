using Google.Apis.Auth;
using HamroShoppingApp.Helper;
using HamroShoppingApp.Models.User;
using HamroShoppingApp.RepoPattern.User;
using HamroShoppingApp.RepoPattern.User.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HamroShoppingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUserAccountRepository _userAccountRepository;
        private readonly IConfiguration _configuration;
        private readonly TokenGenerator _tokenGenerator;

        public UserAccountController(UserManager<ApplicationUser> userManager, IUserAccountRepository userAccountRepository, IConfiguration configuration, TokenGenerator tokenGenerator)
        {
            _userManager = userManager;
            _userAccountRepository = userAccountRepository;
            _configuration = configuration;
            _tokenGenerator = tokenGenerator;
        }

        public class GoogleLoginRequestDto
        {
            public string Token { get; set; }
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                return BadRequest("Token is required.");
            }

            var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token);
            var user = await _userManager.FindByEmailAsync(payload.Email);
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = "9867926116",
                    Email = payload.Email,
                    Address = "Butwal",
                    City = "Butwal",
                    Country = "Nepal",
                    FullName = "Someone",
                    PhoneNumber = "9867926116"
                };
                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded)
                {
                    return BadRequest("Failed to create user.");
                }
            }

            // Use the GenerateToken method to create the JWT token
            var jwtToken = _tokenGenerator.GenerateToken(user.Id, user.FullName);

            return Ok(new
            {
                token = jwtToken,
                expiration = DateTime.UtcNow.AddHours(3) // Ensure this matches the expiration in GenerateToken
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            if (loginDto != null)
            {
                var result = await _userAccountRepository.Login(loginDto);
                if (string.IsNullOrEmpty(result))
                {
                    return BadRequest("Invalid username or password.");
                }
                return Ok(new { Token = result });
            }
            return BadRequest("Please Enter The Data");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            if (registerDto != null)
            {
                var result = await _userAccountRepository.Register(registerDto);
                if (string.IsNullOrEmpty(result))
                {
                    return BadRequest("Registration Failed.");
                }

                return Ok(new { Message = result });
            }
            return BadRequest("Please Enter The Data");
        }
    }
}
