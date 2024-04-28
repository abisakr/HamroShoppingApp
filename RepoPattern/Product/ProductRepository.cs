using HamroShoppingApp.DataContext;

namespace HamroShoppingApp.RepoPattern.Product
{
    public class ProductRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public ProductRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

    }
}
