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
            using (var stream = productStoreDto.Photo.OpenReadStream())
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
                return await _dbContext.SaveChangesAsync() > 0 ? "Successfully Saved" : "Failed to save product";
            }
        }

        public async Task<string> DeleteProduct(int id)
        {
            if (id <= 0) return "Invalid Id";

            var product = await _dbContext.ProductTbl.FindAsync(id);
            if (product == null) return "Product NotFound";

            _dbContext.ProductTbl.Remove(product);
            return await _dbContext.SaveChangesAsync() > 0 ? "Product Deleted Successfully" : "Failed To Delete Product";
        }

        public async Task<string> EditProduct(int id, ProductStoreDto productStoreDto)
        {
            var product = await _dbContext.ProductTbl.FindAsync(id);
            if (product == null) return "Product NotFound";

            using (var stream = productStoreDto.Photo.OpenReadStream())
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

            return await _dbContext.SaveChangesAsync() > 0 ? "Product Edited Successfully" : "Failed To Edit Product";
        }

        public async Task<IEnumerable<ProductGetDto>> GetAllProducts()
        {
            var result = await _dbContext.ProductTbl.Include(p => p.Category).ToListAsync();
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
            }) ?? Enumerable.Empty<ProductGetDto>();
        }

        public async Task<ProductGetDto> GetProductById(int id)
        {
            if (id <= 0) return null;

            var product = await _dbContext.ProductTbl
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            return product == null ? null : new ProductGetDto
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

        public async Task<IEnumerable<ProductGetDto>> GetProductByCategoryId(int id)
        {
            if (id <= 0) return null;

            var products = await _dbContext.ProductTbl.Include(a => a.Category)
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
            }) ?? null;
        }

        public async Task<IEnumerable<ProductGetDto>> Search(string name)
        {
            var result = await _dbContext.ProductTbl.Include(p => p.Category)
                .Where(p => p.ProductName.StartsWith(name))
                .ToListAsync();

            return result.Select(product => new ProductGetDto
            {
                Id = product.Id,
                CategoryName = product.Category.CategoryName,
                CategoryId = product.CategoryId,
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
            }) ?? Enumerable.Empty<ProductGetDto>();
        }

        public async Task<IEnumerable<ProductGetDto>> GetAllPopularProducts()
        {
            var products = await _dbContext.ProductTbl.Include(a => a.Category)
                .Where(a => a.StockSold >= 4)
                .ToListAsync();

            return products.Select(product => new ProductGetDto
            {
                Id = product.Id,
                CategoryName = product.Category.CategoryName,
                CategoryId = product.CategoryId,
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
            }) ?? null;
        }

        public async Task<IEnumerable<ProductGetDto>> GetShortedFilteredProduct(string categoryName, string order)
        {
            //pages ko category product ma xa 
            IQueryable<AppProduct> query = _dbContext.ProductTbl.Include(a => a.Category);

            if (!string.IsNullOrEmpty(categoryName))
            {
                query = query.Where(a => a.Category.CategoryName == categoryName);
            }
            if (string.IsNullOrEmpty(order) || order == "asc")
            {
                query = query.OrderBy(a => a.Price);
            }
            else if (order == "dsc")
            {
                query = query.OrderByDescending(a => a.Price); // Descending order
            }
            else
            {
                query = query.OrderBy(a => a.Price); // Default to ascending order for invalid input
            }


            var result = await query.ToListAsync();
            return result.Select(product => new ProductGetDto
            {
                Id = product.Id,
                CategoryName = product.Category.CategoryName,
                CategoryId = product.CategoryId,
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
            }) ?? Enumerable.Empty<ProductGetDto>();
        }
    }
}
