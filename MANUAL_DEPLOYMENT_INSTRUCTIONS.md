# Manual Deployment Instructions

## Backend Deployment to Azure

Since Azure PowerShell modules are not installed, here are the manual steps to deploy the backend:

### Option 1: Using Visual Studio (Recommended)
1. Open the solution in Visual Studio
2. Right-click on `BankingSystem.API` project
3. Select "Publish"
4. Choose "Azure" as target
5. Select your existing Azure App Service
6. Click "Publish"

### Option 2: Using Azure Portal
1. Go to Azure Portal
2. Navigate to your App Service
3. Go to "Deployment Center"
4. Choose "Local Git" or "External Git"
5. Connect to your GitHub repository
6. Set the branch to `master`
7. Set the folder to `src/BankingSystem.API`
8. Deploy

### Option 3: Using Azure CLI (if installed)
```bash
# Install Azure CLI first, then:
az login
az webapp deployment source config-zip --resource-group banking-system-rg --name banking-system-api --src publish.zip
```

## Frontend Deployment to Vercel

### Automatic Deployment (if connected to GitHub)
1. Go to Vercel dashboard
2. Your project should auto-deploy from the `master` branch
3. Check the deployment status

### Manual Deployment
```bash
cd frontend
npm install
npm run build
vercel --prod
```

## Important Files to Deploy

### Backend Files:
- `src/BankingSystem.API/Program.cs` - CORS configuration
- `src/BankingSystem.API/Controllers/*.cs` - CORS headers
- `src/BankingSystem.API/web.config` - IIS CORS config

### Frontend Files:
- `frontend/src/components/AccountTransfer.tsx` - Transfer fixes
- `frontend/src/components/TransactionManagement.tsx` - Transaction fixes
- `frontend/src/contexts/AuthContext.tsx` - Auth fixes
- `frontend/src/components/InsuranceManagement.tsx` - Mock data removed
- `frontend/src/components/CurrencyExchange.tsx` - Mock data removed

## After Deployment

1. **Test CORS**: Check if frontend can connect to backend
2. **Test Transactions**: Verify deposits, withdrawals, and transfers work
3. **Test Data Persistence**: Ensure data persists between sessions
4. **Check Console**: Look for any remaining errors

## Troubleshooting

### If CORS issues persist:
1. Check Azure App Service EasyAuth settings
2. Verify web.config is deployed
3. Run the EasyAuth disable script if needed

### If transactions aren't recording:
1. Check browser console for errors
2. Verify localStorage is working
3. Check API service fallback logic
