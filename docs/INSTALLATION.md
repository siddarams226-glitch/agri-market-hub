# Agri Market Hub - Installation Guide

## Prerequisites
- Node.js 16.x or higher
- npm or yarn
- MySQL 8.0 or higher
- Git

## Project Structure
```
agri-market-hub/
├── backend/           # Express.js API
├── frontend/          # React + Vite application
└── docs/              # Documentation
```

---

## Backend Setup

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your configurations:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=agri_market_hub
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production_min_32_chars
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_key_min_32_chars
JWT_REFRESH_EXPIRE=30d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

### Step 3: Setup MySQL Database
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE agri_market_hub;
USE agri_market_hub;

# Run schema
source backend/database/schema.sql;

# Exit
exit;
```

Or import using command line:
```bash
mysql -u root -p agri_market_hub < backend/database/schema.sql
```

### Step 4: Start Backend Server
```bash
npm run dev
```

Expected output:
```
✓ Database connection successful
✓ Server running on port 5000
✓ Environment: development
✓ API available at http://localhost:5000/api
```

**Backend is now running!** Visit http://localhost:5000/api/health to verify.

---

## Frontend Setup

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Agri Market Hub
```

### Step 3: Start Development Server
```bash
npm run dev
```

Expected output:
```
VITE v5.0.2  ready in 300 ms

➜  Local:   http://localhost:5173/
```

**Frontend is now running!** Visit http://localhost:5173 in your browser.

---

## Build for Production

### Backend Production Build
```bash
cd backend

# Install production dependencies only
npm install --production

# Start server
NODE_ENV=production npm start
```

### Frontend Production Build
```bash
cd frontend

# Build
npm run build

# Output in dist/ folder
```

---

## Database Schema Overview

### Tables
1. **users** - User accounts (farmers and buyers)
2. **products** - Agricultural products
3. **cart** - Shopping cart items
4. **orders** - Customer orders
5. **order_items** - Items in each order

### Key Relationships
```
users (1) ----< (many) products
         ----< (many) orders
         ----< (many) cart

products (1) ----< (many) cart
           ----< (many) order_items

orders (1) ----< (many) order_items
```

---

## Useful Commands

### Backend
```bash
# Development with auto-reload
npm run dev

# Production start
npm start

# Test database connection
node src/config/database.js
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Database
```bash
# Backup database
mysqldump -u root -p agri_market_hub > backup.sql

# Restore database
mysql -u root -p agri_market_hub < backup.sql

# Reset database
mysql -u root -p -e "DROP DATABASE agri_market_hub; CREATE DATABASE agri_market_hub;"
mysql -u root -p agri_market_hub < backend/database/schema.sql
```

---

## Testing the Application

### Test User Credentials (After Setup)
```
Farmer Account:
Email: rajesh@farmer.com
Password: (bcrypt hashed, use any password for testing)

Buyer Account:
Email: amit@buyer.com
Password: (bcrypt hashed, use any password for testing)
```

### Manual Testing Flow
1. **Register** a new account at `/register`
2. **Login** with credentials
3. **Browse Products** at `/products`
4. **Add Products** (farmers) or **Add to Cart** (buyers)
5. **Checkout** and **Place Order** (buyers)

### API Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "role": "buyer",
    "phone": "9999999999",
    "city": "Delhi",
    "state": "Delhi"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Products:**
```bash
curl -X GET http://localhost:5000/api/products
```

---

## Troubleshooting

### Database Connection Error
- Verify MySQL is running: `sudo systemctl status mysql`
- Check database credentials in `.env`
- Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Frontend Can't Connect to Backend
- Verify backend is running: http://localhost:5000/api/health
- Check `VITE_API_URL` in frontend `.env`
- Ensure CORS is configured in backend `.env`

### Module Not Found
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Build Issues
```bash
# Clear cache
npm cache clean --force

# Reinstall
npm install
```

---

## Environment Variables Checklist

### Backend (.env)
- [ ] DB_HOST set
- [ ] DB_USER set
- [ ] DB_PASSWORD set
- [ ] DB_NAME set
- [ ] JWT_SECRET min 32 chars
- [ ] CORS_ORIGIN matches frontend URL

### Frontend (.env)
- [ ] VITE_API_URL matches backend URL
- [ ] VITE_APP_NAME set

---

## Next Steps
1. Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
2. Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
3. Configure email (optional) for notifications
4. Set up SSL certificates for production
5. Configure CDN for image hosting

---

## Support
For issues or questions, refer to:
- API Documentation: `docs/API_DOCUMENTATION.md`
- Deployment Guide: `docs/DEPLOYMENT.md`
- GitHub: [Your repo URL]
