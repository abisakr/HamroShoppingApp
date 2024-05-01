namespace HamroShoppingApp.RepoPattern.Rating.DTO
{
    public class RatingStoreDto
    {
        public string UserId { get; set; }
        public int ProductId { get; set; }
        public int UserRating { get; set; }
        public string? Review { get; set; }
    }
}
