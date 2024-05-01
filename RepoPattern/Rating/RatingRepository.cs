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
            try
            {
                var rating = new AppRating
                {
                    UserId = ratingStoreDto.UserId, //get user id from request header
                    ProductId = ratingStoreDto.ProductId,
                    UserRating = ratingStoreDto.UserRating,
                    Review = ratingStoreDto.Review
                };
                //update the individual product rating 
                await _dbContext.RatingTbl.AddAsync(rating);
                var result = await _dbContext.SaveChangesAsync();
                if (ratingStoreDto.UserRating > 0)
                    await _averageRatingApp.UpdateTotalRating(ratingStoreDto.ProductId);


                if (result > 0)
                {
                    return "Successfully Saved";
                }
                else
                {
                    return "Failed to save Rating";
                }
            }

            catch (Exception ex)
            {
                throw new Exception("An error occurred while Creating Rating.", ex);
            }

        }

        public async Task<string> DeleteRating(int id)
        {
            try
            {
                if (id > 0)
                {
                    var rating = await _dbContext.RatingTbl.FindAsync(id);
                    if (rating != null)
                    {
                        _dbContext.RatingTbl.Remove(rating);
                        var result = await _dbContext.SaveChangesAsync();
                        if (result > 0)
                        {
                            return "Rating Deleted SuccessFully";
                        }
                        return "Failed To Delete Rating";
                    }
                    return "Rating NotFound";
                }
                return "Invalid Id";
            }

            catch (Exception ex)
            {
                throw new Exception("An error occurred while Deleting Rating.", ex);
            }
        }

        public async Task<string> EditRating(int id, RatingStoreDto ratingStoreDto)
        {
            try
            {
                var rating = await _dbContext.RatingTbl.FindAsync(id);
                if (rating != null)
                {
                    rating.ProductId = rating.ProductId;
                    rating.UserId = rating.UserId;
                    rating.UserRating = ratingStoreDto.UserRating;
                    rating.Review = ratingStoreDto.Review;
                    _dbContext.RatingTbl.Update(rating);
                    var result = await _dbContext.SaveChangesAsync();
                    if (ratingStoreDto.UserRating > 0)
                        await _averageRatingApp.UpdateTotalRating(rating.ProductId);
                    if (result > 0)
                    {
                        return "Rating Edited SuccessFully";
                    }
                    return "Failed To Edit Rating";
                }
                return "Rating NotFound";

            }
            catch (Exception ex)
            {

                throw new Exception("An error occurred while Editing Rating.", ex);
            }
        }

        public async Task<RatingGetDto> GetRatingByUserIdProductId(int productId)
        {
            try
            {

                string userId = "8c23792b-3f0b-42af-97a5-ba96604bd33c";//get userId from request header
                if (userId != null)
                {
                    var result = await _dbContext.RatingTbl
                        .FirstOrDefaultAsync(p => p.UserId == userId && p.ProductId == productId);

                    if (result != null)
                    {
                        return new RatingGetDto
                        {
                            Id = result.Id,
                            UserId = result.UserId,
                            ProductId = result.ProductId,
                            UserRating = result.UserRating,
                            Review = result.Review
                        };
                    }
                    return null;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching Products.", ex);
            }
        }

        public async Task<IEnumerable<RatingGetDto>> GetRatingsByProductId(int id)
        {
            try
            {

                string userId = "8c23792b-3f0b-42af-97a5-ba96604bd33c";//get userId from request header
                if (userId != null)
                {
                    var result = await _dbContext.RatingTbl
                        .Where(p => p.ProductId == id).ToListAsync();

                    if (result.Count != 0)
                    {
                        return result.Select(rating => new RatingGetDto
                        {
                            Id = rating.Id,
                            UserId = rating.UserId,
                            ProductId = rating.ProductId,
                            UserRating = rating.UserRating,
                            Review = rating.Review
                        });
                    }
                    return null;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching Products.", ex);
            }
        }

    }
}
