using System.Data.Common;
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

        public async Task<bool> CreateCart(CartStoreDto cartStoreDto, string userId)
        {
            try
            {
                var existingCart = await _dbContext.CartTbl
                    .FirstOrDefaultAsync(a => a.UserId == userId && a.ProductId == cartStoreDto.ProductId);

                if (existingCart != null)
                {
                    existingCart.Quantity++;
                }
                else
                {
                    var cart = new AppCart
                    {
                        UserId = userId,
                        ProductId = cartStoreDto.ProductId,
                        Quantity = 1
                    };
                    await _dbContext.CartTbl.AddAsync(cart);
                }

                return await _dbContext.SaveChangesAsync() > 0;
            }

            catch (DbUpdateException)
            {
                return false; // Return false in case of an error
            }
        }
        public async Task<bool> DeleteCart(int id)
        {
            try
            {
                var cart = await _dbContext.CartTbl.FindAsync(id);
                if (cart == null) return false;
                _dbContext.CartTbl.Remove(cart);
                return await _dbContext.SaveChangesAsync() > 0;
            }

            catch (DbUpdateException)
            {
                return false; // Return false in case of an error
            }
        }

        public async Task<bool> EditCart(int id, CartEditDto cartEditDto)
        {
            try
            {
                var cart = await _dbContext.CartTbl.FindAsync(id);
                if (cart == null) return false;
                cart.Quantity = cartEditDto.Quantity;
                _dbContext.CartTbl.Update(cart);
                return await _dbContext.SaveChangesAsync() > 0;
            }
            catch (DbUpdateException)
            {
                return false; // Return false in case of an error
            }
        }

        public async Task<IEnumerable<CartGetDto>> GetAllCarts()
        {
            try
            {
                var result = await _dbContext.CartTbl.Include(c => c.Product).ToListAsync();
                return result.Select(cart => new CartGetDto
                {
                    Id = cart.Id,
                    UserId = cart.UserId,
                    ProductName = cart.Product.ProductName,
                    Quantity = cart.Quantity,
                    TotalCarts = cart.TotalCarts
                });

            }
            catch (Exception)
            {
                return Enumerable.Empty<CartGetDto>(); // Return an empty list in case of an error
            }
        }
        public async Task<IEnumerable<CartGetDto>> GetCartsByUserId(string userId)
        {
            try
            {
                var result = await _dbContext.CartTbl.Include(cart => cart.Product)
                    .Where(cart => cart.UserId == userId).ToListAsync();

                return result.Select(cart => new CartGetDto
                {
                    Id = cart.Id,
                    UserId = cart.UserId,
                    ProductId = cart.ProductId,
                    ProductName = cart.Product.ProductName,
                    ProductPhoto = Convert.ToBase64String(cart.Product.PhotoPath),
                    Quantity = cart.Quantity,
                    TotalCarts = cart.TotalCarts,
                    Price = cart.Product.Price,
                    TotalPrice = cart.Product.Price * cart.Quantity
                });
            }
            catch (Exception)
            {
                return Enumerable.Empty<CartGetDto>(); // Return an empty list in case of an error
            }
        }

        //used in order controller to delete cart after placing order
        public async Task<bool> DeleteCartByUserId(string userId)
        {
            try
            {
                var cartItems = await _dbContext.CartTbl
                    .Where(cart => cart.UserId == userId).ToListAsync();
                if (!cartItems.Any()) return false;
                _dbContext.CartTbl.RemoveRange(cartItems);
                return await _dbContext.SaveChangesAsync() > 0;
            }
            catch (DbUpdateException)
            {

                return false; // Return false in case of an error
            }
        }
    }
}
