using HamroShoppingApp.RepoPattern.Product.DTO;

namespace HamroShoppingApp.RepoPattern.Product
{
    public interface IProductRepository
    {
        public Task<string> CreateProduct(ProductStoreDto productStoreDto);
        public Task<string> EditProduct(int id, ProductStoreDto productStoreDto);
        public Task<string> DeleteProduct(int id);
        public Task<IEnumerable<ProductGetDto>> GetAllProducts();
        public Task<ProductGetDto> GetProductById(int id);
        public Task<IEnumerable<ProductGetDto>> GetProductByCategoryId(int id);
        public Task<IEnumerable<ProductGetDto>> Search(string name);

    }
}
