using HamroShoppingApp.Models.Order;
using HamroShoppingApp.Models.Product;
using System.ComponentModel.DataAnnotations;

namespace HamroShoppingApp.Models.OrderDetail
{
    public class AppOrderDetail
    {
        [Key]
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public double UnitPrice { get; set; }
        public double TotalPrice => UnitPrice * Quantity;
        public string OrderStatus { get; set; }


        public AppOrder Order { get; set; }
        public AppProduct Product { get; set; }

    }
}
