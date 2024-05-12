namespace HamroShoppingApp.RepoPattern.Cart.DTO
{
    public class CartGetDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int ProductId { get; set; }
        public string ProductPhoto { get; set; }
        public int Quantity { get; set; }
        public int TotalCarts { get; set; }
        public double Price { get; set; }
        public double TotalPrice { get; set; }
    }
}
