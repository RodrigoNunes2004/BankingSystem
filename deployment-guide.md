# 🚀 Banking System Deployment Guide

## ☁️ **Cloud Database Options**

### **1. Azure SQL Database (Recommended)**

- **Free Tier**: 12 months free with $200 credit
- **Basic Tier**: $5/month for small databases
- **Setup**: Create Azure account → SQL Database → Get connection string

### **2. AWS RDS (Alternative)**

- **Free Tier**: 12 months free (750 hours/month)
- **Setup**: AWS Console → RDS → Create SQL Server instance

### **3. Google Cloud SQL**

- **Free Tier**: $300 credit for 90 days
- **Setup**: Google Cloud Console → SQL → Create instance

## 🚀 **Deployment Options**

### **Frontend Deployment (Vercel)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel

# Set environment variables
vercel env add API_BASE_URL
# Enter: https://your-api-domain.com/api
```

### **Backend Deployment Options**

#### **Option 1: Azure App Service**

```bash
# Install Azure CLI
az login
az webapp up --name banking-system-api --resource-group myResourceGroup
```

#### **Option 2: Railway**

```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up
```

#### **Option 3: Heroku**

```bash
# Install Heroku CLI
heroku create banking-system-api
git push heroku main
```

## 🔧 **Environment Configuration**

### **Frontend (.env)**

```
REACT_APP_API_URL=https://your-api-domain.com/api
```

### **Backend (appsettings.Production.json)**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=your-cloud-server;Database=BankingSystemDb;User Id=username;Password=password;"
  }
}
```

## 📱 **Mobile Optimization**

The banking system is now fully responsive with:

- ✅ Mobile-first design
- ✅ Touch-friendly buttons
- ✅ Responsive tables
- ✅ Optimized forms
- ✅ iOS zoom prevention

## 🎯 **Quick Start Commands**

### **Local Development**

```bash
# Backend
cd src/BankingSystem.API
dotnet run

# Frontend
cd frontend
npm start
```

### **Production Deployment**

```bash
# Build frontend
cd frontend
npm run build

# Deploy to Vercel
vercel --prod

# Deploy backend to cloud
# (Follow cloud provider instructions)
```

## 💰 **Cost Estimates**

### **Free Tiers Available:**

- **Azure**: $200 credit + 12 months free services
- **AWS**: 12 months free tier
- **Google Cloud**: $300 credit
- **Vercel**: Free for personal projects
- **Railway**: $5/month after free tier

### **Recommended Setup:**

1. **Database**: Azure SQL (Free tier)
2. **Frontend**: Vercel (Free)
3. **Backend**: Railway or Azure App Service
4. **Total Cost**: $0-10/month

## 🔐 **Security Considerations**

- Use environment variables for connection strings
- Enable HTTPS in production
- Configure CORS properly
- Use Azure Key Vault for secrets
- Enable SQL Server encryption

## 📊 **Monitoring & Analytics**

- **Application Insights** (Azure)
- **CloudWatch** (AWS)
- **Vercel Analytics** (Frontend)
- **Health checks** for API endpoints



