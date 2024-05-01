using HamroShoppingApp.DataContext;
using HamroShoppingApp.Helper;
using HamroShoppingApp.Models.Product;
using HamroShoppingApp.RepoPattern.Product.DTO;
using Microsoft.EntityFrameworkCore;

namespace HamroShoppingApp.RepoPattern.Product
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly FileUploadService _fileUploadService;

        public ProductRepository(ApplicationDbContext dbContext, FileUploadService fileUploadService)
        {
            _dbContext = dbContext;
            _fileUploadService = fileUploadService;
        }

        public async Task<string> CreateProduct(ProductStoreDto productStoreDto)
        {
            try
            {
                var filePath = await _fileUploadService.UploadFile(productStoreDto.Photo);
                var product = new AppProduct
                {
                    CategoryId = productStoreDto.CategoryId,
                    ProductName = productStoreDto.ProductName,
                    Price = productStoreDto.Price,
                    Discount = productStoreDto.Discount,
                    StockQuantity = productStoreDto.StockQuantity,
                    StockSold = 0,
                    Description = productStoreDto.Description,
                    DeliveryStatus = productStoreDto.DeliveryStatus,
                    PhotoPath = filePath
                };

                await _dbContext.ProductTbl.AddAsync(product);
                var result = await _dbContext.SaveChangesAsync();

                if (result > 0)
                {
                    return "Successfully Saved";
                }
                else
                {
                    return "Failed to save product";
                }
            }

            catch (Exception ex)
            {
                throw new Exception("An error occurred while Creating Product.", ex);
            }
        }

        public async Task<string> DeleteProduct(int id)
        {
            try
            {
                if (id > 0)
                {
                    var product = await _dbContext.ProductTbl.FindAsync(id);
                    if (product != null)
                    {
                        _fileUploadService.DeleteFile(product.PhotoPath);
                        _dbContext.ProductTbl.Remove(product);
                        var result = await _dbContext.SaveChangesAsync();
                        if (result > 0)
                        {
                            return "Product Deleted SuccessFully";
                        }
                        return "Failed To Delete Product";
                    }
                    return "Product NotFound";
                }
                return "Invalid Id";
            }

            catch (Exception ex)
            {
                throw new Exception("An error occurred while Deleting Product.", ex);
            }
        }

        public async Task<string> EditProduct(int id, ProductStoreDto productStoreDto)
        {

            try
            {
                var product = await _dbContext.ProductTbl.FindAsync(id);
                if (product != null)
                {
                    var filePath = await _fileUploadService.UploadFile(productStoreDto.Photo);

                    product.CategoryId = productStoreDto.CategoryId;
                    product.ProductName = productStoreDto.ProductName;
                    product.Price = productStoreDto.Price;
                    product.Discount = productStoreDto.Discount;
                    product.StockQuantity = productStoreDto.StockQuantity;
                    product.StockSold = productStoreDto.StockSold;
                    product.Description = productStoreDto.Description;
                    product.DeliveryStatus = productStoreDto.DeliveryStatus;
                    product.PhotoPath = filePath;

                    _dbContext.ProductTbl.Update(product);
                    var result = await _dbContext.SaveChangesAsync();
                    if (result > 0)
                    {
                        return "Product Edited SuccessFully";
                    }
                    return "Failed To Edit Product";
                }
                return "Product NotFound";

            }

            catch (Exception ex)
            {
                throw new Exception("An error occurred while Editing Product.", ex);
            }
        }

        public async Task<IEnumerable<ProductGetDto>> GetAllProducts()
        {
            try
            {
                var result = await _dbContext.ProductTbl.Include(p => p.Category).ToListAsync();
                if (result != null)
                {
                    return result.Select(category => new ProductGetDto
                    {
                        CategoryName = category.Category.CategoryName,
                        ProductName = category.ProductName,
                        Price = category.Price,
                        Discount = category.Discount,
                        StockQuantity = category.StockQuantity,
                        StockSold = category.StockSold,
                        Description = category.Description,
                        DeliveryStatus = category.DeliveryStatus,
                        PhotoPath = category.PhotoPath
                    });
                }
                return Enumerable.Empty<ProductGetDto>();
            }

            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching Products.", ex);
            }
        }

        public async Task<ProductGetDto> GetProductById(int id)
        {
            try
            {
                if (id > 0)
                {
                    var product = await _dbContext.ProductTbl
                        .Include(p => p.Category)
                        .FirstOrDefaultAsync(p => p.Id == id);

                    if (product != null)
                    {
                        return new ProductGetDto
                        {
                            CategoryName = product.Category.CategoryName,
                            ProductName = product.ProductName,
                            Price = product.Price,
                            Discount = product.Discount,
                            StockQuantity = product.StockQuantity,
                            StockSold = product.StockSold,
                            Description = product.Description,
                            DeliveryStatus = product.DeliveryStatus,
                            PhotoPath = product.PhotoPath
                        };
                    }
                    return null;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching Products.", ex);
            }
        }

        public async Task<IEnumerable<ProductGetDto>> GetProductByCategoryId(int id)
        {
            try
            {
                if (id > 0)
                {
                    var product = await _dbContext.ProductTbl.Include(a => a.Category)
                        .Where(p => p.CategoryId == id).ToListAsync();

                    if (product != null)
                    {
                        var result = product.Select(product => new ProductGetDto
                        {
                            CategoryName = product.Category.CategoryName,
                            ProductName = product.ProductName,
                            Price = product.Price,
                            Discount = product.Discount,
                            StockQuantity = product.StockQuantity,
                            StockSold = product.StockSold,
                            Description = product.Description,
                            DeliveryStatus = product.DeliveryStatus,
                            PhotoPath = product.PhotoPath
                        });
                        return result;
                    }
                    return null;

                }
                return null;
            }

            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching Products.", ex);
            }
        }

        //get products by category id or acc to individual category     
    }
}
