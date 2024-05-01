using HamroShoppingApp.RepoPattern.Cart.DTO;

namespace HamroShoppingApp.RepoPattern.Cart
{
    public interface ICartRepository
    {
        public Task<string> CreateCart(CartStoreDto cartStoreDto);
        public Task<string> EditCart(int id, CartStoreDto cartStoreDto);
        public Task<string> DeleteCart(int id);
        public Task<IEnumerable<CartGetDto>> GetCartsByUserId();
        public Task<IEnumerable<CartGetDto>> GetAllCarts();
    }
}
