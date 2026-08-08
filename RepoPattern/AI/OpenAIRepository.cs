using HamroShoppingApp.RepoPattern.Rating;
using OpenAI.Chat;
using System.Net.Http;
using System.Text.Json;

namespace HamroShoppingApp.RepoPattern.AI
{
    public class OpenAIRepository : IOpenAIRepository
    {
        private readonly IRatingRepository _ratingRepository;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public OpenAIRepository(IRatingRepository ratingRepository, IConfiguration configuration,  HttpClient httpClient)
        {
            _configuration = configuration;
            _httpClient = httpClient;
            _ratingRepository = ratingRepository;
        }

        public async Task<ReviewSummaryResponse> GetResponseFromOpenAIAsync(
            int productId)
        {
            try
            {
                var reviews =
                    await _ratingRepository
                        .GetRatingsByProductId(productId);

                var reviewComments = reviews?
                    .Where(x => !string.IsNullOrWhiteSpace(x.Review))
                    .Select(x => x.Review!.Trim())
                    .ToList()
                    ?? new List<string>();

                if (reviewComments.Count == 0)
                {
                    return new ReviewSummaryResponse
                    {
                        OverallSentiment = "Unknown",
                        Summary = "There are no written reviews to analyze."
                    };
                }

               

                var reviewText = string.Join(
                    "\n",
                    reviewComments.Select(
                        (comment, index) =>
                            $"{index + 1}. {comment}")
                );

                var prompt = $@"
Analyze these product reviews.

Give me:

1. SENTIMENT
Choose exactly one:
Positive
Mostly Positive
Neutral
Mostly Negative
Negative

2. SUMMARY
Give one concise overall summary of what customers
like and dislike about the product.

Do not invent information.

Return EXACTLY these two lines:

SENTIMENT: Positive
SUMMARY: Customers generally like the product.

Do not return JSON.
Do not use markdown.
Do not add anything else.

Reviews:

{reviewText}
";

              

                var requestBody = new
                {
                    contents = new[]
                    {
                new
                {
                    parts = new[]
                    {
                        new
                        {
                            text = prompt
                        }
                    }
                }
            }
                };

             
                var apiKey =
                    _configuration["Gemini:ApiKey"];

                if (string.IsNullOrWhiteSpace(apiKey))
                {
                    throw new InvalidOperationException(
                        "Gemini API key is not configured.");
                }

               

                var url =
                    "https://generativelanguage.googleapis.com/" +
                    "v1beta/models/gemini-3.5-flash:generateContent";


                _httpClient.DefaultRequestHeaders.Add(
                    "x-goog-api-key",
                    apiKey);

              

                var response =
                    await _httpClient.PostAsJsonAsync(
                        url,
                        requestBody);

               

                if (!response.IsSuccessStatusCode)
                {
                    var errorBody =
                        await response.Content
                            .ReadAsStringAsync();

                    throw new HttpRequestException(
                        $"Gemini API failed. " +
                        $"Status: {(int)response.StatusCode} " +
                        $"{response.StatusCode}. " +
                        $"Response: {errorBody}");
                }

               

                var json =
                    await response.Content
                        .ReadFromJsonAsync<JsonElement>();

               

                if (!json.TryGetProperty(
                        "candidates",
                        out var candidates))
                {
                    throw new InvalidOperationException(
                        "Gemini response does not contain candidates.");
                }

                if (candidates.GetArrayLength() == 0)
                {
                    throw new InvalidOperationException(
                        "Gemini returned no candidates.");
                }

              
                var aiText = candidates[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

                if (string.IsNullOrWhiteSpace(aiText))
                {
                    throw new InvalidOperationException(
                        "Gemini returned an empty response.");
                }

             

                var lines = aiText
                    .Split(
                        new[] { '\r', '\n' },
                        StringSplitOptions.RemoveEmptyEntries);

               

                var sentimentLine = lines
                    .FirstOrDefault(x =>
                        x.Trim()
                            .StartsWith(
                                "SENTIMENT:",
                                StringComparison.OrdinalIgnoreCase));


                var summaryLine = lines
                    .FirstOrDefault(x =>
                        x.Trim()
                            .StartsWith(
                                "SUMMARY:",
                                StringComparison.OrdinalIgnoreCase));

                if (sentimentLine == null ||
                    summaryLine == null)
                {
                    throw new InvalidOperationException(
                        $"Gemini returned unexpected format. " +
                        $"AI Response: {aiText}");
                }


                var sentiment =
                    sentimentLine
                        .Substring(
                            sentimentLine.IndexOf(":") + 1)
                        .Trim();

                var summary =
                    summaryLine
                        .Substring(
                            summaryLine.IndexOf(":") + 1)
                        .Trim();

               

                var allowedSentiments =
                    new[]
                    {
                "Positive",
                "Mostly Positive",
                "Neutral",
                "Mostly Negative",
                "Negative"
                    };

                if (!allowedSentiments.Any(
                        x => x.Equals(
                            sentiment,
                            StringComparison.OrdinalIgnoreCase)))
                {
                    sentiment = "Unknown";
                }


                if (string.IsNullOrWhiteSpace(summary))
                {
                    summary =
                        "No summary was generated.";
                }

              

                return new ReviewSummaryResponse
                {
                    OverallSentiment = sentiment,
                    Summary = summary
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}