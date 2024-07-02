namespace HamroShoppingApp.RepoPattern.Order.DTO
{
    public class OrderGetDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string ProductName { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string photoPath { get; set; }
        public string CategoryName { get; set; }
        public string FullName { get; set; }
        public int Quantity { get; set; }
        public double UnitPrice { get; set; }
        public string OrderStatus { get; set; }
        public double TotalPrice { get; set; }

    }
}
