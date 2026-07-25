using HamroShoppingApp.DataContext;
using HamroShoppingApp.Helper;
using HamroShoppingApp.Models.Category;
using HamroShoppingApp.RepoPattern.Category.DTO;
using Microsoft.EntityFrameworkCore;

namespace HamroShoppingApp.RepoPattern.Category
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UploadImageHelper _uploadImage;

        public CategoryRepository(ApplicationDbContext dbContext, UploadImageHelper uploadImage)
        {
            _dbContext = dbContext;
            _uploadImage = uploadImage;
        }

        public async Task<bool> CreateCategory(CategoryStoreDto categoryDto)
        {
            try
            {
                var photopath = await _uploadImage.UploadImageAsync(categoryDto.Photo, "category");
                var category = new AppCategory
                {
                    CategoryName = categoryDto.CategoryName,
                    PhotoPath = photopath
                };
                await _dbContext.CategoryTbl.AddAsync(category);

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

                if (categoryDto.Photo != null)
                {
                    var photopath = await _uploadImage.UploadImageAsync(categoryDto.Photo, "category");
                    category.PhotoPath = photopath;
                }
                category.CategoryName = categoryDto.CategoryName;
                _dbContext.CategoryTbl.Update(category);

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
                    PhotoPath = category.PhotoPath
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