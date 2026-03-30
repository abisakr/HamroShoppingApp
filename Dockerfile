# ---------- Stage 1: Build ----------
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copy csproj first for caching
COPY *.csproj ./
RUN dotnet restore

# Copy everything
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# ---------- Stage 2: Runtime + optional SDK ----------
# Use SDK image (runtime + SDK)
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS runtime
WORKDIR /app

# Copy published output
COPY --from=build /app/publish .

# Expose port
EXPOSE 8080

# Set environment (optional)
ENV DOTNET_RUNNING_IN_CONTAINER=true

# Run app
ENTRYPOINT ["dotnet", "HamroShoppingApp.dll"]