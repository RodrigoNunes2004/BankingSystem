# Fix CORS Multiple Origins Issue
# The server is sending multiple origins in Access-Control-Allow-Origin header
# This causes CORS to fail because browsers only allow ONE origin

Write-Host "🔧 Fixing CORS Multiple Origins Issue..." -ForegroundColor Yellow

# Clear all existing CORS origins
Write-Host "1. Clearing all existing CORS origins..." -ForegroundColor Cyan
az webapp cors remove --resource-group "BankingSystem-RG" --name "banking-system-api" --allowed-origins "*"
az webapp cors remove --resource-group "BankingSystem-RG" --name "banking-system-api" --allowed-origins "https://banking-system-e47p-46gcnid2t-rodrigos-projects-2e367d33.vercel.app"
az webapp cors remove --resource-group "BankingSystem-RG" --name "banking-system-api" --allowed-origins "https://banking-system-2r3e656qa-rodrigos-projects-2e367d33.vercel.app"

# Add only the current Vercel URL (single origin)
Write-Host "2. Adding single Vercel origin..." -ForegroundColor Cyan
az webapp cors add --resource-group "BankingSystem-RG" --name "banking-system-api" --allowed-origins "https://banking-system-2r3e656qa-rodrigos-projects-2e367d33.vercel.app"

# Add localhost for development
Write-Host "3. Adding localhost for development..." -ForegroundColor Cyan
az webapp cors add --resource-group "BankingSystem-RG" --name "banking-system-api" --allowed-origins "http://localhost:3000"

# Restart the app service
Write-Host "4. Restarting app service..." -ForegroundColor Cyan
az webapp restart --resource-group "BankingSystem-RG" --name "banking-system-api"

Write-Host "✅ CORS fix applied! The server will now send only ONE origin in the header." -ForegroundColor Green
Write-Host "🎯 Test your app now: https://banking-system-2r3e656qa-rodrigos-projects-2e367d33.vercel.app" -ForegroundColor Blue