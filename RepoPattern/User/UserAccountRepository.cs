using HamroShoppingApp.DataContext;
using HamroShoppingApp.Helper;
using HamroShoppingApp.Models.User;
using HamroShoppingApp.RepoPattern.User.DTO;
using Microsoft.AspNetCore.Identity;

namespace HamroShoppingApp.RepoPattern.User
{
    public class UserAccountRepository : IUserAccountRepository
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly TokenGenerator _tokenGenerator;

        public UserAccountRepository(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager, TokenGenerator tokenGenerator)
        {
            _dbContext = dbContext;
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
                    var token = _tokenGenerator.GenerateToken(user);
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
