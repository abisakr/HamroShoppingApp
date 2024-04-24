using HamroShoppingApp.Models.Cart;
using HamroShoppingApp.Models.Category;
using HamroShoppingApp.Models.Order;
using HamroShoppingApp.Models.OrderDetail;
using HamroShoppingApp.Models.Product;
using HamroShoppingApp.Models.Rating;
using HamroShoppingApp.Models.User;

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
namespace HamroShoppingApp.DataContext
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }
        public DbSet<AppCart> CartTbl { get; set; }
        public DbSet<AppCategory> CategoryTbl { get; set; }
        public DbSet<AppOrder> OrderTbl { get; set; }
        public DbSet<AppOrderDetail> OrderDetailTbl { get; set; }
        public DbSet<AppProduct> ProductTbl { get; set; }
        public DbSet<AppRating> RatingTbl { get; set; }

    }
}
