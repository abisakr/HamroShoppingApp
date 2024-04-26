using HamroShoppingApp.RepoPattern.User;
using HamroShoppingApp.RepoPattern.User.DTO;
using Microsoft.AspNetCore.Mvc;

namespace HamroShoppingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAccountController : ControllerBase
    {
        private readonly IUserAccountRepository _userAccountRepository;

        public UserAccountController(IUserAccountRepository userAccountRepository)
        {
            _userAccountRepository = userAccountRepository;
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
