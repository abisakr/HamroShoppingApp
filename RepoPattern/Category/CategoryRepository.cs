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

        public async Task<bool> CreateCategory(CategoryStoreDto categoryDto)
        {
            try
            {
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

                return await _dbContext.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating category: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteCategory(int id)
        {
            try
            {
                var category = await _dbContext.CategoryTbl.FindAsync(id);
                if (category == null) return false;

                _dbContext.CategoryTbl.Remove(category);
                return await _dbContext.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting category: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> EditCategory(int id, CategoryStoreDto categoryDto)
        {
            try
            {
                var category = await _dbContext.CategoryTbl.FindAsync(id);
                if (category == null) return false;

                using (var stream = categoryDto.Photo.OpenReadStream())
                using (var memoryStream = new MemoryStream())
                {
                    await stream.CopyToAsync(memoryStream);
                    category.CategoryName = categoryDto.CategoryName;
                    category.PhotoPath = memoryStream.ToArray();
                    _dbContext.CategoryTbl.Update(category);
                }

                return await _dbContext.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error editing category: {ex.Message}");
                return false;
            }
        }

        public async Task<IEnumerable<CategoryGetDto>> GetAllCategory()
        {
            try
            {
                var result = await _dbContext.CategoryTbl.ToListAsync();
                return result.Select(category => new CategoryGetDto
                {
                    Id = category.Id,
                    CategoryName = category.CategoryName,
                    PhotoPath = Convert.ToBase64String(category.PhotoPath)
                }) ?? Enumerable.Empty<CategoryGetDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching categories: {ex.Message}");
                return Enumerable.Empty<CategoryGetDto>();
            }
        }
    }
}
