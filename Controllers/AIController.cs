using HamroShoppingApp.RepoPattern.AI;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HamroShoppingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIController : ControllerBase
    {
        private readonly IOpenAIRepository _openAIRepository;

        public AIController(IOpenAIRepository openAIRepository)
        {
            _openAIRepository = openAIRepository;
        }

        [HttpPost("aiReviewSummary")]
        public async Task<IActionResult> Get([FromBody] int productId)
        {
            var result = await _openAIRepository.GetResponseFromOpenAIAsync(productId);
            return Ok(result);
        }
    }
}