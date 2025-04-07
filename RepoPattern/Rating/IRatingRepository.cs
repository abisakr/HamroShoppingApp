using HamroShoppingApp.RepoPattern.Rating.DTO;

namespace HamroShoppingApp.RepoPattern.Rating
{
    public interface IRatingRepository
    {
        public Task<bool> CreateRating(RatingStoreDto ratingStoreDto ,string userId);
        public Task<bool> EditRating(int id, RatingStoreDto ratingStoreDto);
        public Task<bool> DeleteRating(int id);
        public Task<RatingGetDto> GetRatingByUserIdProductId(string userId, int productId);
        public Task<IEnumerable<RatingGetDto>> GetRatingsByProductId(int id);
    }
}
