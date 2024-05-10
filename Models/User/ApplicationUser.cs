using HamroShoppingApp.Models.Cart;
using HamroShoppingApp.Models.Order;
using HamroShoppingApp.Models.Rating;
using Microsoft.AspNetCore.Identity;

namespace HamroShoppingApp.Models.User
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        public ICollection<AppRating> Ratings { get; set; }
        public ICollection<AppCart> Carts { get; set; }
        public ICollection<AppOrder> Orders { get; set; }

        //later to added 
        //public string? RefreshToken { get; set; }
        //public DateTime? RefreshTokenExpiryTime { get; set; }
        //public bool? IsRefreshTokenRevoked { get; set; }
    }
}
