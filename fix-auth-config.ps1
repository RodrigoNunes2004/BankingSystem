# Fix authentication configuration to allow all requests
$resourceGroupName = "BankingSystem-RG"
$appName = "banking-system-api"
$subscriptionId = "d7b6ced3-4a1c-40fa-9f87-d3453cd4206d"

# Try to get token using Azure CLI if available
try {
    $token = az account get-access-token --query accessToken --output tsv
    if ($token) {
        Write-Host "✅ Got access token"
        
        # Update auth settings to completely disable authentication
        $uri = "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Web/sites/$appName/config/authsettings?api-version=2021-02-01"
        
        $body = @{
            properties = @{
                enabled = $false
                unauthenticatedClientAction = "AllowAnonymous"
                tokenStoreEnabled = $false
            }
        } | ConvertTo-Json -Depth 5
        
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        $response = Invoke-RestMethod -Uri $uri -Method PUT -Headers $headers -Body $body
        Write-Host "✅ Authentication configuration updated successfully"
        Write-Host "Response: $($response | ConvertTo-Json -Depth 3)"
    } else {
        Write-Host "❌ Could not get access token. Please update manually in Azure Portal."
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
    Write-Host "Please update the authentication settings manually:"
    Write-Host "1. In the Authentication page you're currently viewing"
    Write-Host "2. Click 'Edit' at the top"
    Write-Host "3. Make sure 'Enable Authentication' is OFF"
    Write-Host "4. If there's an 'Unauthenticated requests' option, set it to 'Allow all requests'"
    Write-Host "5. Click 'Save'"
}
