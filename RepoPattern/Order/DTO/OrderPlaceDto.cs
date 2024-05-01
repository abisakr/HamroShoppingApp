namespace HamroShoppingApp.RepoPattern.Order.DTO
{
    public class OrderPlaceDto
    {
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public double UnitPrice { get; set; }
        public double TotalPrice => UnitPrice * Quantity;
        public string OrderStatus { get; set; }
    }
}
