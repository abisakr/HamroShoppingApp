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
            try
            {

                if (categoryDto.Photo == null || categoryDto.Photo.Length == 0)
                {
                    return "No image file uploaded";
                }

                using (var stream = categoryDto.Photo.OpenReadStream())
                {
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
                }



                var result = await _dbContext.SaveChangesAsync();

                if (result > 0)
                {
                    return "Successfully Saved";
                }
                else
                {
                    return "Failed to save category";
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating categories.", ex);
            }
        }

        public async Task<string> DeleteCategory(int id)
        {
            try
            {
                if (id > 0)
                {
                    var category = await _dbContext.CategoryTbl.FindAsync(id);
                    if (category != null)
                    {
                        _dbContext.CategoryTbl.Remove(category);
                        var result = await _dbContext.SaveChangesAsync();
                        if (result > 0)
                        {
                            return "Category Deleted SuccessFully";
                        }
                        return "Failed To Delete Category";
                    }
                    return "Category NotFound";
                }
                return "Invalid Id";
            }

            catch (Exception ex)
            {
                throw new Exception("An error occurred while Deleting categories.", ex);
            }
        }

        public async Task<string> EditCategory(int id, CategoryStoreDto categoryDto)
        {

            try
            {
                var catetgory = await _dbContext.CategoryTbl.FindAsync(id);
                if (catetgory != null)
                {
                    using (var stream = categoryDto.Photo.OpenReadStream())
                    {
                        using (var memoryStream = new MemoryStream())
                        {
                            await stream.CopyToAsync(memoryStream);
                            catetgory.CategoryName = categoryDto.CategoryName;
                            catetgory.PhotoPath = memoryStream.ToArray();
                            _dbContext.CategoryTbl.Update(catetgory);
                        }
                    }

                    var result = await _dbContext.SaveChangesAsync();
                    if (result > 0)
                    {
                        return "Category Edited SuccessFully";
                    }
                    return "Failed To Edit Category";
                }
                return "Category NotFound";

            }
            catch (Exception ex)
            {

                throw new Exception("An error occurred while Editing categories.", ex);
            }
        }

        public async Task<IEnumerable<CategoryGetDto>> GetAllCategory()
        {
            try
            {
                var result = await _dbContext.CategoryTbl.ToListAsync();
                if (result != null)
                {
                    return result.Select(category => new CategoryGetDto
                    {
                        Id = category.Id,
                        CategoryName = category.CategoryName,
                        PhotoPath = Convert.ToBase64String(category.PhotoPath)
                    });
                }
                return Enumerable.Empty<CategoryGetDto>();
            }

            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching categories.", ex);
            }
        }
    }
}
