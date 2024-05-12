using HamroShoppingApp.RepoPattern.Cart.DTO;

namespace HamroShoppingApp.RepoPattern.Cart
{
    public interface ICartRepository
    {
        public Task<string> CreateCart(CartStoreDto cartStoreDto);
        public Task<string> EditCart(int id, CartEditDto cartEditDto);
        public Task<string> DeleteCart(int id);
        public Task<IEnumerable<CartGetDto>> GetCartsByUserId(string userId);
        public Task<IEnumerable<CartGetDto>> GetAllCarts();
    }
}
