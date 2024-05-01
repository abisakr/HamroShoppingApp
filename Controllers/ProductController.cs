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
            try
            {
                var result = await _productRepository.CreateProduct(productStoreDto);

                if (result == "Successfully Saved")
                {
                    return Ok(result);
                }
                return BadRequest("Failed to save Product");
            }

            catch (Exception)
            {
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPut("editProduct/{id}")]
        public async Task<IActionResult> EditProduct(int id, [FromForm] ProductStoreDto productStoreDto)
        {
            try
            {
                var result = await _productRepository.EditProduct(id, productStoreDto);

                if (result == "Product Edited SuccessFully")
                {
                    return Ok(result);
                }
                return NotFound(result);
            }

            catch (Exception)
            {
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpDelete("deleteProduct/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var result = await _productRepository.DeleteProduct(id);

                if (result == "Product Deleted SuccessFully")
                {
                    return Ok(result);
                }
                return NotFound(result);
            }

            catch (Exception)
            {
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpGet("getAllProducts")]
        public async Task<IActionResult> GetAllProducts()
        {
            try
            {
                var result = await _productRepository.GetAllProducts();
                if (result != null && result.Any())
                {
                    return Ok(result);
                }
                else
                {
                    return NotFound();
                }
            }

            catch (Exception)
            {
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpGet("getProductById{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            try
            {
                var result = await _productRepository.GetProductById(id);
                if (result != null)
                {
                    return Ok(result);
                }
                else
                {
                    return NotFound();
                }
            }

            catch (Exception)
            {
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpGet("getProductByCategoryId{id}")]
        public async Task<IActionResult> GetProductByCategoryId(int id)
        {
            try
            {
                var result = await _productRepository.GetProductByCategoryId(id);
                if (result != null)
                {
                    return Ok(result);
                }
                return NotFound();

            }

            catch (Exception)
            {
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }
    }
}
