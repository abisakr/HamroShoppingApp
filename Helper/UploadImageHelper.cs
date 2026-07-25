using Microsoft.AspNetCore.Mvc;

namespace HamroShoppingApp.Helper
{
    public class UploadImageHelper
    {
        private readonly IWebHostEnvironment _environment;
        public UploadImageHelper(IWebHostEnvironment environment)
        {
            _environment = environment;
        }
        public async Task<string> UploadImageAsync(IFormFile file, string folderName)
        {
         
            folderName = Path.GetFileName(folderName); // Sanitize

            var uploadsFolder = Path.Combine(_environment.WebRootPath, "images", folderName);

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                string relativePath = $"/images/{folderName}/{uniqueFileName}";
                return relativePath;
            }
            catch (Exception ex)
            {
                return ("An error occurred while saving the file: " + ex.Message);
            }
        }


        public async Task<string?> ReplaceImageAsync(string folderName, string fileName, IFormFile newFile)
        {

            // Sanitize inputs
            folderName = Path.GetFileName(folderName);
            fileName = Path.GetFileName(fileName);

            var uploadsFolder = Path.Combine(_environment.WebRootPath, "images", folderName);
            var existingFilePath = Path.Combine(uploadsFolder, fileName);

            if (!File.Exists(existingFilePath))
                return null;

            try
            {
                // Delete the existing file
                File.Delete(existingFilePath);

                // Save the new file with the same name
                using (var stream = new FileStream(existingFilePath, FileMode.Create))
                {
                    await newFile.CopyToAsync(stream);
                }

                var relativePath = $"/images/{folderName}/{fileName}";
                return (relativePath);
            }
            catch (Exception ex)
            {
                return ( $"Error replacing image: {ex.Message}");
            }
        }

    }



}
