using HamroShoppingApp.DataContext;
using HamroShoppingApp.Models.Category;
using HamroShoppingApp.RepoPattern.Category.DTO;
using Microsoft.EntityFrameworkCore;

namespace HamroShoppingApp.RepoPattern.Category
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public CategoryRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<string> CreateCategory(CategoryStoreDto categoryDto)
        {
            if (categoryDto.Photo == null || categoryDto.Photo.Length == 0)
            {
                return "No image file uploaded";
            }

            using (var stream = categoryDto.Photo.OpenReadStream())
            using (var memoryStream = new MemoryStream())
            {
                await stream.CopyToAsync(memoryStream);
                var category = new AppCategory
                {
                    CategoryName = categoryDto.CategoryName,
                    PhotoPath = memoryStream.ToArray()
                };
                await _dbContext.CategoryTbl.AddAsync(category);
            }

            return await _dbContext.SaveChangesAsync() > 0 ? "Successfully Saved" : "Failed to save category";
        }

        public async Task<string> DeleteCategory(int id)
        {
            if (id <= 0) return "Invalid Id";

            var category = await _dbContext.CategoryTbl.FindAsync(id);
            if (category == null) return "Category Not Found";

            _dbContext.CategoryTbl.Remove(category);
            return await _dbContext.SaveChangesAsync() > 0 ? "Category Deleted Successfully" : "Failed To Delete Category";
        }

        public async Task<string> EditCategory(int id, CategoryStoreDto categoryDto)
        {
            var category = await _dbContext.CategoryTbl.FindAsync(id);
            if (category == null) return "Category Not Found";

            using (var stream = categoryDto.Photo.OpenReadStream())
            using (var memoryStream = new MemoryStream())
            {
                await stream.CopyToAsync(memoryStream);
                category.CategoryName = categoryDto.CategoryName;
                category.PhotoPath = memoryStream.ToArray();
                _dbContext.CategoryTbl.Update(category);
            }

            return await _dbContext.SaveChangesAsync() > 0 ? "Category Edited Successfully" : "Failed To Edit Category";
        }

        public async Task<IEnumerable<CategoryGetDto>> GetAllCategory()
        {
            var result = await _dbContext.CategoryTbl.ToListAsync();
            return result.Select(category => new CategoryGetDto
            {
                Id = category.Id,
                CategoryName = category.CategoryName,
                PhotoPath = Convert.ToBase64String(category.PhotoPath)
            }) ?? Enumerable.Empty<CategoryGetDto>();
        }
    }
}
