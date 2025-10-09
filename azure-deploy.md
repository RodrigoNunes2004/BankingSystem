# 🚀 Azure Deployment Guide for Banking System

## 📋 **Prerequisites**

- ✅ Azure account with card details
- ✅ GitHub repository with BankingSystem code
- ✅ .NET 9 SDK installed locally

## 🗄️ **Step 1: Create SQL Database**

### **In Azure Portal:**

1. **Search**: "SQL databases"
2. **Create** → **SQL Database**
3. **Configuration**:
   - **Resource Group**: `BankingSystem-RG`
   - **Database name**: `BankingSystemDb`
   - **Server**: Create new → `banking-system-server`
   - **Pricing tier**: **Basic** ($5/month)
   - **Authentication**: SQL authentication
   - **Username**: `bankingadmin`
   - **Password**: Create strong password

### **Get Connection String:**

1. **Go to your database**
2. **Settings** → **Connection strings**
3. **Copy ADO.NET connection string**
4. **Replace** `{your_username}` and `{your_password}`

## 🚀 **Step 2: Create App Service**

### **In Azure Portal:**

1. **Search**: "App Services"
2. **Create** → **Web App**
3. **Configuration**:
   - **Resource Group**: `BankingSystem-RG`
   - **Name**: `banking-system-api`
   - **Runtime stack**: `.NET 9`
   - **Operating System**: `Windows`
   - **Pricing tier**: **Basic B1** ($10/month)

## 🔧 **Step 3: Configure App Service**

### **Connection String:**

1. **Go to your App Service**
2. **Settings** → **Configuration**
3. **Connection strings** → **New connection string**
4. **Name**: `DefaultConnection`
5. **Value**: Your SQL connection string
6. **Type**: `SQLServer`

### **Environment Variables:**

1. **Application settings** → **New application setting**
2. **Name**: `ASPNETCORE_ENVIRONMENT`
3. **Value**: `Production`

## 📦 **Step 4: Deploy Code**

### **Option A: GitHub Actions (Recommended)**

1. **Go to your App Service**
2. **Deployment Center** → **GitHub**
3. **Connect to GitHub** → **Select repository**
4. **Branch**: `master`
5. **Deploy**

### **Option B: Azure CLI**

```bash
# Install Azure CLI
az login
az webapp up --name banking-system-api --resource-group BankingSystem-RG
```

## 🌐 **Step 5: Deploy Frontend to Vercel**

### **Vercel Setup:**

1. **Go to**: https://vercel.com/
2. **Import Project** from GitHub
3. **Root Directory**: `frontend`
4. **Environment Variable**:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://banking-system-api.azurewebsites.net/api`

## 🔄 **Step 6: Run Database Migrations**

### **In Azure Portal:**

1. **Go to your App Service**
2. **Development Tools** → **Console**
3. **Run commands**:

```bash
cd src/BankingSystem.API
dotnet ef database update
```

## 🎯 **Expected URLs**

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://banking-system-api.azurewebsites.net`
- **Swagger**: `https://banking-system-api.azurewebsites.net/swagger`

## 💰 **Monthly Costs**

```
🗄️ SQL Database Basic: $5/month
🚀 App Service Basic: $10/month
🌐 Vercel Frontend: FREE
💳 Total: $15/month
```

## 🔐 **Security Best Practices**

1. **Enable HTTPS** (automatic with Azure)
2. **Configure CORS** for your Vercel domain
3. **Use Azure Key Vault** for secrets
4. **Enable SQL Server encryption**
5. **Set up monitoring** with Application Insights

## 📊 **Monitoring & Analytics**

- **Application Insights** for performance monitoring
- **Azure Monitor** for resource usage
- **Cost Management** for spending tracking
- **Health checks** for API endpoints

## 🎉 **Result**

Your banking system will be:

- ✅ **Live on the internet**
- ✅ **Mobile responsive**
- ✅ **Production ready**
- ✅ **Scalable**
- ✅ **Secure**

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **Connection string** not working → Check firewall rules
2. **CORS errors** → Add Vercel domain to CORS
3. **Database migrations** → Run in Azure Console
4. **Build failures** → Check .NET 9 compatibility

### **Support Resources:**

- **Azure Documentation**: https://docs.microsoft.com/azure/
- **App Service Logs**: Azure Portal → App Service → Logs
- **SQL Database Metrics**: Azure Portal → SQL Database → Metrics



