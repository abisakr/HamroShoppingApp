using System.ComponentModel.DataAnnotations;

namespace HamroShoppingApp.RepoPattern.User.DTO
{
    public class RegisterDto
    {
        public string? Token { get; set; }
        [Required (ErrorMessage = "Full Name is required.")]
        public string FullName { get; set; }
        [Required (ErrorMessage = "Phone Number is required.")]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must be 10 digits.")]
        public string PhoneNo { get; set; }
        [Required (ErrorMessage = "Address is required.")]
        public string Address { get; set; }
        [Required (ErrorMessage = "City is required.")]
        public string City { get; set; }
        [Required (ErrorMessage = "Country is required.")]
        public string Country { get; set; }
        [Required   (ErrorMessage = "Password is required.")]
           [MinLength(5, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; }
    }
}
