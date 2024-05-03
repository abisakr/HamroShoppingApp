using HamroShoppingApp.DataContext;
using HamroShoppingApp.Models.Order;
using HamroShoppingApp.Models.OrderDetail;
using HamroShoppingApp.RepoPattern.Order.DTO;
using Microsoft.EntityFrameworkCore;

namespace HamroShoppingApp.RepoPattern.Order
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public OrderRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<string> PlaceOrder(OrderPlaceDto orderPlaceDto)
        {
            try
            {
                string userId = "8c23792b-3f0b-42af-97a5-ba96604bd33c";
                var order = new AppOrder
                {
                    UserId = userId
                };

                await _dbContext.OrderTbl.AddAsync(order);
                var result = await _dbContext.SaveChangesAsync();

                var orderDetails = new AppOrderDetail
                {
                    OrderId = order.Id,
                    ProductId = orderPlaceDto.ProductId,
                    Quantity = orderPlaceDto.Quantity,
                    UnitPrice = orderPlaceDto.UnitPrice,
                    OrderStatus = "Ordered"
                };
                await _dbContext.OrderDetailTbl.AddAsync(orderDetails);
                var orderResult = await _dbContext.SaveChangesAsync();

                if (orderResult > 0 && result > 0)
                {
                    return "Successfully Saved";
                }
                else
                {
                    return "Failed to save Order";
                }
            }

            catch (Exception ex)
            {
                throw new Exception("An error occurred while Placing Order.", ex);
            }

        }

        public async Task<IEnumerable<OrderGetDto>> GetOrdersByUserId(string userId)
        {
            try
            {

                if (userId != null)
                {
                    var result = await _dbContext.OrderDetailTbl.Include(p => p.Product)
                        .Where(p => p.Order.UserId == userId).ToListAsync();

                    if (result.Count() > 0)
                    {
                        return result.Select(order => new OrderGetDto
                        {
                            Id = order.Id,
                            UserId = userId,
                            ProductName = order.Product.ProductName,
                            Quantity = order.Quantity,
                            UnitPrice = order.UnitPrice,
                            TotalPrice = order.TotalPrice,
                            OrderStatus = order.OrderStatus,
                        });
                    }
                    return null;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching Orders.", ex);
            }
        }
    }
}