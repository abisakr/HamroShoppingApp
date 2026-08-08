namespace HamroShoppingApp.RepoPattern.AI
{
    public interface IOpenAIRepository
    {
        Task<ReviewSummaryResponse> GetResponseFromOpenAIAsync(int productId);
    }
}