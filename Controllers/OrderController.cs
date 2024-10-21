using HamroShoppingApp.RepoPattern.Cart;
using HamroShoppingApp.RepoPattern.Order;
using HamroShoppingApp.RepoPattern.Order.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HamroShoppingApp.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
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

        [HttpPost("createDirectOrder")]
        public async Task<IActionResult> PlaceDirectOrder([FromBody] IEnumerable<OrderPlaceDto> orderPlaceDto)
        {
            string userId = Request.Headers["UserId"].FirstOrDefault();
            var result = await _orderRepository.PlaceOrder(orderPlaceDto, userId);

            if (result == "Successfully Saved")
            {
                return Ok("Order placed");
            }
            return BadRequest("Failed to place order.");
        }

        [HttpGet("getOrdersByUserId")]
        public async Task<IActionResult> GetOrdersByUserId(HttpContext httpContext)
        {
            string userId = "8c23792b-3f0b-42af-97a5-ba96604bd33c"; // Use a dynamic way to get userId
            var result = await _orderRepository.GetOrdersByUserId(userId);
            if (result != null)
            {
                return Ok(result);
            }
            return NotFound();
        }

        [HttpGet("getAllOrder")]
        public async Task<IActionResult> GetAllOrder()
        {
            var result = await _orderRepository.GetAllOrder();
            if (result != null && result.Any())
            {
                return Ok(result);
            }
            return NotFound();
        }
    }
}
