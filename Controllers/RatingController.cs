using HamroShoppingApp.RepoPattern.Rating;
using HamroShoppingApp.RepoPattern.Rating.DTO;
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


        [HttpPost("createRating")]
        public async Task<IActionResult> CreateRating([FromBody] RatingStoreDto ratingStoreDto)
        {
            try
            {
                var result = await _ratingRepository.CreateRating(ratingStoreDto);

                if (result == "Successfully Saved")
                {
                    return Ok(result);
                }
                return BadRequest("Failed to save Rating");
            }

            catch (Exception)
            {
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPut("editRating/{id}")]
        public async Task<IActionResult> EditRating(int id, [FromBody] RatingStoreDto ratingStoreDto)
        {
            try
            {
                var result = await _ratingRepository.EditRating(id, ratingStoreDto);

                if (result == "Rating Edited SuccessFully")
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

        [HttpDelete("deleteRating/{id}")]
        public async Task<IActionResult> DeleteRating(int id)
        {
            try
            {
                var result = await _ratingRepository.DeleteRating(id);

                if (result == "Rating Deleted SuccessFully")
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

        [HttpGet("getRatingsByProductId{id}")]
        public async Task<IActionResult> GetRatingsByProductId(int id)
        {
            try
            {
                var result = await _ratingRepository.GetRatingsByProductId(id);
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

        [HttpGet("getRatingByUserIdProductId{id}")]
        public async Task<IActionResult> GetProductByCategoryId(int id)
        {
            try
            {
                var result = await _ratingRepository.GetRatingByUserIdProductId(id);
                if (result != null)
                {
                    return Ok(result);
                }
                return NotFound();

            }

            catch (Exception)
            {
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }
    }
}
