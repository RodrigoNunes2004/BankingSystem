# Comprehensive EasyAuth Disable Script for Banking System API
# This script disables EasyAuth completely to resolve CORS issues

# Set your Azure subscription and resource group
$subscriptionId = "your-subscription-id"
$resourceGroupName = "banking-system-rg"
$appServiceName = "banking-system-api"

Write-Host "Starting comprehensive EasyAuth disable process..." -ForegroundColor Green

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

# Get the App Service
Write-Host "Getting App Service: $appServiceName..." -ForegroundColor Yellow
$appService = Get-AzWebApp -ResourceGroupName $resourceGroupName -Name $appServiceName

if (-not $appService) {
    Write-Host "App Service not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Current App Service configuration:" -ForegroundColor Cyan
Write-Host "  Name: $($appService.Name)"
Write-Host "  Resource Group: $($appService.ResourceGroup)"
Write-Host "  Location: $($appService.Location)"

# Disable EasyAuth completely
Write-Host "Disabling EasyAuth completely..." -ForegroundColor Yellow

# Method 1: Set EasyAuth to false
Write-Host "Setting WEBSITE_AUTH_ENABLED to false..." -ForegroundColor Yellow
Set-AzWebApp -ResourceGroupName $resourceGroupName -Name $appServiceName -AppSettings @{
    "WEBSITE_AUTH_ENABLED" = "false"
    "WEBSITE_AUTH_DISABLE_IDENTITY_FLOW" = "true"
    "WEBSITE_AUTH_OAUTH_USE_BACKCHANNEL" = "false"
}

# Method 2: Remove all EasyAuth settings
Write-Host "Removing EasyAuth configuration..." -ForegroundColor Yellow
$appService = Get-AzWebApp -ResourceGroupName $resourceGroupName -Name $appServiceName
$appService.SiteConfig.AuthSettings = @()

# Method 3: Set additional CORS-friendly settings
Write-Host "Setting CORS-friendly configuration..." -ForegroundColor Yellow
Set-AzWebApp -ResourceGroupName $resourceGroupName -Name $appServiceName -AppSettings @{
    "WEBSITE_AUTH_ENABLED" = "false"
    "WEBSITE_AUTH_DISABLE_IDENTITY_FLOW" = "true"
    "WEBSITE_AUTH_OAUTH_USE_BACKCHANNEL" = "false"
    "WEBSITE_AUTH_REQUIRE_HTTPS" = "false"
    "WEBSITE_AUTH_UNAUTHENTICATED_ACTION" = "AllowAnonymous"
    "WEBSITE_AUTH_DEFAULT_PROVIDER" = "None"
    "WEBSITE_AUTH_OPENID_ISSUER" = ""
    "WEBSITE_AUTH_CLIENT_ID" = ""
    "WEBSITE_AUTH_CLIENT_SECRET" = ""
    "WEBSITE_AUTH_CLIENT_SECRET_SETTING_NAME" = ""
    "WEBSITE_AUTH_ALLOWED_AUDIENCES" = ""
    "WEBSITE_AUTH_ALLOWED_EXTERNAL_REDIRECT_URLS" = ""
    "WEBSITE_AUTH_TOKEN_STORE" = "false"
    "WEBSITE_AUTH_REFRESH_CLAIMS_ON_REFRESH" = "false"
    "WEBSITE_AUTH_TOKEN_REFRESH_EXTENSION" = "0"
    "WEBSITE_AUTH_LOGOUT_PATH" = "/.auth/logout"
    "WEBSITE_AUTH_REQUIRE_HTTPS" = "false"
    "WEBSITE_AUTH_UNAUTHENTICATED_ACTION" = "AllowAnonymous"
    "WEBSITE_AUTH_DEFAULT_PROVIDER" = "None"
    "WEBSITE_AUTH_OPENID_ISSUER" = ""
    "WEBSITE_AUTH_CLIENT_ID" = ""
    "WEBSITE_AUTH_CLIENT_SECRET" = ""
    "WEBSITE_AUTH_CLIENT_SECRET_SETTING_NAME" = ""
    "WEBSITE_AUTH_ALLOWED_AUDIENCES" = ""
    "WEBSITE_AUTH_ALLOWED_EXTERNAL_REDIRECT_URLS" = ""
    "WEBSITE_AUTH_TOKEN_STORE" = "false"
    "WEBSITE_AUTH_REFRESH_CLAIMS_ON_REFRESH" = "false"
    "WEBSITE_AUTH_TOKEN_REFRESH_EXTENSION" = "0"
    "WEBSITE_AUTH_LOGOUT_PATH" = "/.auth/logout"
}

# Method 4: Update the App Service configuration directly
Write-Host "Updating App Service configuration..." -ForegroundColor Yellow
$appService = Get-AzWebApp -ResourceGroupName $resourceGroupName -Name $appServiceName
$appService.SiteConfig.AuthSettings = @()
$appService.SiteConfig.Cors = @{
    AllowedOrigins = @("https://banking-system-e47p-46gcnid2t-rodrigos-projects-2e367d33.vercel.app", "http://localhost:3000")
    SupportCredentials = $true
}

# Save the configuration
Write-Host "Saving App Service configuration..." -ForegroundColor Yellow
Set-AzWebApp -ResourceGroupName $resourceGroupName -Name $appServiceName -SiteConfig $appService.SiteConfig

# Method 5: Use Azure CLI to disable EasyAuth
Write-Host "Using Azure CLI to disable EasyAuth..." -ForegroundColor Yellow
az webapp auth update --name $appServiceName --resource-group $resourceGroupName --enabled false

# Method 6: Set additional headers for CORS
Write-Host "Setting additional CORS headers..." -ForegroundColor Yellow
Set-AzWebApp -ResourceGroupName $resourceGroupName -Name $appServiceName -AppSettings @{
    "WEBSITE_AUTH_ENABLED" = "false"
    "WEBSITE_AUTH_DISABLE_IDENTITY_FLOW" = "true"
    "WEBSITE_AUTH_OAUTH_USE_BACKCHANNEL" = "false"
    "WEBSITE_AUTH_REQUIRE_HTTPS" = "false"
    "WEBSITE_AUTH_UNAUTHENTICATED_ACTION" = "AllowAnonymous"
    "WEBSITE_AUTH_DEFAULT_PROVIDER" = "None"
    "WEBSITE_AUTH_OPENID_ISSUER" = ""
    "WEBSITE_AUTH_CLIENT_ID" = ""
    "WEBSITE_AUTH_CLIENT_SECRET" = ""
    "WEBSITE_AUTH_CLIENT_SECRET_SETTING_NAME" = ""
    "WEBSITE_AUTH_ALLOWED_AUDIENCES" = ""
    "WEBSITE_AUTH_ALLOWED_EXTERNAL_REDIRECT_URLS" = ""
    "WEBSITE_AUTH_TOKEN_STORE" = "false"
    "WEBSITE_AUTH_REFRESH_CLAIMS_ON_REFRESH" = "false"
    "WEBSITE_AUTH_TOKEN_REFRESH_EXTENSION" = "0"
    "WEBSITE_AUTH_LOGOUT_PATH" = "/.auth/logout"
    "WEBSITE_AUTH_REQUIRE_HTTPS" = "false"
    "WEBSITE_AUTH_UNAUTHENTICATED_ACTION" = "AllowAnonymous"
    "WEBSITE_AUTH_DEFAULT_PROVIDER" = "None"
    "WEBSITE_AUTH_OPENID_ISSUER" = ""
    "WEBSITE_AUTH_CLIENT_ID" = ""
    "WEBSITE_AUTH_CLIENT_SECRET" = ""
    "WEBSITE_AUTH_CLIENT_SECRET_SETTING_NAME" = ""
    "WEBSITE_AUTH_ALLOWED_AUDIENCES" = ""
    "WEBSITE_AUTH_ALLOWED_EXTERNAL_REDIRECT_URLS" = ""
    "WEBSITE_AUTH_TOKEN_STORE" = "false"
    "WEBSITE_AUTH_REFRESH_CLAIMS_ON_REFRESH" = "false"
    "WEBSITE_AUTH_TOKEN_REFRESH_EXTENSION" = "0"
    "WEBSITE_AUTH_LOGOUT_PATH" = "/.auth/logout"
}

# Restart the App Service
Write-Host "Restarting App Service..." -ForegroundColor Yellow
Restart-AzWebApp -ResourceGroupName $resourceGroupName -Name $appServiceName

# Wait for restart to complete
Write-Host "Waiting for App Service to restart..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verify the configuration
Write-Host "Verifying EasyAuth is disabled..." -ForegroundColor Yellow
$updatedAppService = Get-AzWebApp -ResourceGroupName $resourceGroupName -Name $appServiceName
$authSettings = $updatedAppService.SiteConfig.AuthSettings

Write-Host "Current Auth Settings:" -ForegroundColor Cyan
if ($authSettings -and $authSettings.Count -gt 0) {
    foreach ($setting in $authSettings) {
        Write-Host "  $($setting.Name): $($setting.Enabled)"
    }
} else {
    Write-Host "  No auth settings found (EasyAuth disabled)" -ForegroundColor Green
}

# Check app settings
Write-Host "Current App Settings related to Auth:" -ForegroundColor Cyan
$appSettings = $updatedAppService.SiteConfig.AppSettings
foreach ($setting in $appSettings) {
    if ($setting.Name -like "*AUTH*") {
        Write-Host "  $($setting.Name): $($setting.Value)"
    }
}

Write-Host "EasyAuth disable process completed!" -ForegroundColor Green
Write-Host "Please wait a few minutes for the changes to take effect." -ForegroundColor Yellow
Write-Host "You can test the API at: https://$appServiceName.azurewebsites.net/api/test-simple" -ForegroundColor Cyan
