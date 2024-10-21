using HamroShoppingApp.RepoPattern.Rating;
using HamroShoppingApp.RepoPattern.Rating.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HamroShoppingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RatingController : ControllerBase
    {
        private readonly IRatingRepository _ratingRepository;

        public RatingController(IRatingRepository ratingRepository)
        {
            _ratingRepository = ratingRepository;
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost("createRating")]
        public async Task<IActionResult> CreateRating([FromBody] RatingStoreDto ratingStoreDto)
        {
            var result = await _ratingRepository.CreateRating(ratingStoreDto);

            if (result == "Successfully Saved")
            {
                return Ok(result);
            }
            return BadRequest("Failed to save Rating");
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPut("editRating/{id}")]
        public async Task<IActionResult> EditRating(int id, [FromBody] RatingStoreDto ratingStoreDto)
        {
            var result = await _ratingRepository.EditRating(id, ratingStoreDto);

            if (result == "Rating Edited SuccessFully")
            {
                return Ok(result);
            }
            return NotFound(result);
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpDelete("deleteRating/{id}")]
        public async Task<IActionResult> DeleteRating(int id)
        {
            var result = await _ratingRepository.DeleteRating(id);

            if (result == "Rating Deleted SuccessFully")
            {
                return Ok(result);
            }
            return NotFound(result);
        }

        [HttpGet("getRatingsByProductId{id}")]
        public async Task<IActionResult> GetRatingsByProductId(int id)
        {
            var result = await _ratingRepository.GetRatingsByProductId(id);
            if (result != null)
            {
                return Ok(result);
            }
            return NotFound();
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("getRatingByUserIdProductId{id}")]
        public async Task<IActionResult> GetRatingByUserIdProductId(HttpContext httpContext, int id)
        {
            string userId = "8c23792b-3f0b-42af-97a5-ba96604bd33c"; // Get userId from request header
            var result = await _ratingRepository.GetRatingByUserIdProductId(userId, id);
            if (result != null)
            {
                return Ok(result);
            }
            return NotFound();
        }
    }
}
