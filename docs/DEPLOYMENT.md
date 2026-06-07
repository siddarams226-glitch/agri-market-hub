# Agri Market Hub - Deployment Guide

## Overview
This guide covers deploying Agri Market Hub to production:
- **Frontend** → Vercel
- **Backend** → Render
- **Database** → Railway MySQL

---

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free tier available)
- GitHub repository

### Step 1: Create GitHub Repository
```bash
cd agri-market-hub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/agri-market-hub.git
git push -u origin main
```

### Step 2: Configure Vercel Project
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Select `frontend` as root directory
5. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Step 3: Set Environment Variables on Vercel
1. Go to Project Settings → Environment Variables
2. Add:
   ```
   VITE_API_URL=<your-render-backend-url>/api
   VITE_APP_NAME=Agri Market Hub
   ```
3. Click "Deploy"

### Step 4: Verify Deployment
- Frontend will be available at `https://your-project.vercel.app`
- Check deployment logs if issues occur

---

## Backend Deployment (Render)

### Prerequisites
- Render account (free tier available)
- GitHub repository

### Step 1: Prepare Backend for Deployment

**Create `render.yaml` in project root:**
```yaml
services:
  - type: web
    name: agri-market-hub-api
    env: node
    region: singapore
    plan: free
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DB_HOST
        fromService:
          name: agri-market-hub-db
          type: pserv
          property: host
      - key: DB_USER
        value: postgres
      - key: DB_PASSWORD
        fromService:
          name: agri-market-hub-db
          type: pserv
          property: username
      - key: DB_NAME
        value: agri_market_hub
      - key: PORT
        value: "5000"
```

### Step 2: Create Render Web Service
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: `agri-market-hub-api`
   - Environment: `Node`
   - Build Command: `npm install` (in backend folder)
   - Start Command: `npm start`
   - Plan: Choose based on needs

### Step 3: Add Environment Variables
In Render Dashboard:
1. Go to Service → Environment
2. Add variables:
   ```
   NODE_ENV=production
   DB_HOST=your-railway-db-host
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_NAME=agri_market_hub
   JWT_SECRET=<generate-strong-secret>
   JWT_REFRESH_SECRET=<generate-strong-secret>
   CORS_ORIGIN=https://your-vercel-frontend.vercel.app
   ```

### Step 4: Deploy
- Render will automatically deploy when you push to GitHub
- Check deployment logs: Logs tab in Render dashboard

---

## Database Deployment (Railway MySQL)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project

### Step 2: Add MySQL to Railway
1. Click "Add Service" → "Database"
2. Select "MySQL"
3. Railway will provision a MySQL instance

### Step 3: Get Connection Details
1. In Railway dashboard, click MySQL service
2. Go to "Connect" tab
3. Copy connection details:
   ```
   Host: xxx.railway.app
   Port: 3306
   Username: root
   Password: xxx
   Database: railway
   ```

### Step 4: Create Database and Tables
```bash
# Connect to Railway MySQL
mysql -h xxx.railway.app -u root -p

# Create database
CREATE DATABASE agri_market_hub;
USE agri_market_hub;

# Run schema
source backend/database/schema.sql;
```

Or use MySQL GUI tool (MySQL Workbench, DBeaver, etc.)

### Step 5: Update Backend Environment Variables
Update `.env` on Render:
```
DB_HOST=xxx.railway.app
DB_USER=root
DB_PASSWORD=xxx
DB_NAME=agri_market_hub
DB_PORT=3306
```

---

## SSL/HTTPS Configuration

### Frontend (Vercel)
- Automatically configured
- HTTPS enabled by default
- Certificate auto-renewed

### Backend (Render)
- Automatically configured
- HTTPS available at `https://api.your-app.render.com`
- Update frontend `VITE_API_URL` to use HTTPS

---

## Production Checklist

### Security
- [ ] JWT_SECRET changed to strong random value
- [ ] JWT_REFRESH_SECRET changed to strong random value
- [ ] Database password is strong
- [ ] CORS_ORIGIN set to production frontend URL
- [ ] No secrets committed to repository
- [ ] SQL injection prevented (using parameterized queries)

