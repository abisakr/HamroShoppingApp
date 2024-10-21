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
            var result = await _categoryRepository.CreateCategory(categoryDto);

            if (result == "Successfully Saved")
            {
                return Ok(result);
            }
            return BadRequest("Failed to save category");
        }

        [HttpPut("editCategory/{id}")]
        public async Task<IActionResult> EditCategory(int id, [FromForm] CategoryStoreDto categoryDto)
        {
            var result = await _categoryRepository.EditCategory(id, categoryDto);

            if (result == "Category Edited Successfully")
            {
                return Ok(result);
            }
            return NotFound(result);
        }

        [HttpDelete("deleteCategory/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var result = await _categoryRepository.DeleteCategory(id);

            if (result == "Category Deleted Successfully")
            {
                return Ok(result);
            }
            return NotFound(result);
        }

        [HttpGet("getAllCategory")]
        public async Task<IActionResult> GetAllCategory()
        {
            var result = await _categoryRepository.GetAllCategory();
            if (result != null && result.Any())
            {
                return Ok(result);
            }
            return NotFound();
        }
    }
}
