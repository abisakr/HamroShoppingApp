using System.Security.Claims;
using HamroShoppingApp.RepoPattern.Rating;
using HamroShoppingApp.RepoPattern.Rating.DTO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HamroShoppingApp.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "User")]
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
            if (!ModelState.IsValid)  // Check if the ModelState is valid
            {
                return BadRequest(ModelState);  // Return the validation errors if invalid
            }

            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID is null or empty");
            }

            var result = await _ratingRepository.CreateRating(ratingStoreDto, userId);

            if (result)
            {
                return Ok("Rating created successfully.");
            }
            return BadRequest("Failed to create rating.");
        }


        [HttpPut("editRating/{id}")]
        public async Task<IActionResult> EditRating(int id, [FromBody] RatingStoreDto ratingStoreDto)
        {
            if (!ModelState.IsValid)  // Check if the ModelState is valid
            {
                return BadRequest(ModelState);  // Return the validation errors if invalid
            }
            else if (id <= 0)
            {
                return BadRequest("Invalid ID.");
            }

            var result = await _ratingRepository.EditRating(id, ratingStoreDto);

            if (result)
            {
                return Ok("Rating updated successfully.");
            }
            return NotFound("Rating not found.");
        }


        [HttpDelete("deleteRating/{id}")]
        public async Task<IActionResult> DeleteRating(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid rating ID.");
            }

            var result = await _ratingRepository.DeleteRating(id);

            if (result)
            {
                return Ok("Rating deleted successfully.");
            }
            return NotFound("Rating not found.");
        }

        [AllowAnonymous]
        [HttpGet("getRatingsByProductId/{id}")]
        public async Task<IActionResult> GetRatingsByProductId(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid product ID.");
            }

            var result = await _ratingRepository.GetRatingsByProductId(id);
            if (result != null && result.Any())
            {
                return Ok(result);
            }

            return NotFound("Ratings not found for this product.");
        }


        [HttpGet("getRatingByUserIdProductId/{id}")]
        public async Task<IActionResult> GetRatingByUserIdProductId(int id)
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID is null or empty");
            }

            var result = await _ratingRepository.GetRatingByUserIdProductId(userId, id);
            if (result != null)
            {
                return Ok(result);
            }

            return NotFound("Rating not found for this user and product.");
        }
    }
}
