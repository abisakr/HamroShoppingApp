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
                var passwordCheck = await _userManager.CheckPasswordAsync(user, loginDto.Password);
                if (user != null && passwordCheck)
                {
                    var token = _tokenGenerator.GenerateToken(user.Id, user.FullName);
                    return token;
                }
                return string.Empty;
            }

            catch (Exception ex)
            {
                throw new Exception("Error occurred while fetching user.", ex);
            }
        }

        public async Task<string> Register(RegisterDto registerDto)
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
                    return "User registered successfully.";
                }
                return string.Empty;
            }

            catch (Exception ex)
            {
                throw new Exception("Error occurred while fetching user.", ex);
            }
        }
    }
}
