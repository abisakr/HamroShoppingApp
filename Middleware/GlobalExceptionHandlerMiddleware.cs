using System.Net;
using System.Text.Json;

namespace HamroShoppingApp.Middleware
{
    public class GlobalExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        public GlobalExceptionHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                var startTime = DateTime.Now;
                await _next(context);  // Try to process the request
                var endTime = DateTime.Now;
                var duration = endTime - startTime; // Calculate the time taken

                // Use string interpolation to output the result
                Console.WriteLine($"Total time taken: {duration.TotalMilliseconds} ms");
            }
            catch (Exception ex)
            {
                // If an error occurs, handle it here
                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";  // Return JSON
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;  // Set status code 500 (Internal Server Error)

            // Create an object to return as JSON
            var result = JsonSerializer.Serialize(new
            {
                StatusCode = context.Response.StatusCode,
                Message = "Something went wrong, please try again later."
            });

            // Write the JSON response
            return context.Response.WriteAsync(result);
        }
    }
}
