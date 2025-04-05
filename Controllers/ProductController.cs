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

        [HttpPost("createProduct")]
        public async Task<IActionResult> CreateProduct([FromForm] ProductStoreDto productStoreDto)
        {
            if (productStoreDto == null || productStoreDto.Photo == null || productStoreDto.Photo.Length == 0)
            {
                return BadRequest("Product data or photo is missing.");
            }

            var result = await _productRepository.CreateProduct(productStoreDto);

            if (result)
            {
                return Ok("Product Created Successfully");
            }
            return BadRequest("Failed to create product. Please check the input.");
        }

        [HttpPut("editProduct/{id}")]
        public async Task<IActionResult> EditProduct(int id, [FromForm] ProductStoreDto productStoreDto)
        {
            if (id <= 0 || productStoreDto == null)
            {
                return BadRequest("Invalid data or product ID.");
            }

            var result = await _productRepository.EditProduct(id, productStoreDto);

            if (result)
            {
                return Ok("Product updated successfully");
            }
            return NotFound("Product not found or failed to update.");
        }

        [HttpDelete("deleteProduct/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid product ID.");
            }

            var result = await _productRepository.DeleteProduct(id);

            if (result)
            {
                return Ok("Product deleted successfully");
            }
            return NotFound("Product not found or failed to delete.");
        }

        [HttpGet("getAllProducts")]
        public async Task<IActionResult> GetAllProducts()
        {
            var result = await _productRepository.GetAllProducts();
            if (result != null && result.Any())
            {
                return Ok(result);
            }
            return NotFound("No products found.");
        }

        [HttpGet("getAllPopularProducts")]
        public async Task<IActionResult> GetAllPopularProducts()
        {
            var result = await _productRepository.GetAllPopularProducts();
            if (result != null && result.Any())
            {
                return Ok(result);
            }
            return NotFound("No popular products found.");
        }

        [HttpGet("getProductById/{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid product ID.");
            }

            var result = await _productRepository.GetProductById(id);
            if (result != null)
            {
                return Ok(result);
            }
            return NotFound("Product not found.");
        }

        [HttpGet("getProductByCategoryId/{categoryId}")]
        public async Task<IActionResult> GetProductByCategoryId(int categoryId)
        {
            if (categoryId <= 0)
            {
                return BadRequest("Invalid category ID.");
            }

            var result = await _productRepository.GetProductByCategoryId(categoryId);
            if (result != null)
            {
                return Ok(result);
            }
            return NotFound("Products not found for the given category.");
        }

        [HttpGet("getAllSearchedProducts")]
        public async Task<IActionResult> Search(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return BadRequest("Search term is required.");
            }

            var result = await _productRepository.Search(name);
            if (result != null && result.Any())
            {
                return Ok(result);
            }
            return NotFound("No products found matching the search term.");
        }

        [HttpGet("getShortedFilteredProduct")]
        public async Task<IActionResult> GetShortedFilteredProduct(string? categoryName, string? order)
        {
            var result = await _productRepository.GetShortedFilteredProduct(categoryName, order);
            if (result != null && result.Any())
            {
                return Ok(result);
            }
            return NotFound("No products found matching the filter criteria.");
        }
    }
}
