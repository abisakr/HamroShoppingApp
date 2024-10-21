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
            var existingCart = await _dbContext.CartTbl
                .FirstOrDefaultAsync(a => a.UserId == cartStoreDto.UserId && a.ProductId == cartStoreDto.ProductId);

            if (existingCart != null)
            {
                existingCart.Quantity++;
            }
            else
            {
                var cart = new AppCart
                {
                    UserId = cartStoreDto.UserId,
                    ProductId = cartStoreDto.ProductId,
                    Quantity = 1
                };
                await _dbContext.CartTbl.AddAsync(cart);
            }

            return await _dbContext.SaveChangesAsync() > 0 ? "Successfully Saved" : "Failed to save Cart";
        }

        public async Task<string> DeleteCart(int id)
        {
            if (id <= 0) return "Invalid Id";

            var cart = await _dbContext.CartTbl.FindAsync(id);
            if (cart == null) return "Cart Not Found";

            _dbContext.CartTbl.Remove(cart);
            return await _dbContext.SaveChangesAsync() > 0 ? "Cart Deleted Successfully" : "Failed To Delete Cart";
        }

        public async Task<string> EditCart(int id, CartEditDto cartEditDto)
        {
            var cart = await _dbContext.CartTbl.FindAsync(id);
            if (cart == null) return "Cart Not Found";

            cart.Quantity = cartEditDto.Quantity;
            _dbContext.CartTbl.Update(cart);
            return await _dbContext.SaveChangesAsync() > 0 ? "Cart Edited Successfully" : "Failed To Edit Cart";
        }

        public async Task<IEnumerable<CartGetDto>> GetAllCarts()
        {
            var result = await _dbContext.CartTbl.ToListAsync();
            return result.Select(cart => new CartGetDto
            {
                Id = cart.Id,
                UserId = cart.UserId,
                ProductName = cart.Product.ProductName,
                Quantity = cart.Quantity,
                TotalCarts = cart.TotalCarts
            }) ?? Enumerable.Empty<CartGetDto>();
        }

        public async Task<IEnumerable<CartGetDto>> GetCartsByUserId(string userId)
        {
            if (userId == null) return null;

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
            }) ?? null;
        }

        public async Task<string> DeleteCartByUserId(string userId)
        {
            if (string.IsNullOrEmpty(userId)) return "Invalid user ID.";

            var cartItems = await _dbContext.CartTbl
                .Where(cart => cart.UserId == userId).ToListAsync();

            if (cartItems == null || !cartItems.Any()) return "No cart items found for this user.";

            _dbContext.CartTbl.RemoveRange(cartItems);
            return await _dbContext.SaveChangesAsync() > 0 ? "Cart deleted successfully." : "Failed to delete cart.";
        }
    }
}
