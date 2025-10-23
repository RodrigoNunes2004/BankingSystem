# Remove manual CORS headers from controllers
Write-Host "🧹 Removing manual CORS headers from controllers..." -ForegroundColor Yellow

# Remove CORS headers from AccountsController
$accountsController = Get-Content "src/BankingSystem.API/Controllers/AccountsController.cs" -Raw
$accountsController = $accountsController -replace '        Response\.Headers\["Access-Control-Allow-Origin"\] = "[^"]+";', ''
$accountsController = $accountsController -replace '        Response\.Headers\["Access-Control-Allow-Methods"\] = "[^"]+";', ''
$accountsController = $accountsController -replace '        Response\.Headers\["Access-Control-Allow-Headers"\] = "[^"]+";', ''
$accountsController = $accountsController -replace '        Response\.Headers\["Access-Control-Allow-Credentials"\] = "[^"]+";', ''
$accountsController = $accountsController -replace '        Response\.Headers\["Access-Control-Max-Age"\] = "[^"]+";', ''
$accountsController = $accountsController -replace '        // Add CORS headers manually', ''
Set-Content "src/BankingSystem.API/Controllers/AccountsController.cs" -Value $accountsController

# Remove CORS headers from TransactionsController
$transactionsController = Get-Content "src/BankingSystem.API/Controllers/TransactionsController.cs" -Raw
$transactionsController = $transactionsController -replace '        Response\.Headers\["Access-Control-Allow-Origin"\] = "[^"]+";', ''
$transactionsController = $transactionsController -replace '        Response\.Headers\["Access-Control-Allow-Methods"\] = "[^"]+";', ''
$transactionsController = $transactionsController -replace '        Response\.Headers\["Access-Control-Allow-Headers"\] = "[^"]+";', ''
$transactionsController = $transactionsController -replace '        Response\.Headers\["Access-Control-Allow-Credentials"\] = "[^"]+";', ''
$transactionsController = $transactionsController -replace '        Response\.Headers\["Access-Control-Max-Age"\] = "[^"]+";', ''
$transactionsController = $transactionsController -replace '        // Add CORS headers manually', ''
Set-Content "src/BankingSystem.API/Controllers/TransactionsController.cs" -Value $transactionsController

# Remove CORS headers from UsersController
$usersController = Get-Content "src/BankingSystem.API/Controllers/UsersController.cs" -Raw
$usersController = $usersController -replace '        Response\.Headers\["Access-Control-Allow-Origin"\] = "[^"]+";', ''
$usersController = $usersController -replace '        Response\.Headers\["Access-Control-Allow-Methods"\] = "[^"]+";', ''
$usersController = $usersController -replace '        Response\.Headers\["Access-Control-Allow-Headers"\] = "[^"]+";', ''
$usersController = $usersController -replace '        Response\.Headers\["Access-Control-Allow-Credentials"\] = "[^"]+";', ''
$usersController = $usersController -replace '        Response\.Headers\["Access-Control-Max-Age"\] = "[^"]+";', ''
$usersController = $usersController -replace '        // Add CORS headers manually', ''
Set-Content "src/BankingSystem.API/Controllers/UsersController.cs" -Value $usersController

Write-Host "✅ Manual CORS headers removed from controllers" -ForegroundColor Green
