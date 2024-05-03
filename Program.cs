using HamroShoppingApp.DataContext;
using HamroShoppingApp.Helper;
using HamroShoppingApp.Models.User;
using HamroShoppingApp.RepoPattern.Cart;
using HamroShoppingApp.RepoPattern.Category;
using HamroShoppingApp.RepoPattern.Order;
using HamroShoppingApp.RepoPattern.Product;
using HamroShoppingApp.RepoPattern.Rating;
using HamroShoppingApp.RepoPattern.User;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.Configure<IdentityOptions>(options =>
{
    // Password settings.
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 4;
    options.Password.RequiredUniqueChars = 0;
});
// Register Services to for JWT token
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(o =>
{
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = false,
        ValidateIssuerSigningKey = true
    };
});
builder.Services.AddAuthorization();
// Add configuration from appsettings.json
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();
// Register services for dependency injection
builder.Services.AddScoped<TokenGenerator>(); // Service for generating tokens
builder.Services.AddScoped<FileUploadService>(); // Service for handling file uploads
builder.Services.AddScoped<AverageRatingApp>(); // Service for calculating average ratings
builder.Services.AddScoped<IUserAccountRepository, UserAccountRepository>(); // Repository for user account management
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>(); // Repository for category management
builder.Services.AddScoped<IProductRepository, ProductRepository>(); // Repository for product management
builder.Services.AddScoped<ICartRepository, CartRepository>(); // Repository for cart management
builder.Services.AddScoped<IRatingRepository, RatingRepository>(); // Repository for rating management
builder.Services.AddScoped<IOrderRepository, OrderRepository>(); // Repository for order management

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//for database connection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
//for managing identity with dbcontext
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
       .AddEntityFrameworkStores<ApplicationDbContext>()
       .AddDefaultTokenProviders();

builder.Services.AddCors(options =>  // CORS configuration
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");  // Enable CORS with the specified policy

//for storing the files or photos
app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions()
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
    RequestPath = new PathString("/Resources")
});

app.UseAuthentication();
app.UseAuthorization();
IConfiguration configuration = app.Configuration;
IWebHostEnvironment environment = app.Environment;
app.MapControllers();


app.Run();
