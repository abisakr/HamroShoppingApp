using HamroShoppingApp.RepoPattern.Rating.DTO;

namespace HamroShoppingApp.RepoPattern.Rating
{
    public interface IRatingRepository
    {
        public Task<string> CreateRating(RatingStoreDto ratingStoreDto);
        public Task<string> EditRating(int id, RatingStoreDto ratingStoreDto);
        public Task<string> DeleteRating(int id);
        public Task<RatingGetDto> GetRatingByUserIdProductId(string userId, int productId);
        public Task<IEnumerable<RatingGetDto>> GetRatingsByProductId(int id);
    }
}
