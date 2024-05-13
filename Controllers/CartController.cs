using HamroShoppingApp.RepoPattern.Cart;
using HamroShoppingApp.RepoPattern.Cart.DTO;
using Microsoft.AspNetCore.Mvc;

namespace HamroShoppingApp.Controllers
{
    //  [Authorize(AuthenticationSchemes = "Bearer")]
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
            try
            {
                var result = await _cartRepository.CreateCart(cartStoreDto);

                if (result == "Successfully Saved")
                {
                    return Ok(result);
                }
                return BadRequest("Failed to save Cart");
            }

            catch (Exception)
            {
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPut("editCart/{id}")]
        public async Task<IActionResult> EditCart(int id, [FromBody] CartEditDto cartEditDto)
        {
            try
            {
                var result = await _cartRepository.EditCart(id, cartEditDto);

                if (result == "Cart Edited SuccessFully")
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

        [HttpDelete("deleteCart/{id}")]
        public async Task<IActionResult> DeleteCart(int id)
        {
            try
            {
                var result = await _cartRepository.DeleteCart(id);

                if (result == "Cart Deleted SuccessFully")
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

        [HttpGet("getAllCarts")]
        public async Task<IActionResult> GetAllCarts()
        {
            try
            {
                var result = await _cartRepository.GetAllCarts();
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

        [HttpGet("getCartsByUserId")]
        public async Task<IActionResult> GetCartsByUserId()
        {
            try
            {
                string userId = Request.Headers["UserId"].FirstOrDefault(); // Assuming UserId is the header name
                var result = await _cartRepository.GetCartsByUserId(userId);
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

    }
}
