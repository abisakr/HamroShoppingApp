using HamroShoppingApp.Models.Product;
using HamroShoppingApp.Models.User;
using System.ComponentModel.DataAnnotations;

namespace HamroShoppingApp.Models.Rating
{
    public class AppRating
    {
        [Key]
        public int Id { get; set; }
        public string UserId { get; set; }
        public int ProductId { get; set; }
        public int UserRating { get; set; }
        public string? Review { get; set; }

        public AppProduct Product { get; set; }
        public ApplicationUser User { get; set; }

    }
}
