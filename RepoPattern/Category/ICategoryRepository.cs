using HamroShoppingApp.RepoPattern.Category.DTO;

namespace HamroShoppingApp.RepoPattern.Category
{
    public interface ICategoryRepository
    {
        public Task<bool> CreateCategory(CategoryStoreDto categoryDto);
        public Task<bool> EditCategory(int id, CategoryStoreDto categoryDto);
        public Task<bool> DeleteCategory(int id);
        public Task<IEnumerable<CategoryGetDto>> GetAllCategory();
    }
}
