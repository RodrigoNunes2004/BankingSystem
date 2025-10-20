# Restart the App Service to clear any cached authentication settings
$resourceGroupName = "BankingSystem-RG"
$appName = "banking-system-api"
$subscriptionId = "d7b6ced3-4a1c-40fa-9f87-d3453cd4206d"

try {
    $token = az account get-access-token --query accessToken --output tsv
    if ($token) {
        Write-Host "✅ Got access token"
        
        # Restart the App Service
        $uri = "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Web/sites/$appName/restart?api-version=2021-02-01"
        
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        Invoke-RestMethod -Uri $uri -Method POST -Headers $headers
        Write-Host "✅ App Service restarted successfully"
        Write-Host "This should clear any cached authentication settings"
    } else {
        Write-Host "❌ Could not get access token. Please restart manually in Azure Portal."
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
    Write-Host "Please restart the App Service manually:"
    Write-Host "1. Go back to the App Service overview page"
    Write-Host "2. Click the 'Restart' button in the top toolbar"
    Write-Host "3. Wait for the restart to complete"
}
