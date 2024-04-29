namespace HamroShoppingApp.RepoPattern.Product.DTO
{
    public class ProductGetDto
    {
        public string CategoryName { get; set; }
        public string ProductName { get; set; }
        public double Price { get; set; }
        public string Discount { get; set; }
        public int StockQuantity { get; set; }
        public int StockSold { get; set; }
        public string Description { get; set; }
        public string DeliveryStatus { get; set; }
        public int? ProductRating { get; set; }
        public int? TotalProductRated { get; set; }
        public string PhotoPath { get; set; }
    }
}
