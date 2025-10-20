# Completely disable EasyAuth for Azure App Service
$resourceGroupName = "BankingSystem-RG"
$appName = "banking-system-api"
$subscriptionId = "d7b6ced3-4a1c-40fa-9f87-d3453cd4206d"

# Get access token using Azure CLI
try {
    $token = az account get-access-token --query accessToken --output tsv
    if ($token) {
        Write-Host "✅ Got access token"
        
        # Disable EasyAuth completely by setting it to null
        $uri = "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Web/sites/$appName/config/authsettings?api-version=2021-02-01"
        
        $body = @{
            properties = @{
                enabled = $false
                unauthenticatedClientAction = "AllowAnonymous"
                tokenStoreEnabled = $false
                defaultProvider = "None"
            }
        } | ConvertTo-Json -Depth 5
        
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        $response = Invoke-RestMethod -Uri $uri -Method PUT -Headers $headers -Body $body
        Write-Host "✅ EasyAuth disabled completely"
        Write-Host "Response: $($response | ConvertTo-Json -Depth 3)"
        
        # Also try to disable it using the newer authsettingsV2 API
        $uri2 = "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Web/sites/$appName/config/authsettingsV2?api-version=2022-03-01"
        
        $body2 = @{
            properties = @{
                globalValidation = @{
                    requireAuthentication = $false
                }
                platform = @{
                    enabled = $false
                }
            }
        } | ConvertTo-Json -Depth 5
        
        try {
            $response2 = Invoke-RestMethod -Uri $uri2 -Method PUT -Headers $headers -Body $body2
            Write-Host "✅ EasyAuth V2 also disabled"
        } catch {
            Write-Host "⚠️ EasyAuth V2 API not available or already disabled"
        }
        
    } else {
        Write-Host "❌ Could not get access token"
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
    Write-Host "Please disable EasyAuth manually in Azure Portal:"
    Write-Host "1. Go to your App Service in Azure Portal"
    Write-Host "2. Go to Authentication"
    Write-Host "3. Click Edit and disable authentication completely"
    Write-Host "4. Save and restart the App Service"
}
