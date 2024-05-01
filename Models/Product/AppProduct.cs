using HamroShoppingApp.Models.Cart;
using HamroShoppingApp.Models.Category;
using HamroShoppingApp.Models.Rating;
using System.ComponentModel.DataAnnotations;

namespace HamroShoppingApp.Models.Product
{
    public class AppProduct
    {
        [Key]
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string ProductName { get; set; }
        public double Price { get; set; }
        public string Discount { get; set; }
        public int StockQuantity { get; set; }
        public int StockSold { get; set; }
        public string Description { get; set; }
        public string DeliveryStatus { get; set; }
        public double? ProductRating { get; set; }
        public int? TotalProductRated { get; set; }
        public string PhotoPath { get; set; }

        public AppCategory Category { get; set; }
        public ICollection<AppRating> Ratings { get; set; }
        public ICollection<AppCart> Carts { get; set; }

    }
}
