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

        public OrderController(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        [HttpPost("createOrder")]
        public async Task<IActionResult> PlaceOrder([FromBody] OrderPlaceDto orderPlaceDto)
        {
            try
            {
                var result = await _orderRepository.PlaceOrder(orderPlaceDto);

                if (result == "Successfully Saved")
                {
                    return Ok(result);
                }
                return BadRequest("Failed to Order");
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
