using HamroShoppingApp.RepoPattern.Category;
using HamroShoppingApp.RepoPattern.Category.DTO;
using Microsoft.AspNetCore.Mvc;

namespace HamroShoppingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryController(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }


        [HttpPost("createCategory")]
        public async Task<IActionResult> CreateCategory([FromForm] CategoryStoreDto categoryDto)
        {
            try
            {
                var result = await _categoryRepository.CreateCategory(categoryDto);

                if (result == "Successfully Saved")
                {
                    return Ok(result);
                }
                return BadRequest("Failed to save category");
            }

            catch (Exception)
            {
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPut("editCategory/{id}")]
        public async Task<IActionResult> EditCategory(int id, [FromForm] CategoryStoreDto categoryDto)
        {
            try
            {
                var result = await _categoryRepository.EditCategory(id, categoryDto);

                if (result == "Category Edited SuccessFully")
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

        [HttpDelete("deleteCategory/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                var result = await _categoryRepository.DeleteCategory(id);

                if (result == "Category Deleted SuccessFully")
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

        [HttpGet("getAllCategory")]
        public async Task<IActionResult> GetAllCategory()
        {
            try
            {
                var result = await _categoryRepository.GetAllCategory();
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
    }
}
