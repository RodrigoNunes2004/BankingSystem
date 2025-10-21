# Local Azure CLI Deployment Steps

## Prerequisites
- Azure CLI installed on your machine
- PowerShell or Command Prompt
- Access to your Azure subscription

## Step 1: Open a New PowerShell Window
**Important**: Close your current PowerShell and open a new one to ensure Azure CLI is in the PATH.

## Step 2: Navigate to Your Project
```powershell
cd "C:\Users\Rodrigo\source\repos\ASP.Net_projects\BankingSystem"
```

## Step 3: Login to Azure
```powershell
az login
```
This will open a browser window for authentication.

## Step 4: Set Your Subscription
```powershell
# List your subscriptions first
az account list --output table

# Set the correct subscription (replace with your actual subscription ID)
az account set --subscription "your-subscription-id"
```

## Step 5: Update the Deployment Script
Edit the file `deploy-to-azure-local.ps1` and update these values:
- `$subscriptionId` - Your Azure subscription ID
- `$resourceGroupName` - Your resource group name (probably "banking-system-rg")
- `$appServiceName` - Your app service name (probably "banking-system-api")

## Step 6: Run the Deployment Script
```powershell
.\deploy-to-azure-local.ps1
```

## Alternative: Manual Commands
If you prefer to run commands manually:

```powershell
# Navigate to API project
cd src\BankingSystem.API

# Build and publish
dotnet clean
dotnet restore
dotnet build --configuration Release
dotnet publish --configuration Release --output ./publish

# Create deployment package
Compress-Archive -Path ".\publish\*" -DestinationPath ".\deployment.zip" -Force

# Deploy to Azure
az webapp deployment source config-zip --resource-group banking-system-rg --name banking-system-api --src .\deployment.zip

# Restart the app service
az webapp restart --resource-group banking-system-rg --name banking-system-api

# Disable EasyAuth (important for CORS)
az webapp auth update --name banking-system-api --resource-group banking-system-rg --enabled false

# Test the deployment
Invoke-RestMethod -Uri "https://banking-system-api.azurewebsites.net/api/test-simple" -Method GET
```

## Troubleshooting

### If Azure CLI is not recognized:
1. Restart your PowerShell/Command Prompt
2. Check if Azure CLI is installed: `where az`
3. Add Azure CLI to your PATH manually if needed

### If deployment fails:
1. Check your resource group and app service names
2. Verify you have the correct permissions
3. Check the Azure portal for any error messages

### If CORS issues persist:
1. Verify EasyAuth is disabled
2. Check the web.config file was deployed
3. Test the API endpoints directly

## Expected Results
After successful deployment:
- API should respond to test endpoint
- CORS should allow requests from Vercel frontend
- No more "Access-Control-Allow-Origin" errors
- Transactions should record properly

## Next Steps
1. Deploy the backend using the above steps
2. Deploy the frontend to Vercel (if not already done)
3. Test the complete application
4. Verify data persistence between sessions
