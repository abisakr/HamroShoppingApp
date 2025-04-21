using System.Net;
using System.Net.Mail;
using Google.Apis.Auth;
using HamroShoppingApp.Helper;
using HamroShoppingApp.Models.User;
using HamroShoppingApp.RepoPattern.User;
using HamroShoppingApp.RepoPattern.User.DTO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
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

        [HttpPost("login/user")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var token = await _userAccountRepository.Login(loginDto);
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest("Invalid username or password.");
            }

            HttpContext.Response.Cookies.Append("accessToken", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                IsEssential = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok("Logged in successfully");
        }

        [HttpPost("login/admin")]
        public async Task<IActionResult> AdminLogin([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var token = await _userAccountRepository.AdminLogin(loginDto);
            if (string.IsNullOrEmpty(token))
                return Unauthorized("Invalid username or password.");

            if (token == "FORBIDDEN")
                return Forbid("You are not authorized as an admin.");

            HttpContext.Response.Cookies.Append("accessToken", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                IsEssential = true,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new
            {
                message = "Admin logged in successfully",
                token = token,
                expires = DateTime.UtcNow.AddDays(7)
            });
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            // Validate the model
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Return validation errors
            }

            var result = await _userAccountRepository.Register(registerDto);

            if (result)
            {
                return Ok(new { Message = "User Created Successfully" });
            }
            else
            {
                return BadRequest("User Creation Failed");
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin,User")]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("accessToken");
            return Ok("Logged out successfully");
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return BadRequest("User not found");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var resetLink = $"http://127.0.0.1:5500/reset-password.html?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(user.Email)}";

            // Send Email
            string fromMail = "abiskar.ag@gmail.com";
            string fromPassword = "wjvcviyevaqiqqtn";

            MailMessage message = new MailMessage();
            message.From = new MailAddress(fromMail);
            message.Subject = "Reset Your Password";
            message.To.Add(new MailAddress(user.Email));
            message.Body = $"<html><body>Click <a href='{resetLink}'>here</a> to reset your password.</body></html>";
            message.IsBodyHtml = true;

            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(fromMail, fromPassword),
                EnableSsl = true,
            };

            await smtpClient.SendMailAsync(message);

            return Ok("Password reset email sent.");
        }
        
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return BadRequest("User not found");

            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { Errors = errors });
            }

            return Ok("Password has been reset successfully.");
        }

    }
}
