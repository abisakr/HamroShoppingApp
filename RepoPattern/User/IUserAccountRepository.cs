using HamroShoppingApp.RepoPattern.User.DTO;

namespace HamroShoppingApp.RepoPattern.User
{
    public interface IUserAccountRepository
    {
        public Task<bool> Register(RegisterDto registerDto);
        public Task<string> Login(LoginDto loginDto);
        public Task<string> AdminLogin(LoginDto loginDto);
    }
}
