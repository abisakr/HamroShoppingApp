using HamroShoppingApp.RepoPattern.Category;
using HamroShoppingApp.RepoPattern.Category.DTO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HamroShoppingApp.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
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
            if (categoryDto == null || categoryDto.Photo == null || categoryDto.Photo.Length == 0)
            {
                return BadRequest("Category data is null");
            }
            var result = await _categoryRepository.CreateCategory(categoryDto);

            if (result)
            {
                return Ok("Category Created Successfully");
            }
            return BadRequest("Failed to save category");
        }

        [HttpPut("editCategory/{id}")]
        public async Task<IActionResult> EditCategory(int id, [FromForm] CategoryStoreDto categoryDto)
        {
            if (categoryDto == null || id <= 0)
            {
                return BadRequest("Category data is null or invalid id");
            }

            var result = await _categoryRepository.EditCategory(id, categoryDto);

            if (result)
            {
                return Ok("Category Updated Successfully");
            }
            return NotFound("Category not found");
        }

        [HttpDelete("deleteCategory/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid category id");
            }
            var result = await _categoryRepository.DeleteCategory(id);

            if (result)
            {
                return Ok("Category Deleted Successfully");
            }
            return NotFound("Category not found");

        }
        [AllowAnonymous]
        [HttpGet("getAllCategory")]
        public async Task<IActionResult> GetAllCategory()
        {
            var result = await _categoryRepository.GetAllCategory();
            if (result.Any())
            {
                return Ok(result);
            }
            return NotFound("No categories found");
        }
    }
}
