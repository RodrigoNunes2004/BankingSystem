# Azure Cloud Shell Deployment Commands

## Prerequisites
1. Open Azure Portal
2. Click the Cloud Shell icon (>) in the top toolbar
3. Select PowerShell (not Bash)
4. Make sure you're in the correct subscription

## Step 1: Clone Your Repository
```powershell
# Clone your repository
git clone https://github.com/RodrigoNunes2004/BankingSystem.git
cd BankingSystem
```

## Step 2: Navigate to API Project
```powershell
# Navigate to the API project directory
cd src/BankingSystem.API
```

## Step 3: Build the Project
```powershell
# Restore packages and build
dotnet restore
dotnet build --configuration Release
```

## Step 4: Publish the Project
```powershell
# Publish the project
dotnet publish --configuration Release --output ./publish
```

## Step 5: Create Deployment Package
```powershell
# Create a zip file for deployment
Compress-Archive -Path "./publish/*" -DestinationPath "./deployment.zip" -Force
```

## Step 6: Deploy to Azure App Service
```powershell
# Deploy using Azure CLI
az webapp deployment source config-zip --resource-group banking-system-rg --name banking-system-api --src ./deployment.zip
```

## Step 7: Restart the App Service
```powershell
# Restart the app service to ensure changes take effect
az webapp restart --resource-group banking-system-rg --name banking-system-api
```

## Step 8: Test the Deployment
```powershell
# Test the API endpoint
Invoke-RestMethod -Uri "https://banking-system-api-evfxbwhgaband4d7.australiaeast-01.azurewebsites.net/api/test-simple" -Method GET
```

## Step 9: Disable EasyAuth (if needed)
```powershell
# Disable EasyAuth to fix CORS issues
az webapp auth update --name banking-system-api --resource-group banking-system-rg --enabled false
```

## Step 10: Verify CORS Settings
```powershell
# Check current app settings
az webapp config appsettings list --name banking-system-api --resource-group banking-system-rg --query "[?contains(name, 'CORS') || contains(name, 'AUTH')]"
```

## Alternative: One-Command Deployment
If you want to do it all in one go:
```powershell
# Complete deployment in one command
git clone https://github.com/RodrigoNunes2004/BankingSystem.git && cd BankingSystem/src/BankingSystem.API && dotnet restore && dotnet build --configuration Release && dotnet publish --configuration Release --output ./publish && Compress-Archive -Path "./publish/*" -DestinationPath "./deployment.zip" -Force && az webapp deployment source config-zip --resource-group banking-system-rg --name banking-system-api --src ./deployment.zip && az webapp restart --resource-group banking-system-rg --name banking-system-api
```

## Troubleshooting Commands

### Check App Service Status
```powershell
az webapp show --name banking-system-api --resource-group banking-system-rg --query "state"
```

### Check App Service Logs
```powershell
az webapp log tail --name banking-system-api --resource-group banking-system-rg
```

### Check CORS Settings
```powershell
az webapp cors show --name banking-system-api --resource-group banking-system-rg
```

### Set CORS Settings (if needed)
```powershell
az webapp cors add --name banking-system-api --resource-group banking-system-rg --allowed-origins "https://banking-system-e47p-46gcnid2t-rodrigos-projects-2e367d33.vercel.app"
```

## Expected Results
After successful deployment:
1. API should respond to test endpoint
2. CORS should allow requests from Vercel frontend
3. No more "Access-Control-Allow-Origin" errors
4. Transactions should record properly

## Notes
- Replace `banking-system-rg` with your actual resource group name if different
- Replace `banking-system-api` with your actual app service name if different
- The Vercel URL might change if you redeploy the frontend
