# Local Azure CLI Deployment Script
# Run this script after ensuring Azure CLI is available in your PATH

Write-Host "Starting Azure deployment from local machine..." -ForegroundColor Green

# Set your Azure subscription and resource group
$subscriptionId = "your-subscription-id"  # Replace with your actual subscription ID
$resourceGroupName = "banking-system-rg"  # Replace with your actual resource group name
$appServiceName = "banking-system-api"    # Replace with your actual app service name

# Login to Azure (if not already logged in)
Write-Host "Checking Azure login status..." -ForegroundColor Yellow
try {
    $context = az account show --query "id" -o tsv 2>$null
    if (-not $context) {
        Write-Host "Logging into Azure..." -ForegroundColor Yellow
        az login
    } else {
        Write-Host "Already logged into Azure. Subscription: $context" -ForegroundColor Green
    }
} catch {
    Write-Host "Error checking Azure login. Please run 'az login' manually first." -ForegroundColor Red
    exit 1
}

# Set the subscription
Write-Host "Setting subscription to $subscriptionId..." -ForegroundColor Yellow
az account set --subscription $subscriptionId

# Navigate to the API project directory
Write-Host "Navigating to API project directory..." -ForegroundColor Yellow
Set-Location "src\BankingSystem.API"

# Clean and build the project
Write-Host "Cleaning and building the project..." -ForegroundColor Yellow
dotnet clean
dotnet restore
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

# Create deployment package
Write-Host "Creating deployment package..." -ForegroundColor Yellow
$publishPath = Resolve-Path "./publish"
$zipPath = "./deployment.zip"

# Remove existing zip if it exists
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Compress-Archive -Path "$publishPath\*" -DestinationPath $zipPath -Force

# Deploy to Azure App Service
Write-Host "Deploying to Azure App Service..." -ForegroundColor Yellow
az webapp deployment source config-zip --resource-group $resourceGroupName --name $appServiceName --src $zipPath

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}

# Restart the App Service
Write-Host "Restarting App Service..." -ForegroundColor Yellow
az webapp restart --resource-group $resourceGroupName --name $appServiceName

# Wait for restart to complete
Write-Host "Waiting for App Service to restart..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Disable EasyAuth to fix CORS issues
Write-Host "Disabling EasyAuth to fix CORS issues..." -ForegroundColor Yellow
az webapp auth update --name $appServiceName --resource-group $resourceGroupName --enabled false

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

# Clean up
Write-Host "Cleaning up..." -ForegroundColor Yellow
Remove-Item $zipPath -Force
Remove-Item "./publish" -Recurse -Force

Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "Please test the CORS functionality from your Vercel frontend." -ForegroundColor Yellow
Write-Host "Frontend URL: https://banking-system-e47p-46gcnid2t-rodrigos-projects-2e367d33.vercel.app" -ForegroundColor Cyan
