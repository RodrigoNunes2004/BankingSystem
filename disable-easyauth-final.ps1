# Final script to completely disable EasyAuth
# This script will disable EasyAuth using Azure REST API

# Get access token
$token = az account get-access-token --query accessToken -o tsv

if (-not $token) {
    Write-Error "Failed to get access token. Please run 'az login' first."
    exit 1
}

# App Service details
$subscriptionId = "d7b6ced3-4a1c-40fa-9f87-d3453cd4206a"
$resourceGroup = "BankingSystem-RG"
$appName = "banking-system-api"

# Disable EasyAuth completely
$uri = "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.Web/sites/$appName/config/authsettingsV2?api-version=2022-03-01"

$body = @{
    properties = @{
        globalValidation = @{
            requireAuthentication = $false
            unauthenticatedClientAction = "AllowAnonymous"
        }
        identityProviders = @{
            azureActiveDirectory = @{
                enabled = $false
            }
        }
        platform = @{
            enabled = $false
        }
    }
} | ConvertTo-Json -Depth 10

Write-Host "Disabling EasyAuth completely..."
Write-Host "URI: $uri"
Write-Host "Body: $body"

try {
    $response = Invoke-RestMethod -Uri $uri -Method PUT -Body $body -ContentType "application/json" -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ EasyAuth disabled successfully!"
    Write-Host "Response: $($response | ConvertTo-Json -Depth 5)"
} catch {
    Write-Error "❌ Failed to disable EasyAuth: $($_.Exception.Message)"
    Write-Host "Response: $($_.Exception.Response)"
}

# Also try the legacy auth settings
$legacyUri = "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.Web/sites/$appName/config/authsettings?api-version=2022-03-01"

$legacyBody = @{
    properties = @{
        enabled = $false
        unauthenticatedClientAction = "AllowAnonymous"
    }
} | ConvertTo-Json -Depth 5

Write-Host "`nDisabling legacy auth settings..."
Write-Host "URI: $legacyUri"
Write-Host "Body: $legacyBody"

try {
    $legacyResponse = Invoke-RestMethod -Uri $legacyUri -Method PUT -Body $legacyBody -ContentType "application/json" -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ Legacy auth settings disabled successfully!"
    Write-Host "Response: $($legacyResponse | ConvertTo-Json -Depth 5)"
} catch {
    Write-Error "❌ Failed to disable legacy auth settings: $($_.Exception.Message)"
    Write-Host "Response: $($_.Exception.Response)"
}

Write-Host "`n🔄 Please restart the App Service manually in the Azure Portal to ensure changes take effect."
