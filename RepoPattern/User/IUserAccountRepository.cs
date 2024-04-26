using HamroShoppingApp.RepoPattern.User.DTO;

namespace HamroShoppingApp.RepoPattern.User
{
    public interface IUserAccountRepository
    {
        public Task<string> Register(RegisterDto registerDto);
        public Task<string> Login(LoginDto loginDto);
    }
}
