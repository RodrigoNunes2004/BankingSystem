# Simple approach to disable EasyAuth using Azure REST API
$resourceGroupName = "BankingSystem-RG"
$appName = "banking-system-api"
$subscriptionId = "d7b6ced3-4a1c-40fa-9f87-d3453cd4206d"

# Try to get token using Azure CLI if available
try {
    $token = az account get-access-token --query accessToken --output tsv
    if ($token) {
        Write-Host "✅ Got access token"
        
        # Disable EasyAuth
        $uri = "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Web/sites/$appName/config/authsettings?api-version=2021-02-01"
        
        $body = @{
            properties = @{
                enabled = $false
            }
        } | ConvertTo-Json -Depth 5
        
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        Invoke-RestMethod -Uri $uri -Method PUT -Headers $headers -Body $body
        Write-Host "✅ EasyAuth disabled successfully for $appName"
    } else {
        Write-Host "❌ Could not get access token. Please disable EasyAuth manually in Azure Portal."
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
    Write-Host "Please disable EasyAuth manually in Azure Portal:"
    Write-Host "1. Go to Azure Portal"
    Write-Host "2. Navigate to banking-system-api App Service"
    Write-Host "3. Go to Authentication (under Security)"
    Write-Host "4. Click Edit and toggle 'Enable Authentication' to OFF"
    Write-Host "5. Click Save"
}
