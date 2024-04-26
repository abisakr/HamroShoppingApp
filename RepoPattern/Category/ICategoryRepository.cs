using HamroShoppingApp.RepoPattern.Category.DTO;

namespace HamroShoppingApp.RepoPattern.Category
{
    public interface ICategoryRepository
    {
        public Task<string> CreateCategory(CategoryStoreDto categoryDto);
        public Task<string> EditCategory(int id, CategoryStoreDto categoryDto);
        public Task<string> DeleteCategory(int id);
        public Task<IEnumerable<CategoryGetDto>> GetAllCategory();
    }
}
