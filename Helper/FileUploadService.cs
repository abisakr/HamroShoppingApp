namespace HamroShoppingApp.Helper
{
    public class FileUploadService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public FileUploadService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }
        public async Task<string> UploadFile(string folderPath, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File is empty or null.");
            }

            try
            {
                if (file != null && file.Length > 0)
                {
                    folderPath += Guid.NewGuid().ToString() + "_" + file.FileName;

                    string serverFolder = Path.Combine(_webHostEnvironment.WebRootPath, folderPath);

                    await file.CopyToAsync(new FileStream(serverFolder, FileMode.Create));

                    return "/" + folderPath;
                }
                return null;
            }

            catch (Exception ex)
            {
                // Handle the exception
                throw new Exception("Error occurred while uploading file.", ex);
            }
        }


        public void DeleteFile(string filePath)
        {
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
}

