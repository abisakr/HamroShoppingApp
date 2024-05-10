using System.ComponentModel.DataAnnotations;

namespace HamroShoppingApp.RepoPattern.User.DTO
{
    public class RegisterDto
    {
        [Required]
        public string FullName { get; set; }
        [Required]
        public string PhoneNo { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
