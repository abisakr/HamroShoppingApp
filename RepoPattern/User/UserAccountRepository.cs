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

                var roles = await _userManager.GetRolesAsync(user);
                return _tokenGenerator.GenerateToken(user.Id, user.FullName, roles);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Login failed: {ex.Message}");
                return string.Empty;
            }
        }
        public async Task<string> AdminLogin(LoginDto loginDto)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(loginDto.PhoneNoAsUser);
                if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                    return string.Empty; // Invalid user or password

                var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
                if (!isAdmin)
                    return "FORBIDDEN"; // User is not an admin

                var roles = await _userManager.GetRolesAsync(user);
                return _tokenGenerator.GenerateToken(user.Id, user.FullName, roles); // Generate and return token
            }
            catch (Exception ex)
            {
                // Optionally, you can log the exception or print it if needed.
                Console.WriteLine($"AdminLogin failed: {ex.Message}");
                return string.Empty; // Return empty string on failure
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

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "User");
                }

                return result.Succeeded;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Registration failed: {ex.Message}");
                return false;
            }
        }


    }

}
