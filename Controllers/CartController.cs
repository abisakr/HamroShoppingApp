using HamroShoppingApp.RepoPattern.Cart;
using HamroShoppingApp.RepoPattern.Cart.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HamroShoppingApp.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartRepository _cartRepository;

        public CartController(ICartRepository cartRepository)
        {
            _cartRepository = cartRepository;
        }

        [HttpPost("createCart")]
        public async Task<IActionResult> CreateCart([FromBody] CartStoreDto cartStoreDto)
        {
            if (cartStoreDto == null)
            {
                return BadRequest("Cart data is null");
            }
            var result = await _cartRepository.CreateCart(cartStoreDto);
            if (result)
            {
                return Ok("Added to cart successfully");
            }
            return StatusCode(500, "Failed to save cart");
        }

        [HttpPut("editCart/{id}")]
        public async Task<IActionResult> EditCart(int id, [FromBody] CartEditDto cartEditDto)
        {
            if (cartEditDto == null || id < 0)
            {
                return BadRequest("Invalid Id or Cart data is null");
            }

            var result = await _cartRepository.EditCart(id, cartEditDto);
            if (result)
            {
                return Ok("Cart updated successfully");
            }
            return StatusCode(500, "Failed to update cart");
        }

        [HttpDelete("deleteCart/{id}")]
        public async Task<IActionResult> DeleteCart(int id)
        {
            if (id <= 0) return BadRequest("Invalid Id");
            var result = await _cartRepository.DeleteCart(id);
            if (result)
            {
                return Ok("Cart deleted successfully");
            }
            return StatusCode(500, "Failed to delete cart");
        }

        [HttpGet("getAllCarts")]
        public async Task<IActionResult> GetAllCarts()
        {
            var result = await _cartRepository.GetAllCarts();
            if (result.Any())
            {
                return Ok(result);
            }
            return NotFound("No carts found");
        }

        [HttpGet("getCartsByUserId")]
        public async Task<IActionResult> GetCartsByUserId()
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID is null or empty");
            }
            var result = await _cartRepository.GetCartsByUserId(userId);
            if (result.Any())
            {
                return Ok(result);
            }
            return NotFound("No carts found for this user.");
        }

    }
}
