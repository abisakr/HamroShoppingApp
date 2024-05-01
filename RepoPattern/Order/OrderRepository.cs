using HamroShoppingApp.DataContext;
using HamroShoppingApp.RepoPattern.Order.DTO;

namespace HamroShoppingApp.RepoPattern.Order
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public OrderRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public Task<IEnumerable<OrderGetDto>> GetOrdersByProductId()
        {
            throw new NotImplementedException();
        }

        public Task<string> PlaceOrder(OrderPlaceDto orderPlaceDto)
        {
            throw new NotImplementedException();
        }
    }
}
