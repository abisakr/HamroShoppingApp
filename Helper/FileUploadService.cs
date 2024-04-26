namespace HamroShoppingApp.Helper
{
    public class FileUploadService
    {

        private readonly IWebHostEnvironment _webHostEnvironment;

        public FileUploadService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<string> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File is empty or null.");
            }

            try
            {
                // Generate a unique file name
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", fileName);

                // Save the file to the server
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Return the file path
                return Path.Combine("uploads", fileName);
            }
            catch (Exception ex)
            {
                // Handle the exception
                throw new Exception("Error occurred while uploading file.", ex);
            }
        }
        public void DeleteFile(string filePath)
        {
            string fullPath = Path.Combine(_webHostEnvironment.WebRootPath, filePath);
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
        }
    }
}

