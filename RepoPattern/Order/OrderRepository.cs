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
            try
            {
                var order = new AppOrder
                {
                    UserId = userId

                };

                await _dbContext.OrderTbl.AddAsync(order);
                var result = await _dbContext.SaveChangesAsync();

                if (result > 0)
                {
                    foreach (var orderPlaceDto in orderPlaceDtos)
                    {
                        var orderDetails = new AppOrderDetail
                        {
                            OrderId = order.Id,
                            ProductId = orderPlaceDto.ProductId,
                            Quantity = orderPlaceDto.Quantity,
                            UnitPrice = orderPlaceDto.UnitPrice,
                            OrderStatus = "Ordered"
                            //OrderDate = DateTime.UtcNow, 

                        };

                        await _dbContext.OrderDetailTbl.AddAsync(orderDetails);
                    }

                    var orderResult = await _dbContext.SaveChangesAsync();

                    if (orderResult > 0)
                    {
                        return "Successfully Saved";
                    }
                }

                return "Failed to save Order";
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

        public async Task<IEnumerable<OrderGetDto>> GetAllOrder()
{
    try
    {
        var result = await _dbContext.OrderDetailTbl
            .Include(od => od.Order)
                .ThenInclude(o => o.User)
            .Include(od => od.Product)
                .ThenInclude(p => p.Category) // Assuming Category is a navigation property of Product
            .ToListAsync();

        if (result != null)
        {
            return result.Select(orderDetail => new OrderGetDto
            {
                Id = orderDetail.Id,
              photoPath=Convert.ToBase64String(orderDetail.Product.PhotoPath) ,
             ProductName = orderDetail.Product.ProductName, // Assuming Name is a property of Product
               FullName  = orderDetail.Order.User.FullName, // Assuming Name is a property of User
                CategoryName = orderDetail.Product.Category.CategoryName, // Assuming Name is a property of Category
                Address=orderDetail.Order.User.Address,
                PhoneNumber=orderDetail.Order.User.PhoneNumber,
                Quantity = orderDetail.Quantity,
                TotalPrice = orderDetail.TotalPrice,

            });
        }

        return Enumerable.Empty<OrderGetDto>(); // Return an empty enumerable if result is null or empty
    }
    catch (Exception ex)
    {
        // Log the exception if necessary
        throw;
    }
}

    }
}