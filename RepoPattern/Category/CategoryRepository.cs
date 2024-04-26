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
        private readonly FileUploadService _fileUploadService;

        public CategoryRepository(ApplicationDbContext dbContext, FileUploadService fileUploadService)
        {
            _dbContext = dbContext;
            _fileUploadService = fileUploadService;
        }

        public async Task<string> CreateCategory(CategoryStoreDto categoryDto)
        {
            try
            {
                var filePath = await _fileUploadService.UploadFile(categoryDto.Photo);
                var category = new AppCategory
                {
                    CategoryName = categoryDto.CategoryName,
                    PhotoPath = filePath
                };

                await _dbContext.CategoryTbl.AddAsync(category);
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
                throw new Exception("An error occurred while Creating categories.", ex);
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
                        _fileUploadService.DeleteFile(category.PhotoPath);
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
                    var filePath = await _fileUploadService.UploadFile(categoryDto.Photo);

                    catetgory.CategoryName = categoryDto.CategoryName;
                    catetgory.PhotoPath = filePath;
                    _dbContext.CategoryTbl.Update(catetgory);
                    var result = await _dbContext.SaveChangesAsync();
                    if (result > 0)
                    {
                        return "Category Edited SuccessFully";
                    }
                    return "Failed To Edited Category";
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
                        CategoryName = category.CategoryName,
                        PhotoPath = category.PhotoPath
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
