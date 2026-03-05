# Neon DB Setup Guide

This project uses **Neon** (serverless PostgreSQL) as the database. It's free, simple, and requires no local SQL Server.

## Quick Start

### 1. Create a Neon Project

1. Go to [console.neon.tech](https://console.neon.tech) and sign up (free)
2. Click **New Project**
3. Choose a name (e.g., `banking-system`) and region
4. Your project is created with a default database `neondb`

### 2. Get Your Connection String

1. In the Neon dashboard, click **Connect** to open the "Connect to your database" modal
2. Select Branch, Compute, Database (`neondb`), and Role (`neondb_owner`)
3. Look for a **tab** or **dropdown** labeled `.NET` (or `C#`) to see the .NET connection string format
4. If you don’t see .NET: Neon always shows a **PostgreSQL URI** — copy it and convert to .NET format:
   - URI: `postgresql://user:password@host.region.neon.tech/dbname?sslmode=require`
   - .NET: `Host=host.region.neon.tech;Database=dbname;Username=user;Password=password;SSL Mode=Require`
5. Copy the full string and use it in your config. It looks like:
   ```
   Host=ep-xxx-xxx.region.aws.neon.tech;Database=neondb;Username=user;Password=xxx;SSL Mode=Require
   ```

### 3. Configure the API

**Option A: appsettings.Development.json** (for local development)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=YOUR_HOST;Database=YOUR_DB;Username=YOUR_USER;Password=YOUR_PASSWORD;SSL Mode=Require"
  }
}
```

**Option B: User Secrets** (recommended - keeps credentials out of source control)
```bash
cd src/BankingSystem.API
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=...;Database=...;Username=...;Password=...;SSL Mode=Require"
```

**Option C: Environment variable**
```bash
# Windows PowerShell
$env:ConnectionStrings__DefaultConnection = "Host=...;Database=...;Username=...;Password=...;SSL Mode=Require"

# Linux/Mac
export ConnectionStrings__DefaultConnection="Host=...;Database=...;Username=...;Password=...;SSL Mode=Require"
```

### 4. Apply Migrations

```bash
dotnet ef database update -p src/BankingSystem.Infrastructure -s src/BankingSystem.API
```

Or start the API and call:
```
POST http://localhost:5023/api/database/initialize
```

### 5. Configure Frontend (Local Development)

Create or update `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5023/api
```

### 6. Run the Application

**Terminal 1 - API:**
```bash
cd src/BankingSystem.API
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## Connection String Format

Neon uses standard PostgreSQL connection strings:
```
Host=<your-neon-host>;Database=<database-name>;Username=<username>;Password=<password>;SSL Mode=Require
```

For pooled connections (better for serverless), add `Pooling=true`:
```
Host=...;Database=...;Username=...;Password=...;SSL Mode=Require;Pooling=true
```

## Troubleshooting

### "No such host is known"

This means the **Host** in your connection string is wrong or still a placeholder.

1. Go to [Neon Console](https://console.neon.tech) → your project → **Connect**
2. Select branch, compute, database, and role; copy the connection string (URI or .NET) from the modal. If you don't see a .NET option, copy the URI and convert: `postgresql://user:pass@host/db?sslmode=require` → `Host=host;Database=db;Username=user;Password=pass;SSL Mode=Require`
3. **Copy the full string** – don’t type it manually; use the Neon copy button
4. The host should look like: `ep-something-12345678.us-east-2.aws.neon.tech`
5. Replace the entire `DefaultConnection` value in `appsettings.Development.json` with the copied string
6. Ensure the database is `Bank System` (or whatever your DB is called)

Example:
```
Host=ep-cool-darkness-12345678.us-east-2.aws.neon.tech;Database=Bank System;Username=neondb_owner;Password=abc123xyz;SSL Mode=Require
```

### Other issues

- **Connection timeout**: Ensure your firewall allows outbound connections to Neon (port 5432)
- **SSL errors**: Use `SSL Mode=Require` in the connection string
- **Migration fails**: Verify the connection string is correct; run `dotnet ef database update` with verbose logging if needed

## Vercel + Neon Deployment

### Frontend (Vercel)

1. Connect your repo to Vercel
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   - `REACT_APP_API_URL` = your deployed API URL (e.g. `https://your-api.railway.app/api`)

### Backend (Railway / Render / etc.)

Deploy the API to any .NET host. Set environment variables:

- `ConnectionStrings__DefaultConnection` = your Neon connection string
- `ASPNETCORE_ENVIRONMENT` = `Production`
- `Jwt__Key` = strong secret (min 32 characters) for JWT signing

Run migrations on first deploy (or call `POST /api/database/initialize`).

## Resources

- [Neon Documentation](https://neon.tech/docs)
- [Npgsql (PostgreSQL .NET) Guide](https://www.npgsql.org/doc/)
