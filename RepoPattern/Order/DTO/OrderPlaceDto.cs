namespace HamroShoppingApp.RepoPattern.Order.DTO
{
    public class OrderPlaceDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public double UnitPrice { get; set; }
        public string OrderAddress { get; set; }
    }
}