# Deploy Backend CORS Fixes to Azure
# This script builds and deploys the updated backend with CORS fixes

Write-Host "Starting backend deployment with CORS fixes..." -ForegroundColor Green

# Set your Azure subscription and resource group
$subscriptionId = "your-subscription-id"
$resourceGroupName = "banking-system-rg"
$appServiceName = "banking-system-api"

# Login to Azure (if not already logged in)
Write-Host "Checking Azure login status..." -ForegroundColor Yellow
$context = Get-AzContext
if (-not $context) {
    Write-Host "Logging into Azure..." -ForegroundColor Yellow
    Connect-AzAccount
}

# Set the subscription
Write-Host "Setting subscription to $subscriptionId..." -ForegroundColor Yellow
Set-AzContext -SubscriptionId $subscriptionId

# Navigate to the API project directory
Write-Host "Navigating to API project directory..." -ForegroundColor Yellow
Set-Location "src\BankingSystem.API"

# Clean and build the project
Write-Host "Cleaning and building the project..." -ForegroundColor Yellow
dotnet clean
dotnet build --configuration Release

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Publish the project
Write-Host "Publishing the project..." -ForegroundColor Yellow
dotnet publish --configuration Release --output ./publish

if ($LASTEXITCODE -ne 0) {
    Write-Host "Publish failed!" -ForegroundColor Red
    exit 1
}

# Deploy to Azure App Service
Write-Host "Deploying to Azure App Service..." -ForegroundColor Yellow
$publishPath = Resolve-Path "./publish"
$zipPath = "./publish.zip"

# Create deployment package
Write-Host "Creating deployment package..." -ForegroundColor Yellow
Compress-Archive -Path "$publishPath\*" -DestinationPath $zipPath -Force

# Deploy using Azure CLI
Write-Host "Deploying using Azure CLI..." -ForegroundColor Yellow
az webapp deployment source config-zip --resource-group $resourceGroupName --name $appServiceName --src $zipPath

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}

# Clean up
Write-Host "Cleaning up..." -ForegroundColor Yellow
Remove-Item $zipPath -Force
Remove-Item "./publish" -Recurse -Force

# Restart the App Service
Write-Host "Restarting App Service..." -ForegroundColor Yellow
Restart-AzWebApp -ResourceGroupName $resourceGroupName -Name $appServiceName

# Wait for restart to complete
Write-Host "Waiting for App Service to restart..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Test the API
Write-Host "Testing the API..." -ForegroundColor Yellow
$testUrl = "https://$appServiceName.azurewebsites.net/api/test-simple"
Write-Host "Testing URL: $testUrl" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $testUrl -Method GET
    Write-Host "API Test Response: $($response | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "API Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Backend deployment completed!" -ForegroundColor Green
Write-Host "Please test the CORS functionality from your Vercel frontend." -ForegroundColor Yellow
