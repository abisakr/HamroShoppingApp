using HamroShoppingApp.DataContext;
using Microsoft.EntityFrameworkCore;

namespace HamroShoppingApp.Helper
{
    public class AverageRatingApp
    {
        private readonly ApplicationDbContext _dbContext;

        public AverageRatingApp(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<bool> UpdateTotalRating(int productId)
        {
            var reviews = await _dbContext.RatingTbl
                .Where(a => a.ProductId == productId).Select(a => a.UserRating)
                .ToListAsync();

            if (reviews.Any())
            {
                var averageRating = reviews.Average();
                var product = await _dbContext.ProductTbl.FindAsync(productId);

                if (product != null)
                {
                    product.ProductRating = averageRating * 2;
                    product.TotalProductRated = reviews.Count() + 1;
                    var result = await _dbContext.SaveChangesAsync();
                    if (result > 0)
                    {
                        return true;

                    }
                    else
                        return false;
                }
            }
            return false;

        }
    }
}
