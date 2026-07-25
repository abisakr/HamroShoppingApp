using System.ComponentModel.DataAnnotations;

namespace HamroShoppingApp.RepoPattern.User.DTO
{
    public class ProfileEditDto
    {
        public string FullName { get; set; }
        public string PhoneNo { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
      
    }
}
