using HamroShoppingApp.RepoPattern.Order.DTO;

namespace HamroShoppingApp.RepoPattern.Order
{
    public interface IOrderRepository
    {
        public Task<bool> PlaceOrder(IEnumerable<OrderPlaceDto> orderPlaceDto, string userId);
         Task<IEnumerable<OrderGetDto>> GetOrdersByUserId(string userId);
         Task<IEnumerable<OrderGetDto>>GetAllOrder();
        Task<bool> EditOrderStatus(EditOrderStatusDto dto);
        //  public Task<string> EditOrder(int id, RatingStoreDto ratingStoreDto); give edit option for 1 min of order place (future enhancement)
        //   public Task<string> DeleteOrder(int id); give delete option for 1 min of order place (future enhancement)
        //   public Task<IEnumerable<RatingGetDto>> GetOrdersByProductId(int id); for admin pannel
    }
}
