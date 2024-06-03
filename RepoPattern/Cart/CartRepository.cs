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
                // Check if the cart already exists for the user and product
                var existingCart = _dbContext.CartTbl.FirstOrDefault(a => a.UserId == cartStoreDto.UserId && a.ProductId == cartStoreDto.ProductId);

                if (existingCart != null)
                {
                    // If cart exists, increment the quantity by 1
                    existingCart.Quantity++;
                }
                else
                {
                    // If cart doesn't exist, create a new cart entry with quantity 1
                    var cart = new AppCart
                    {
                        UserId = cartStoreDto.UserId, //get user id from request header
                        ProductId = cartStoreDto.ProductId,
                        Quantity = 1
                    };

                    await _dbContext.CartTbl.AddAsync(cart);
                }

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
                        ProductName = cart.Product.ProductName,
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
                    var result = await _dbContext.CartTbl.Include(cart => cart.Product)
                        .Where(cart => cart.UserId == userId).ToListAsync();

                    if (result != null)
                    {
                        return result.Select(cart => new CartGetDto
                        {
                            Id = cart.Id,
                            UserId = cart.UserId,
                            ProductId = cart.ProductId,
                            ProductName = cart.Product.ProductName,
                            ProductPhoto = cart.Product.PhotoPath,
                            Quantity = cart.Quantity,
                            TotalCarts = cart.TotalCarts,
                            Price = cart.Product.Price,
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
        public async Task<string> DeleteCartByUserId(string userId)
        {
            try
            {
                if (string.IsNullOrEmpty(userId))
                {
                    return "Invalid user ID.";
                }

                var cartItems = await _dbContext.CartTbl.Include(cart => cart.Product)
                    .Where(cart => cart.UserId == userId).ToListAsync();

                if (cartItems == null || !cartItems.Any())
                {
                    return "No cart items found for this user.";
                }

                _dbContext.CartTbl.RemoveRange(cartItems);
                var result = await _dbContext.SaveChangesAsync();

                if (result > 0)
                {
                    return "Cart deleted successfully.";
                }
                return "Failed to delete cart.";
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the cart.", ex);
            }
        }

    }
}
