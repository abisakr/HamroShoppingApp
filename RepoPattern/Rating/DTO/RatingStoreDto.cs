using System.ComponentModel.DataAnnotations;

namespace HamroShoppingApp.RepoPattern.Rating.DTO
{
    public class RatingStoreDto
    {
        [Required (ErrorMessage = "Product ID is required.")]
        public int ProductId { get; set; }
        [Range(1, 5)]
        public int UserRating { get; set; }
        public string? Review { get; set; }
    }
}
