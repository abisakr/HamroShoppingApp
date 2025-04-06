using HamroShoppingApp.Helper;
using HamroShoppingApp.Models.User;
using HamroShoppingApp.RepoPattern.User.DTO;
using Microsoft.AspNetCore.Identity;

namespace HamroShoppingApp.RepoPattern.User
{
    public class UserAccountRepository : IUserAccountRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly TokenGenerator _tokenGenerator;

        public UserAccountRepository(UserManager<ApplicationUser> userManager, TokenGenerator tokenGenerator)
        {
            _userManager = userManager;
            _tokenGenerator = tokenGenerator;
        }

        public async Task<string> Login(LoginDto loginDto)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(loginDto.PhoneNoAsUser);
                if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                {
                    return string.Empty;
                }

                return _tokenGenerator.GenerateToken(user.Id, user.FullName);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Login failed: {ex.Message}");
                return string.Empty;
            }
        }



        public async Task<bool> Register(RegisterDto registerDto)
        {
            try
            {
                var user = new ApplicationUser
                {
                    FullName = registerDto.FullName,
                    PhoneNumber = registerDto.PhoneNo,
                    Address = registerDto.Address,
                    UserName = registerDto.PhoneNo,
                    City = registerDto.City,
                    Country = registerDto.Country
                };

                var result = await _userManager.CreateAsync(user, registerDto.Password);

                return result.Succeeded;
            }
            catch (Exception ex)
            {
                // Optionally, log the exception
                Console.WriteLine($"Registration failed: {ex.Message}");
                return false;
            }
        }

    }

}
