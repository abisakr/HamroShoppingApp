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

        public async Task<string> PlaceOrder(IEnumerable<OrderPlaceDto> orderPlaceDtos, string userId)
        {
            var order = new AppOrder { UserId = userId };
            await _dbContext.OrderTbl.AddAsync(order);
            if (await _dbContext.SaveChangesAsync() <= 0) return "Failed to save Order";

            foreach (var orderPlaceDto in orderPlaceDtos)
            {
                var orderDetails = new AppOrderDetail
                {
                    OrderId = order.Id,
                    ProductId = orderPlaceDto.ProductId,
                    Quantity = orderPlaceDto.Quantity,
                    UnitPrice = orderPlaceDto.UnitPrice,
                    OrderStatus = "Ordered"
                };

                await _dbContext.OrderDetailTbl.AddAsync(orderDetails);
            }

            return await _dbContext.SaveChangesAsync() > 0 ? "Successfully Saved" : "Failed to save Order";
        }

        public async Task<IEnumerable<OrderGetDto>> GetOrdersByUserId(string userId)
        {
            if (userId == null) return null;

            var result = await _dbContext.OrderDetailTbl
                .Include(p => p.Product)
                .Where(p => p.Order.UserId == userId)
                .ToListAsync();

            return result.Count() > 0 ? result.Select(order => new OrderGetDto
            {
                Id = order.Id,
                UserId = userId,
                ProductName = order.Product.ProductName,
                Quantity = order.Quantity,
                UnitPrice = order.UnitPrice,
                TotalPrice = order.TotalPrice,
                OrderStatus = order.OrderStatus
            }) : null;
        }

        public async Task<IEnumerable<OrderGetDto>> GetAllOrder()
        {
            var result = await _dbContext.OrderDetailTbl
                .Include(od => od.Order)
                    .ThenInclude(o => o.User)
                .Include(od => od.Product)
                    .ThenInclude(p => p.Category)
                .ToListAsync();

            return result.Select(orderDetail => new OrderGetDto
            {
                Id = orderDetail.Id,
                photoPath = Convert.ToBase64String(orderDetail.Product.PhotoPath),
                ProductName = orderDetail.Product.ProductName,
                FullName = orderDetail.Order.User.FullName,
                CategoryName = orderDetail.Product.Category.CategoryName,
                Address = orderDetail.Order.User.Address,
                PhoneNumber = orderDetail.Order.User.PhoneNumber,
                Quantity = orderDetail.Quantity,
                TotalPrice = orderDetail.TotalPrice
            }) ?? Enumerable.Empty<OrderGetDto>();
        }
    }
}
