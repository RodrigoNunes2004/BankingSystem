# Deployment Checklist: Vercel + Render + Neon

## JSON Configuration Audit ✅

| File | Status |
|------|--------|
| `appsettings.json` | ✅ Neon placeholder |
| `appsettings.Development.json` | ✅ Neon placeholder |
| `appsettings.Production.json` | ✅ Empty – uses env var `ConnectionStrings__DefaultConnection` |
| `frontend/vercel.json` | ✅ SPA rewrites for React Router |
| `frontend/package.json` | ✅ Standard CRA build |
| `frontend/env.example` | ✅ Local + Vercel deployment notes |
| `Dockerfile` | ✅ For Render backend deployment |

## Vercel (Frontend)

1. **Vercel Dashboard** → New Project → Import repo
2. **Root Directory**: Set to `frontend`
3. **Environment Variables** (Production & Preview):
   - `REACT_APP_API_URL` = `https://your-render-api.onrender.com/api`

## Backend (Render)

1. **Render Dashboard** → New → **Web Service**
2. **Connect** your GitHub repo
3. **Settings**:
   - **Name**: `banking-system-api` (or your choice)
   - **Region**: Pick nearest to your users
   - **Branch**: `master` (or your main branch)
   - **Root Directory**: leave empty (repo root)
   - **Runtime**: **Docker**
   - **Dockerfile Path**: `Dockerfile` (or leave default)
   - **Instance Type**: Free (spins down after ~15 min idle) or paid for always-on

4. **Environment Variables** ( Secrets or Environment ):
   - `DATABASE_URL` = your Neon connection string
   - `ASPNETCORE_ENVIRONMENT` = `Production`
   - `Jwt__Key` = (optional) custom JWT secret; 32+ chars for production

5. **Deploy** – Render builds from the Dockerfile and deploys.

6. **First run**: Call `POST https://your-api.onrender.com/api/database/initialize` to apply migrations, or run `dotnet ef database update` locally before deploy.

7. **Get the URL**: After deploy, your API is at `https://<service-name>.onrender.com`. Set `REACT_APP_API_URL` in Vercel to `https://<service-name>.onrender.com/api`.

## Backend (Railway) – no credit card for trial

1. **Railway Dashboard** → New Project → Deploy from GitHub
2. Select the repo and branch
3. **Critical**: Set **Root Directory** to **empty** (or `/`) – the Dockerfile is at repo root
4. Railway auto-detects Docker → uses the Dockerfile
5. **Variables**: Add `DATABASE_URL` (Neon) and `ASPNETCORE_ENVIRONMENT=Production`
6. Deploy. URL will be `https://<project>-<service>.railway.app`
7. Optional: set a **custom domain** in Settings
8. After first deploy: `POST https://your-api.railway.app/api/database/initialize` to run migrations

## Neon Setup

See [NEON_SETUP.md](NEON_SETUP.md) for database setup.
