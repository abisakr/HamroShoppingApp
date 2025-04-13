using HamroShoppingApp.RepoPattern.Cart.DTO;

namespace HamroShoppingApp.RepoPattern.Cart
{
    public interface ICartRepository
    {
        public Task<bool> CreateCart(CartStoreDto cartStoreDto,string userId);
        public Task<bool> EditCart(int id, CartEditDto cartEditDto);
        public Task<bool> DeleteCart(int id);
        public Task<IEnumerable<CartGetDto>> GetCartsByUserId(string userId);
        public Task<IEnumerable<CartGetDto>> GetAllCarts();
        public Task<bool> DeleteCartByUserId(string userId);
    }
}
