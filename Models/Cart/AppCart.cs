using HamroShoppingApp.Models.Product;
using HamroShoppingApp.Models.User;
using System.ComponentModel.DataAnnotations;

namespace HamroShoppingApp.Models.Cart
{
    public class AppCart
    {

        [Key]
        public int Id { get; set; }
        public string UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public int TotalCarts { get; set; }

        public AppProduct Product { get; set; }
        public ApplicationUser User { get; set; }
    }
}
