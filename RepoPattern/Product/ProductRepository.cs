using HamroShoppingApp.DataContext;
using HamroShoppingApp.Models.Product;
using HamroShoppingApp.RepoPattern.Product.DTO;
using Microsoft.EntityFrameworkCore;

namespace HamroShoppingApp.RepoPattern.Product
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public ProductRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<string> CreateProduct(ProductStoreDto productStoreDto)
        {
            try
            {
                using (var stream = productStoreDto.Photo.OpenReadStream())
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await stream.CopyToAsync(memoryStream);
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
                            PhotoPath = memoryStream.ToArray()
                        };

                        await _dbContext.ProductTbl.AddAsync(product);

                    }
                }

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
                    using (var stream = productStoreDto.Photo.OpenReadStream())
                    {
                        using (var memoryStream = new MemoryStream())
                        {
                            await stream.CopyToAsync(memoryStream);
                            product.CategoryId = productStoreDto.CategoryId;
                            product.ProductName = productStoreDto.ProductName;
                            product.Price = productStoreDto.Price;
                            product.Discount = productStoreDto.Discount;
                            product.StockQuantity = productStoreDto.StockQuantity;
                            product.StockSold = productStoreDto.StockSold;
                            product.Description = productStoreDto.Description;
                            product.DeliveryStatus = productStoreDto.DeliveryStatus;
                            product.PhotoPath = memoryStream.ToArray();

                            _dbContext.ProductTbl.Update(product);
                        }
                    }

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

                if (result.Count() > 0)
                {
                    return result.Select(product => new ProductGetDto
                    {
                        Id = product.Id,
                        CategoryName = product.Category.CategoryName,
                        ProductName = product.ProductName,
                        Price = product.Price,
                        Discount = product.Discount,
                        StockQuantity = product.StockQuantity,
                        StockSold = product.StockSold,
                        Description = product.Description,
                        TotalProductRated = product.TotalProductRated,
                        ProductRating = product.ProductRating,
                        DeliveryStatus = product.DeliveryStatus,
                        PhotoPath = Convert.ToBase64String(product.PhotoPath),


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
                            Id = product.Id,
                            CategoryName = product.Category.CategoryName,
                            ProductName = product.ProductName,
                            Price = product.Price,
                            Discount = product.Discount,
                            StockQuantity = product.StockQuantity,
                            StockSold = product.StockSold,
                            Description = product.Description,
                            TotalProductRated = product.TotalProductRated,
                            ProductRating = product.ProductRating,
                            DeliveryStatus = product.DeliveryStatus,
                            PhotoPath = Convert.ToBase64String(product.PhotoPath)
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

                    if (product.Count() > 0)
                    {
                        var result = product.Select(product => new ProductGetDto
                        {
                            Id = product.Id,
                            CategoryName = product.Category.CategoryName,
                            ProductName = product.ProductName,
                            Price = product.Price,
                            Discount = product.Discount,
                            StockQuantity = product.StockQuantity,
                            StockSold = product.StockSold,
                            Description = product.Description,
                            TotalProductRated = product.TotalProductRated,
                            ProductRating = product.ProductRating,
                            DeliveryStatus = product.DeliveryStatus,
                            PhotoPath = Convert.ToBase64String(product.PhotoPath)
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

        public async Task<IEnumerable<ProductGetDto>> Search(string name)
        {
            try
            {
                var result = await _dbContext.ProductTbl.Include(p => p.Category)
                              .Where(p => p.ProductName.StartsWith(name))
                              .ToListAsync();

                if (result.Count() > 0)
                {
                    return result.Select(product => new ProductGetDto
                    {
                        Id = product.Id,
                        CategoryName = product.Category.CategoryName,
                        ProductName = product.ProductName,
                        Price = product.Price,
                        Discount = product.Discount,
                        StockQuantity = product.StockQuantity,
                        StockSold = product.StockSold,
                        Description = product.Description,
                        TotalProductRated = product.TotalProductRated,
                        ProductRating = product.ProductRating,
                        DeliveryStatus = product.DeliveryStatus,
                        PhotoPath = Convert.ToBase64String(product.PhotoPath)

                    });
                }
                return Enumerable.Empty<ProductGetDto>();
            }

            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching Products.", ex);
            }
        }

    }
}
