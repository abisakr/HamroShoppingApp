using HamroShoppingApp.DataContext;
using HamroShoppingApp.Helper;
using HamroShoppingApp.Models.Rating;
using HamroShoppingApp.RepoPattern.Rating.DTO;
using Microsoft.EntityFrameworkCore;

namespace HamroShoppingApp.RepoPattern.Rating
{
    public class RatingRepository : IRatingRepository
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly AverageRatingApp _averageRatingApp;

        public RatingRepository(ApplicationDbContext dbContext, AverageRatingApp averageRatingApp)
        {
            _dbContext = dbContext;
            _averageRatingApp = averageRatingApp;
        }

        public async Task<string> CreateRating(RatingStoreDto ratingStoreDto)
        {
            string userId = "19f08c05-9760-402c-9ea6-775ce55afd72"; // Get user ID from request header
            var rating = new AppRating
            {
                UserId = userId,
                ProductId = ratingStoreDto.ProductId,
                UserRating = ratingStoreDto.UserRating,
                Review = ratingStoreDto.Review
            };

            await _dbContext.RatingTbl.AddAsync(rating);
            var result = await _dbContext.SaveChangesAsync();

            if (ratingStoreDto.UserRating > 0)
            {
                bool updateResult = await _averageRatingApp.UpdateTotalRating(ratingStoreDto.ProductId);
                if (!updateResult) return "Failed to update average rating";
            }

            return result > 0 ? "Successfully Saved" : "Failed to save Rating";
        }

        public async Task<string> DeleteRating(int id)
        {
            if (id <= 0) return "Invalid Id";

            var rating = await _dbContext.RatingTbl.FindAsync(id);
            if (rating == null) return "Rating NotFound";

            _dbContext.RatingTbl.Remove(rating);
            var result = await _dbContext.SaveChangesAsync();

            return result > 0 ? "Rating Deleted Successfully" : "Failed To Delete Rating";
        }

        public async Task<string> EditRating(int id, RatingStoreDto ratingStoreDto)
        {
            var rating = await _dbContext.RatingTbl.FindAsync(id);
            if (rating == null) return "Rating NotFound";

            rating.UserRating = ratingStoreDto.UserRating;
            rating.Review = ratingStoreDto.Review;
            _dbContext.RatingTbl.Update(rating);
            var result = await _dbContext.SaveChangesAsync();

            if (ratingStoreDto.UserRating > 0)
            {
                await _averageRatingApp.UpdateTotalRating(rating.ProductId);
            }

            return result > 0 ? "Rating Edited Successfully" : "Failed To Edit Rating";
        }

        public async Task<RatingGetDto> GetRatingByUserIdProductId(string userId, int productId)
        {
            var result = await _dbContext.RatingTbl
                .FirstOrDefaultAsync(p => p.UserId == userId && p.ProductId == productId);

            return result != null ? new RatingGetDto
            {
                Id = result.Id,
                UserId = result.UserId,
                ProductId = result.ProductId,
                UserRating = result.UserRating,
                Review = result.Review
            } : null;
        }

        public async Task<IEnumerable<RatingGetDto>> GetRatingsByProductId(int id)
        {
            var ratings = await _dbContext.RatingTbl
                .Where(p => p.ProductId == id)
                .ToListAsync();

            return ratings.Count > 0
                ? ratings.Select(rating => new RatingGetDto
                {
                    Id = rating.Id,
                    UserId = rating.UserId,
                    ProductId = rating.ProductId,
                    UserRating = rating.UserRating,
                    Review = rating.Review
                })
                : Enumerable.Empty<RatingGetDto>();
        }
    }
}
