using HamroShoppingApp.DataContext;
using HamroShoppingApp.Models.Product;
using HamroShoppingApp.RepoPattern.Product.DTO;
using Microsoft.EntityFrameworkCore;

namespace HamroShoppingApp.RepoPattern.Product
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public ProductRepository(ApplicationDbContext dbContext )
        {
            _dbContext = dbContext;
          
        }

        public async Task<bool> CreateProduct(ProductStoreDto productStoreDto)
        {
            try
            {
                using var stream = productStoreDto.Photo.OpenReadStream();
                using var memoryStream = new MemoryStream();
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
                return await _dbContext.SaveChangesAsync() > 0;
            }
            catch (Exception)
            {
               
                return false;
            }
        }

        public async Task<bool> EditProduct(int id, ProductStoreDto productStoreDto)
        {
            try
            {
                var product = await _dbContext.ProductTbl.FindAsync(id);
                if (product == null) return false;

                product.CategoryId = productStoreDto.CategoryId;
                product.ProductName = productStoreDto.ProductName;
                product.Price = productStoreDto.Price;
                product.Discount = productStoreDto.Discount;
                product.StockQuantity = productStoreDto.StockQuantity;
                product.StockSold = productStoreDto.StockSold;
                product.Description = productStoreDto.Description;
                product.DeliveryStatus = productStoreDto.DeliveryStatus;

                if (productStoreDto.Photo != null && productStoreDto.Photo.Length > 0)
                {
                    using var stream = productStoreDto.Photo.OpenReadStream();
                    using var memoryStream = new MemoryStream();
                    await stream.CopyToAsync(memoryStream);
                    product.PhotoPath = memoryStream.ToArray();
                }

                return await _dbContext.SaveChangesAsync() > 0;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> DeleteProduct(int id)
        {
            try
            {
                var product = await _dbContext.ProductTbl.FindAsync(id);
                if (product == null) return false;

                _dbContext.ProductTbl.Remove(product);
                return await _dbContext.SaveChangesAsync() > 0;
            }
            catch (Exception )
            {
                return false;
            }
        }

        public async Task<IEnumerable<ProductGetDto>> GetAllProducts()
        {
            try
            {
                var products = await _dbContext.ProductTbl.Include(p => p.Category).ToListAsync();
                return products.Select(product => new ProductGetDto
                {
                    Id = product.Id,
                     CategoryId = product.CategoryId,
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
            catch (Exception)
            {
                return Enumerable.Empty<ProductGetDto>();
            }
        }

        public async Task<ProductGetDto> GetProductById(int id)
        {
            try
            {
                var product = await _dbContext.ProductTbl.Include(p => p.Category)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (product == null) return null;

                return new ProductGetDto
                {
                    Id = product.Id,
                    CategoryId = product.CategoryId,
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
            catch (Exception )
            {
                return null;
            }
        }

        public async Task<IEnumerable<ProductGetDto>> GetProductByCategoryId(int id)
        {
            try
            {
                var products = await _dbContext.ProductTbl
                    .Include(p => p.Category)
                    .Where(p => p.CategoryId == id)
                    .ToListAsync();

                return products.Select(product => new ProductGetDto
                {
                    Id = product.Id,
                    CategoryId = product.CategoryId,
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
            catch (Exception )
            {
               
                return Enumerable.Empty<ProductGetDto>();
            }
        }

        public async Task<IEnumerable<ProductGetDto>> Search(string name)
        {
            try
            {
                var products = await _dbContext.ProductTbl
                    .Include(p => p.Category)
                    .Where(p => p.ProductName.StartsWith(name))
                    .ToListAsync();

                return products.Select(product => new ProductGetDto
                {
                    Id = product.Id,
                    CategoryId = product.CategoryId,
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
            catch (Exception )
            {
               
                return Enumerable.Empty<ProductGetDto>();
            }
        }

        public async Task<IEnumerable<ProductGetDto>> GetAllPopularProducts()
        {
            try
            {
                var products = await _dbContext.ProductTbl
                    .Include(p => p.Category)
                    .Where(p => p.StockSold >= 4)
                    .ToListAsync();

                return products.Select(product => new ProductGetDto
                {
                    Id = product.Id,
                    CategoryId = product.CategoryId,
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
            catch (Exception )
            {
                return Enumerable.Empty<ProductGetDto>();
            }
        }

        public async Task<IEnumerable<ProductGetDto>> GetShortedFilteredProduct(string categoryName, string order)
        {
            try
            {
                IQueryable<AppProduct> query = _dbContext.ProductTbl.Include(p => p.Category);

                if (!string.IsNullOrEmpty(categoryName))
                {
                    query = query.Where(p => p.Category.CategoryName == categoryName);
                }

                query = order switch
                {
                    "dsc" => query.OrderByDescending(p => p.Price),
                    _ => query.OrderBy(p => p.Price)
                };

                var result = await query.ToListAsync();
                return result.Select(product => new ProductGetDto
                {
                    Id = product.Id,
                    CategoryId = product.CategoryId,
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
            catch (Exception )
            {
               
                return Enumerable.Empty<ProductGetDto>();
            }
        }
    }
}
