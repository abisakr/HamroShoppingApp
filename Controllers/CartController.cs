using HamroShoppingApp.RepoPattern.Cart;
using HamroShoppingApp.RepoPattern.Cart.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
            var result = await _cartRepository.CreateCart(cartStoreDto);
            if (result == "Successfully Saved")
            {
                return Ok(result);
            }
            return BadRequest("Failed to save Cart");
        }

        [HttpPut("editCart/{id}")]
        public async Task<IActionResult> EditCart(int id, [FromBody] CartEditDto cartEditDto)
        {
            var result = await _cartRepository.EditCart(id, cartEditDto);
            if (result == "Cart Edited Successfully")
            {
                return Ok(result);
            }
            return NotFound(result);
        }

        [HttpDelete("deleteCart/{id}")]
        public async Task<IActionResult> DeleteCart(int id)
        {
            var result = await _cartRepository.DeleteCart(id);
            if (result == "Cart Deleted Successfully")
            {
                return Ok(result);
            }
            return NotFound(result);
        }

        [HttpGet("getAllCarts")]
        public async Task<IActionResult> GetAllCarts()
        {
            var result = await _cartRepository.GetAllCarts();
            if (result != null && result.Any())
            {
                return Ok(result);
            }
            return NotFound();
        }

        [HttpGet("getCartsByUserId")]
        public async Task<IActionResult> GetCartsByUserId()
        {
            string userId = Request.Headers["UserId"].FirstOrDefault();
            var result = await _cartRepository.GetCartsByUserId(userId);
            if (result != null)
            {
                return Ok(result);
            }
            return NotFound();
        }
    }
}
