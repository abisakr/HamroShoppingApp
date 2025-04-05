using HamroShoppingApp.RepoPattern.Cart;
using HamroShoppingApp.RepoPattern.Order;
using HamroShoppingApp.RepoPattern.Order.DTO;
using Microsoft.AspNetCore.Mvc;

namespace HamroShoppingApp.Controllers
{
    //[Authorize(AuthenticationSchemes = "Bearer")]
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
        [HttpPost("webHook")]
        public IActionResult HandleDialogflowWebhook([FromBody] DialogflowRequest request)
        {
            if (request?.queryResult == null)
            {
                return BadRequest(new { error = "Invalid request format" });
            }

            // Extract query text
            var queryText = request.queryResult.queryText;

            // Prepare response
            var response = new
            {
                fulfillmentText = "I'm called"
            };

            return Ok(response);
        }

        //[HttpPost("webHook")]
        //public async Task<IActionResult> HandleWebhook([FromBody] JObject request)
        //{
        //    System.IO.File.WriteAllText("webhook_log.txt", request.ToString());
        //    // Validate the incoming request
        //    if (request == null || request["queryResult"] == null)
        //    {
        //        return BadRequest(new
        //        {
        //            fulfillmentText = "Invalid request format."
        //        });
        //    }

        //    // Extract the intent name
        //    string intentName = request["queryResult"]?["intent"]?["displayName"]?.ToString();

        //    // Extract the parameter `number`
        //    string numberString = request["queryResult"]?["parameters"]?["number"]?.ToString();

        //    // Handle the "Track.OrderById" intent
        //    if (intentName == "Track.OrderById")
        //    {
        //        if (string.IsNullOrEmpty(numberString) || !int.TryParse(numberString, out int orderId))
        //        {
        //            return Ok(new
        //            {
        //                fulfillmentText = "Invalid Order ID. Please provide a valid numeric Order ID."
        //            });
        //        }

        //        // Simulate a response (Replace this with actual logic)
        //        var responseMessage = $"Your order ID {orderId} is being processed and will be delivered soon!";

        //        return Ok(new
        //        {
        //            fulfillmentText = responseMessage
        //        });
        //    }

        //    // Default response for unknown intents
        //    return Ok(new
        //    {
        //        fulfillmentText = "Sorry, I couldn't process your request."
        //    });
        //}





        public class DialogflowRequest
        {
            public QueryResult queryResult { get; set; }
        }

        public class QueryResult
        {
            public string queryText { get; set; }
            public Intent intent { get; set; }
        }

        public class Intent
        {
            public string displayName { get; set; }
        }



    }
}
