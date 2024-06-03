using HamroShoppingApp.RepoPattern.Cart;
using HamroShoppingApp.RepoPattern.Order;
using HamroShoppingApp.RepoPattern.Order.DTO;
using Microsoft.AspNetCore.Mvc;

namespace HamroShoppingApp.Controllers
{
    // [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICartRepository _cartRepository;

        public OrderController(IOrderRepository orderRepository, ICartRepository cartRepository)
        {
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
        }

        [HttpPost("createCartOrder")]
        public async Task<IActionResult> PlaceCartOrder([FromBody] IEnumerable<OrderPlaceDto> orderPlaceDto)
        {
            try
            {
                string userId = Request.Headers["UserId"].FirstOrDefault();
                var result = await _orderRepository.PlaceOrder(orderPlaceDto, userId);

                if (result == "Successfully Saved")
                {
                    var deleteResult = await _cartRepository.DeleteCartByUserId(userId);
                    if (deleteResult == "Cart deleted successfully.")
                    {
                        return Ok(result);
                    }
                    else
                    {
                        return Ok($"Order placed but failed to clear cart: {deleteResult}");
                    }
                }
                return BadRequest("Failed to place order.");
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }
        [HttpPost("createDirectOrder")]
        public async Task<IActionResult> PlaceDirectOrder([FromBody] IEnumerable<OrderPlaceDto> orderPlaceDto)
        {
            try
            {
                string userId = Request.Headers["UserId"].FirstOrDefault();
                var result = await _orderRepository.PlaceOrder(orderPlaceDto, userId);

                if (result == "Successfully Saved")
                {

                    return Ok("Order placed");
                }
                return BadRequest("Failed to place order.");
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpGet("getOrdersByUserId")]
        public async Task<IActionResult> GetOrdersByUserId(HttpContext httpContext)
        {
            try
            {
                string userId = "8c23792b-3f0b-42af-97a5-ba96604bd33c";
                //string userId = httpContext.Request.Headers["UserId"].FirstOrDefault(); // Assuming UserId is the header name
                var result = await _orderRepository.GetOrdersByUserId(userId);
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
