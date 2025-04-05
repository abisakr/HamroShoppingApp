using HamroShoppingApp.RepoPattern.Product.DTO;

namespace HamroShoppingApp.RepoPattern.Product
{
    public interface IProductRepository
    {
        public Task<bool> CreateProduct(ProductStoreDto productStoreDto);
        public Task<bool> EditProduct(int id, ProductStoreDto productStoreDto);
        public Task<bool> DeleteProduct(int id);
        public Task<IEnumerable<ProductGetDto>> GetAllProducts();
        public Task<ProductGetDto> GetProductById(int id);
        public Task<IEnumerable<ProductGetDto>> GetProductByCategoryId(int id);
        public Task<IEnumerable<ProductGetDto>> Search(string name);
        public Task<IEnumerable<ProductGetDto>> GetAllPopularProducts();
        public Task<IEnumerable<ProductGetDto>> GetShortedFilteredProduct(string categoryName, string order);

    }
}
