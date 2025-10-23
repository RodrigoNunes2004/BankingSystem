# Deploy Backend CORS Fix to Azure
Write-Host "🚀 Deploying Backend CORS Fix to Azure..." -ForegroundColor Green

# Build the project
Write-Host "📦 Building project..." -ForegroundColor Yellow
dotnet build src/BankingSystem.API/BankingSystem.API.csproj --configuration Release

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Publish the project
Write-Host "📤 Publishing project..." -ForegroundColor Yellow
dotnet publish src/BankingSystem.API/BankingSystem.API.csproj --configuration Release --output ./publish

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Publish failed!" -ForegroundColor Red
    exit 1
}

# Create ZIP file
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
Compress-Archive -Path "./publish/*" -DestinationPath "./banking-system-api-cors-fix.zip" -Force

# Deploy to Azure
Write-Host "🚀 Deploying to Azure..." -ForegroundColor Yellow
az webapp deployment source config-zip --resource-group "banking-system-rg" --name "banking-system-api-evfxbwhgaband4d7" --src "./banking-system-api-cors-fix.zip"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

# Restart the app
Write-Host "🔄 Restarting Azure App Service..." -ForegroundColor Yellow
az webapp restart --resource-group "banking-system-rg" --name "banking-system-api-evfxbwhgaband4d7"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Restart failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend CORS fix deployed successfully!" -ForegroundColor Green
Write-Host "🔗 API URL: https://banking-system-api-evfxbwhgaband4d7.australiaeast-01.azurewebsites.net/api" -ForegroundColor Cyan
Write-Host "🧪 Test CORS: Invoke-WebRequest -Uri 'https://banking-system-api-evfxbwhgaband4d7.australiaeast-01.azurewebsites.net/api/health' -Method Get" -ForegroundColor Cyan
