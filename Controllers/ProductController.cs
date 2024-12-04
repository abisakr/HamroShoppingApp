using HamroShoppingApp.RepoPattern.Product;
using HamroShoppingApp.RepoPattern.Product.DTO;
using Microsoft.AspNetCore.Mvc;

namespace HamroShoppingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _productRepository;

        public ProductController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        // Products on the basis of categories

        // [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost("createProduct")]
        public async Task<IActionResult> CreateProduct([FromForm] ProductStoreDto productStoreDto)
        {
            var result = await _productRepository.CreateProduct(productStoreDto);

            if (result == "Successfully Saved")
            {
                return Ok(result);
            }
            return BadRequest("Failed to save Product");
        }

        // [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPut("editProduct/{id}")]
        public async Task<IActionResult> EditProduct(int id, [FromForm] ProductStoreDto productStoreDto)
        {
            var result = await _productRepository.EditProduct(id, productStoreDto);

            if (result == "Product Edited SuccessFully")
            {
                return Ok(result);
            }
            return NotFound(result);
        }

        // [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpDelete("deleteProduct/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var result = await _productRepository.DeleteProduct(id);

            if (result == "Product Deleted SuccessFully")
            {
                return Ok(result);
            }
            return NotFound(result);
        }

        [HttpGet("getAllProducts")]
        public async Task<IActionResult> GetAllProducts()
        {
            var result = await _productRepository.GetAllProducts();
            if (result != null && result.Any())
            {
                return Ok(result);
            }
            return NotFound();
        }

        [HttpGet("getAllPopularProducts")]
        public async Task<IActionResult> GetAllPopularProducts()
        {
            var result = await _productRepository.GetAllPopularProducts();
            if (result != null && result.Any())
            {
                return Ok(result);
            }
            return NotFound();
        }

        [HttpGet("getProductById/{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var result = await _productRepository.GetProductById(id);
            if (result != null)
            {
                return Ok(result);
            }
            return NotFound();
        }

        [HttpGet("getProductByCategoryId/{categoryId}")]
        public async Task<IActionResult> GetProductByCategoryId(int categoryId)
        {
            var result = await _productRepository.GetProductByCategoryId(categoryId);
            if (result != null)
            {
                return Ok(result);
            }
            return NotFound();
        }

        [HttpGet("getAllSearchedProducts")]
        public async Task<IActionResult> Search(string name)
        {
            var result = await _productRepository.Search(name);
            if (result != null && result.Any())
            {
                return Ok(result);
            }
            return NotFound();
        }
        [HttpGet("getShortedFilteredProduct")]
        public async Task<IActionResult> GetShortedFilteredProduct(string? categoryName, string? order)
        {
            var result = await _productRepository.GetShortedFilteredProduct(categoryName, order);
            if (result != null && result.Any())
            {
                return Ok(result);
            }
            return NotFound();
        }
        //[HttpGet("category/{categoryName}")]
        //public async Task<List<Product>> GetProductsByCategoryAsync(string categoryName)
        //{
        //    return await _context.Products
        //                         .Include(p => p.Category)
        //                         .Where(p => p.Category.Name == categoryName)
        //                         .ToListAsync();
        //}
    }
}
