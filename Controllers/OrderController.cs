using System.Security.Claims;
using HamroShoppingApp.RepoPattern.Cart;
using HamroShoppingApp.RepoPattern.Order;
using HamroShoppingApp.RepoPattern.Order.DTO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HamroShoppingApp.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "User")]
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
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("Invalid user ID.");
            }
            else if (orderPlaceDto == null || !orderPlaceDto.Any())
            {
                return BadRequest("Order details are required.");
            }
            var result = await _orderRepository.PlaceOrder(orderPlaceDto, userId);

            if (result)
            {
                var deleteResult = await _cartRepository.DeleteCartByUserId(userId);
                if (deleteResult)
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
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("Invalid user ID.");
            }
            else if (orderPlaceDto == null || !orderPlaceDto.Any())
            {
                return BadRequest("Order details are required.");
            }
            var result = await _orderRepository.PlaceOrder(orderPlaceDto, userId);

            if (result)
            {
                return Ok("Order placed");
            }
            return BadRequest("Failed to place order.");
        }

        [HttpGet("getOrdersByUserId")]
        public async Task<IActionResult> GetOrdersByUserId()
        {
           
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("Invalid user ID.");
            }
            var result = await _orderRepository.GetOrdersByUserId(userId);
            if (result != null)
            {
                return Ok(result);
            }
            return NotFound("No orders found for this user.");
        }

        [HttpGet("getAllOrder")]
        public async Task<IActionResult> GetAllOrder()
        {
            var result = await _orderRepository.GetAllOrder();
            if (result.Any())
            {
                return Ok(result);
            }
            return NotFound("No orders found.");
        }
    }
}
