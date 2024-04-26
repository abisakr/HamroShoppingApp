using System.ComponentModel.DataAnnotations;

namespace HamroShoppingApp.RepoPattern.User.DTO
{
    public class LoginDto
    {
        [Required]
        public string PhoneNoAsUser { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
