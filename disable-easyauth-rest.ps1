# Disable EasyAuth using Azure REST API with device authentication
$resourceGroupName = "BankingSystem-RG"
$appName = "banking-system-api"
$subscriptionId = "d7b6ced3-4a1c-40fa-9f87-d3453cd4206d"

# Try to get access token using different methods
$token = $null

# Method 1: Try Azure CLI
try {
    $token = az account get-access-token --query accessToken --output tsv 2>$null
    if ($token) {
        Write-Host "✅ Got access token via Azure CLI"
    }
} catch {
    Write-Host "⚠️ Azure CLI not available"
}

# Method 2: Try PowerShell Azure modules
if (-not $token) {
    try {
        Import-Module Az.Accounts -Force
        $context = Get-AzContext
        if ($context) {
            $token = [Microsoft.Azure.Commands.Common.Authentication.AzureSession]::Instance.AuthenticationFactory.Authenticate($context.Account, $context.Environment, $context.Tenant.Id, $null, "Never", $null, "https://management.azure.com/").AccessToken
            Write-Host "✅ Got access token via PowerShell Azure modules"
        }
    } catch {
        Write-Host "⚠️ PowerShell Azure modules not available"
    }
}

if ($token) {
    # Disable EasyAuth
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
    
    try {
        $response = Invoke-RestMethod -Uri $uri -Method PUT -Headers $headers -Body $body
        Write-Host "✅ EasyAuth disabled successfully"
        Write-Host "Response: $($response | ConvertTo-Json -Depth 3)"
    } catch {
        Write-Host "❌ Error disabling EasyAuth: $($_.Exception.Message)"
    }
} else {
    Write-Host "❌ Could not get access token. Please run this in a session with Azure CLI or PowerShell Azure modules available."
    Write-Host "Alternatively, you can disable EasyAuth manually in the Azure Portal by:"
    Write-Host "1. Going to your App Service"
    Write-Host "2. Going to Authentication"
    Write-Host "3. Disabling all authentication settings"
    Write-Host "4. Restarting the App Service"
}
