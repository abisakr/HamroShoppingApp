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
        [HttpPost("login-google")]
        public async Task<IActionResult> GoogleLogin([FromBody] string tokenId)
        {
            try
            {
                var payload = await VerifyGoogleToken(tokenId);
                if (payload == null)
                {
                    return Unauthorized("Invalid Google token.");
                }

                var user = await _userManager.FindByEmailAsync(payload.Email);
                if (user == null)
                {
                    user = new ApplicationUser
                    {
                        UserName = payload.Email,
                        Email = payload.Email,
                        FullName = payload.Name,
                    };
                    var result = await _userManager.CreateAsync(user);
                    if (!result.Succeeded)
                    {
                        return BadRequest("User registration failed.");
                    }
                }

                var token = _tokenGenerator.GenerateToken(user.Id, user.FullName);
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing your request: " + ex.Message);
            }
        }

        private async Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(string tokenId)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string>() { _configuration["Authentication:Google:ClientId"] }
                };

                var payload = await GoogleJsonWebSignature.ValidateAsync(tokenId, settings);
                return payload;
            }
            catch
            {
                return null;
            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            try
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
                else return BadRequest("Please Enter The Data");
            }

            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing your request." + ex);
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            try
            {
                if (registerDto != null)
                {
                    var result = await _userAccountRepository.Register(registerDto);
                    if (string.IsNullOrEmpty(result))
                    {
                        return BadRequest("Registeration Failed.");
                    }

                    return Ok(new { Message = result });

                }
                else return BadRequest("Please Enter The Data");
            }

            catch (Exception)
            {

                return StatusCode(500, "An error occurred while processing your request.");
            }
        }
    }
}
