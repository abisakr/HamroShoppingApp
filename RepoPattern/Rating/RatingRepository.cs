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

        public async Task<bool> CreateRating(RatingStoreDto ratingStoreDto, string userId)
        {
            try
            {
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
                    if (!updateResult) return false;
                }

                return result > 0;
            }
            catch (Exception ex)
            {
                // Handle the exception here (e.g., log it, return a default result, etc.)
                Console.WriteLine($"Error creating rating: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteRating(int id)
        {
            try
            {
                var rating = await _dbContext.RatingTbl.FindAsync(id);
                if (rating == null) return false;

                _dbContext.RatingTbl.Remove(rating);
                var result = await _dbContext.SaveChangesAsync();

                return result > 0;
            }
            catch (Exception ex)
            {
                // Handle the exception here
                Console.WriteLine($"Error deleting rating: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> EditRating(int id, RatingStoreDto ratingStoreDto)
        {
            try
            {
                var rating = await _dbContext.RatingTbl.FindAsync(id);
                if (rating == null) return false;

                rating.UserRating = ratingStoreDto.UserRating;
                rating.Review = ratingStoreDto.Review;
                _dbContext.RatingTbl.Update(rating);
                var result = await _dbContext.SaveChangesAsync();

                if (ratingStoreDto.UserRating > 0)
                {
                    await _averageRatingApp.UpdateTotalRating(rating.ProductId);
                }

                return result > 0;
            }
            catch (Exception ex)
            {
                // Handle the exception here
                Console.WriteLine($"Error editing rating: {ex.Message}");
                return false;
            }
        }

        public async Task<RatingGetDto> GetRatingByUserIdProductId(string userId, int productId)
        {
            try
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
            catch (Exception ex)
            {
                // Handle the exception here
                Console.WriteLine($"Error fetching rating: {ex.Message}");
                return null;
            }
        }

        public async Task<IEnumerable<RatingGetDto>> GetRatingsByProductId(int id)
        {
            try
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
            catch (Exception ex)
            {
                // Handle the exception here
                Console.WriteLine($"Error fetching ratings: {ex.Message}");
                return Enumerable.Empty<RatingGetDto>();
            }
        }
    }
}