### Performance
- [ ] Frontend minified and optimized
- [ ] Images optimized
- [ ] Database indexes created
- [ ] Caching implemented where needed

### Monitoring
- [ ] Error logging configured
- [ ] Application monitoring enabled
- [ ] Database backups automated
- [ ] Uptime monitoring configured

### Testing
- [ ] All features tested in production environment
- [ ] Payment flow tested (if applicable)
- [ ] Edge cases tested
- [ ] Load testing performed

---

## Monitoring & Maintenance

### View Logs
**Vercel Frontend:**
- Dashboard → Deployments → Click deployment → Function Logs

**Render Backend:**
- Dashboard → Service → Logs tab

### Database Backups
**Railway MySQL:**
1. Go to MySQL service
2. Data tab → Backups
3. Create manual backup or enable auto-backups

### Scale Backend (if needed)
**Render:**
1. Service Settings → Instance Type
2. Upgrade plan for more resources

---

## Cost Estimation (Monthly)

### Free Tier
- Vercel Frontend: Free (up to 100 deployments/month)
- Render Backend: $7 (minimal web service)
- Railway Database: $5 (1GB MySQL)
- **Total: ~$12/month**

### Paid Tier
- Vercel: $20+ (Pro)
- Render: $7+ (web service)
- Railway: $10+ (better specs)
- **Total: $37+/month**

---

## Updating Production

### Backend Updates
```bash
# Make changes in development
git add .
git commit -m "Update: description"
git push origin main

# Render auto-deploys
# Monitor logs in Render dashboard
```

### Frontend Updates
```bash
# Make changes in development
cd frontend
npm run build  # Verify build locally
git add .
git commit -m "Update: description"
git push origin main

# Vercel auto-deploys
# Check deployment status on Vercel dashboard
```

### Database Migrations
```bash
# Connect to production database
mysql -h railway-host -u root -p agri_market_hub

# Run migration queries
# Remember to backup first!
```

---

## Rollback Procedure

### Vercel Frontend
1. Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → Redeploy

### Render Backend
1. Dashboard → Service
2. Environment → Rollback to previous deploy

### Railway Database
1. Use backup before changes
2. Contact Railway support for point-in-time recovery

---

## Custom Domain Setup

### Vercel
1. Project Settings → Domains
2. Add custom domain
3. Update DNS records (provided by Vercel)
4. Wait for DNS propagation (5-48 hours)

### Render
1. Service Settings → Custom Domain
2. Add custom domain
3. Update DNS CNAME record
4. Wait for SSL certificate provisioning

---

## Environment Variables for Production

### Backend (.env on Render)
```env
NODE_ENV=production
PORT=5000
DB_HOST=railway.app
DB_USER=root
DB_PASSWORD=<strong-password>
DB_NAME=agri_market_hub
DB_PORT=3306
JWT_SECRET=<64-char-random-string>
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=<64-char-random-string>
JWT_REFRESH_EXPIRE=30d
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env on Vercel)
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_NAME=Agri Market Hub
```

---

## Troubleshooting Production Issues

### Frontend not loading API
- Check `VITE_API_URL` in Vercel environment
- Verify backend is running on Render
- Check CORS configuration in backend

### Database connection error
- Verify Railway host, user, password
- Check that database exists
- Verify network access (may need IP whitelisting)

### Memory issues
- Scale up Render instance
- Optimize database queries
- Enable caching

### Performance issues
- Enable Vercel analytics
- Check Render metrics
- Optimize images
- Add CDN for static files

---

## Getting Help

- **Vercel**: https://vercel.com/docs
- **Render**: https://render.com/docs
- **Railway**: https://docs.railway.app
- **GitHub**: https://docs.github.com

---

## Summary
1. Push code to GitHub
2. Connect Vercel for frontend (auto-deploys)
3. Connect Render for backend (auto-deploys)
4. Set up Railway MySQL database
5. Configure environment variables
6. Test production endpoints
7. Monitor logs and performance
8. Set up custom domains (optional)

Your application is now in production! 🎉
