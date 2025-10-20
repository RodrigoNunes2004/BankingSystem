# Disable EasyAuth for Azure App Service
$resourceGroupName = "BankingSystem-RG"
$appName = "banking-system-api"
$subscriptionId = "d7b6ced3-4a1c-40fa-9f87-d3453cd4206d"

# Get access token
$token = (Get-AzAccessToken -ResourceUrl "https://management.azure.com/").Token

# Disable EasyAuth
$uri = "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Web/sites/$appName/config/authsettingsV2?api-version=2022-03-01"

$body = @{
    properties = @{
        globalValidation = @{
            requireAuthentication = $false
        }
        identityProviders = @{}
        platform = @{
            enabled = $false
        }
    }
} | ConvertTo-Json -Depth 10

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    Invoke-RestMethod -Uri $uri -Method PUT -Headers $headers -Body $body
    Write-Host "✅ EasyAuth disabled successfully for $appName"
} catch {
    Write-Host "❌ Error disabling EasyAuth: $($_.Exception.Message)"
    Write-Host "Response: $($_.Exception.Response)"
}
