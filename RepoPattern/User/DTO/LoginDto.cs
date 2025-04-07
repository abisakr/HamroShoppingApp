using System.ComponentModel.DataAnnotations;

namespace HamroShoppingApp.RepoPattern.User.DTO
{
    public class LoginDto
    {
        [Required (ErrorMessage = "Phone number is required.")]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must be 10 digits.")]
        public string PhoneNoAsUser { get; set; }
        [Required (ErrorMessage = "Password is required.")]
        public string Password { get; set; }
    }
}
