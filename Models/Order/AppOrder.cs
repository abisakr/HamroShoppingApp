using HamroShoppingApp.Models.OrderDetail;
using HamroShoppingApp.Models.User;
using System.ComponentModel.DataAnnotations;

namespace HamroShoppingApp.Models.Order
{
    public class AppOrder
    {
        [Key]
        public int Id { get; set; }
        public string UserId { get; set; }

        public ApplicationUser User { get; set; }
        public ICollection<AppOrderDetail> OrderDetails { get; set; }



    }
}
