# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY BankingSystem.sln ./
COPY src/BankingSystem.Domain/ ./src/BankingSystem.Domain/
COPY src/BankingSystem.application/ ./src/BankingSystem.application/
COPY src/BankingSystem.Infrastructure/ ./src/BankingSystem.Infrastructure/
COPY src/BankingSystem.API/ ./src/BankingSystem.API/

RUN dotnet restore BankingSystem.sln
RUN dotnet publish src/BankingSystem.API/BankingSystem.API.csproj -c Release -o /app/publish --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

# Render sets PORT; default to 10000
ENV PORT=10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "BankingSystem.API.dll"]
