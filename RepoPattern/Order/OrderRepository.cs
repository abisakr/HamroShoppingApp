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

        public async Task<bool> PlaceOrder(
     IEnumerable<OrderPlaceDto> orderPlaceDtos,
     string userId)
        {
            await using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                var order = new AppOrder
                {
                    UserId = userId
                };

                await _dbContext.OrderTbl.AddAsync(order);
                await _dbContext.SaveChangesAsync();

                foreach (var orderPlaceDto in orderPlaceDtos)
                {
                    var product = await _dbContext.ProductTbl
                        .FirstOrDefaultAsync(p => p.Id == orderPlaceDto.ProductId);

                    // Product doesn't exist
                    if (product == null)
                    {
                        await transaction.RollbackAsync();
                        return false;
                    }

                    // Check stock
                    if (product.StockQuantity < orderPlaceDto.Quantity)
                    {
                        await transaction.RollbackAsync();
                        return false;
                    }

                    // Decrease available stock
                    product.StockQuantity -= orderPlaceDto.Quantity;

                    // Increase sold quantity
                    product.StockSold += orderPlaceDto.Quantity;

                    var orderDetails = new AppOrderDetail
                    {
                        OrderId = order.Id,
                        ProductId = orderPlaceDto.ProductId,
                        Quantity = orderPlaceDto.Quantity,

                        // Better to use the database price
                        UnitPrice = product.Price,

                        OrderStatus = "Ordered",
                        OrderAddress = orderPlaceDto.OrderAddress,
                        DeliveryStatus = "Pending"
                    };

                    await _dbContext.OrderDetailTbl.AddAsync(orderDetails);
                }

                await _dbContext.SaveChangesAsync();

                await transaction.CommitAsync();

                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();

                Console.WriteLine($"Order placement failed: {ex.Message}");

                return false;
            }
        }


        public async Task<bool> EditOrderStatus(EditOrderStatusDto dto)
        {

            try
            {


                var order = await _dbContext.OrderDetailTbl.FirstOrDefaultAsync(a => a.OrderId == dto.OrderId);
                if(order!=null)
                {
                    order.DeliveryStatus = dto.Status;
                     _dbContext.OrderDetailTbl.Update(order);
                await  _dbContext.SaveChangesAsync();
                return true;
                }
                return false;


            }
            catch (Exception ex)
            {

                Console.WriteLine($"Order edit: {ex.Message}");

                return false;
            }
        }

        public async Task<IEnumerable<OrderGetDto>> GetOrdersByUserId(string userId)
        {
            try
            {
                var result = await _dbContext.OrderDetailTbl
                    .Include(p => p.Product).ThenInclude(p=>p.Category)
                    .Where(p => p.Order.UserId == userId).OrderByDescending(p=>p.Order.Id)
                    .ToListAsync();

                return result.Count > 0 ? result.Select(order => new OrderGetDto
                {
                    Id = order.OrderId,
                    UserId = userId,
                    ProductName = order.Product.ProductName,
                    Quantity = order.Quantity,
                    photoPath=order.Product.PhotoPath,
                    CategoryName=order.Product.Category.CategoryName,
                    UnitPrice = order.UnitPrice,
                    ProductId=order.Product.Id,
                    TotalPrice = order.TotalPrice,
                    OrderStatus = order.OrderStatus,
                    DeliveryStatus = order.DeliveryStatus,
                    Address = order.OrderAddress,
                }) : Enumerable.Empty<OrderGetDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to get orders by user: {ex.Message}");
                return Enumerable.Empty<OrderGetDto>();
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
                        .ThenInclude(p => p.Category).OrderByDescending(p => p.Order.Id)
                    .ToListAsync();

                return result.Select(orderDetail => new OrderGetDto
                {
                    Id = orderDetail.OrderId,
                    ProductId=orderDetail.ProductId,
                    photoPath = orderDetail.Product.PhotoPath,
                    ProductName = orderDetail.Product.ProductName,
                    FullName = orderDetail.Order.User.FullName,
                    CategoryName = orderDetail.Product.Category.CategoryName,
                    Address = orderDetail.OrderAddress,
                    OrderStatus = orderDetail.OrderStatus,
                    DeliveryStatus = orderDetail.DeliveryStatus,
                    PhoneNumber = orderDetail.Order.User.PhoneNumber,
                    Quantity = orderDetail.Quantity,
                    TotalPrice = orderDetail.TotalPrice
                }) ?? Enumerable.Empty<OrderGetDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to get all orders: {ex.Message}");
                return Enumerable.Empty<OrderGetDto>();
            }
        }
    }
}