using HamroShoppingApp.DataContext;
using HamroShoppingApp.Models.Cart;
using HamroShoppingApp.RepoPattern.Cart.DTO;
using Microsoft.EntityFrameworkCore;

namespace HamroShoppingApp.RepoPattern.Cart
{
    public class CartRepository : ICartRepository
    {
        private readonly ApplicationDbContext _dbContext;
        public CartRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<string> CreateCart(CartStoreDto cartStoreDto)
        {
            try
            {
                var totalCarts = _dbContext.CartTbl.Where(a => a.UserId == cartStoreDto.UserId);
                var cart = new AppCart
                {
                    UserId = cartStoreDto.UserId, //get user id from request header
                    ProductId = cartStoreDto.ProductId,
                    Quantity = 1,
                    TotalCarts = totalCarts.Count() + 1
                };

                await _dbContext.CartTbl.AddAsync(cart);
                var result = await _dbContext.SaveChangesAsync();

                if (result > 0)
                {
                    return "Successfully Saved";
                }
                else
                {
                    return "Failed to save Cart";
                }
            }

            catch (Exception ex)
            {
                throw new Exception("An error occurred while Creating Cart.", ex);
            }

        }

        public async Task<string> DeleteCart(int id)
        {
            try
            {
                if (id > 0)
                {
                    var cart = await _dbContext.CartTbl.FindAsync(id);
                    if (cart != null)
                    {
                        _dbContext.CartTbl.Remove(cart);
                        var result = await _dbContext.SaveChangesAsync();
                        if (result > 0)
                        {
                            return "Cart Deleted SuccessFully";
                        }
                        return "Failed To Delete Cart";
                    }
                    return "Cart NotFound";
                }
                return "Invalid Id";
            }

            catch (Exception ex)
            {
                throw new Exception("An error occurred while Deleting categories.", ex);
            }
        }

        public async Task<string> EditCart(int id, CartEditDto cartEditDto)
        {
            try
            {
                var cart = await _dbContext.CartTbl.FindAsync(id);
                if (cart != null)
                {
                    cart.Quantity = cartEditDto.Quantity;
                    _dbContext.CartTbl.Update(cart);
                    var result = await _dbContext.SaveChangesAsync();
                    if (result > 0)
                    {
                        return "Cart Edited SuccessFully";
                    }
                    return "Failed To Edit Cart";
                }
                return "Cart NotFound";

            }
            catch (Exception ex)
            {

                throw new Exception("An error occurred while Editing Cart.", ex);
            }
        }

        public async Task<IEnumerable<CartGetDto>> GetAllCarts()
        {
            try
            {
                var result = await _dbContext.CartTbl.ToListAsync();
                if (result != null)
                {
                    return result.Select(cart => new CartGetDto
                    {
                        Id = cart.Id,
                        UserId = cart.UserId,
                        ProductId = cart.ProductId,
                        Quantity = cart.Quantity,
                        TotalCarts = cart.TotalCarts
                    });
                }
                return Enumerable.Empty<CartGetDto>();
            }

            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching Cart.", ex);
            }
        }

        public async Task<IEnumerable<CartGetDto>> GetCartsByUserId(string userId)
        {
            try
            {
                if (userId != null)
                {
                    var result = await _dbContext.CartTbl.Include(a => a.Product)
                        .Where(p => p.UserId == userId).ToListAsync();

                    if (result != null)
                    {
                        return result.Select(cart => new CartGetDto
                        {
                            Id = cart.Id,
                            UserId = cart.UserId,
                            ProductId = cart.ProductId,
                            ProductPhoto = cart.Product.PhotoPath,
                            Quantity = cart.Quantity,
                            TotalCarts = cart.TotalCarts,
                            Price = cart.Product.Price
TotalPrice = cart.Product.Price * cart.Quantity
                        });
                    }
                    return null;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching Products.", ex);
            }
        }

    }
}
