# Quick Start Guide: OctoFit Tracker Full Stack

Complete setup instructions for running the OctoFit Tracker on GitHub Codespaces or localhost.

## Prerequisites

- **GitHub Codespaces** (auto-configured) OR
- **Local Machine** with:
  - Node.js LTS
  - MongoDB 6.0+
  - npm/pnpm

## 🚀 One-Command Setup for GitHub Codespaces

The Codespace automatically configures everything. Just run:

```bash
# Terminal 1: Backend
cd octofit-tracker/backend
npm install && npm run seed && npm run dev

# Terminal 2: Frontend (new terminal)
cd octofit-tracker/frontend
npm install && npm run dev

# Terminal 3: Test API (new terminal)
bash .github/scripts/test-api.sh
```

## 📋 Step-by-Step Setup for Localhost

### Step 1: Install Dependencies

```bash
# Backend
cd octofit-tracker/backend
npm install

# Frontend (in another terminal)
cd octofit-tracker/frontend
npm install
```

### Step 2: Start MongoDB

```bash
# Verify MongoDB is installed
mongod --version

# Start MongoDB service
# macOS:
mongod --dbpath /data/db &

# Linux:
sudo systemctl start mongodb-org

# Windows (PowerShell as Administrator):
mongod --dbpath C:\data\db
```

### Step 3: Seed Database

```bash
cd octofit-tracker/backend
npm run seed
```

Expected output:
```
✅ Database seeding complete!
   - 5 users created
   - 2 teams created
   - 7 activities logged
   - 7 leaderboard rankings generated
```

### Step 4: Start Backend

```bash
cd octofit-tracker/backend
npm run dev
```

Expected output:
```
═══════════════════════════════════════════════════════════
🐙 OctoFit Tracker API Server Started
═══════════════════════════════════════════════════════════
📍 Environment: LOCALHOST
🌐 API Base URL: http://localhost:8000
🔗 Server Port: 8000
📊 Database: mongodb://localhost:27017/octofit_db

Allowed CORS Origins:
  ✓ http://localhost:5173
  ✓ http://127.0.0.1:5173
═══════════════════════════════════════════════════════════
```

### Step 5: Start Frontend (in another terminal)

```bash
cd octofit-tracker/frontend
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 6: Test API Endpoints

```bash
# Option 1: Use the test script
bash .github/scripts/test-api.sh

# Option 2: Use curl directly
curl http://localhost:8000/api/health
curl http://localhost:8000/api/users
curl http://localhost:8000/api/activities
curl http://localhost:8000/api/leaderboard/allTime
```

## 🌐 Access the Application

- **Frontend:** http://localhost:5173
- **API Health:** http://localhost:8000/api/health
- **API Users:** http://localhost:8000/api/users
- **API Activities:** http://localhost:8000/api/activities

## 📊 Sample Data

After seeding, you have:

| Item | Count | Details |
|------|-------|---------|
| Users | 5 | alex_runner, jordan_cyclist, casey_swimmer, morgan_trainer, taylor_yogi |
| Teams | 2 | Octopus Runners, Speed Demons |
| Activities | 7 | Various types (running, cycling, swimming, strength, yoga) |
| Leaderboard | 5 entries | Ranked by total points |

### Top Users by Points
1. jordan_cyclist - 3150 points
2. alex_runner - 1850 points
3. casey_swimmer - 900 points
4. morgan_trainer - 800 points
5. taylor_yogi - 400 points

## 🔧 Configuration

### Environment Variables

Backend (`.env`):
```bash
PORT=8000
MONGODB_URI=mongodb://localhost:27017/octofit_db
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
```

Frontend (`.env`):
```bash
API_PORT=8000
VITE_API_BASE_URL=http://localhost:8000
```

### Auto-Detection

The API automatically detects your environment:

- **GitHub Codespaces:** Uses `https://$CODESPACE_NAME-8000.app.github.dev`
- **Localhost:** Uses `http://localhost:8000`

No manual URL configuration needed!

## 🧪 API Testing Examples

### Get All Users
```bash
curl http://localhost:8000/api/users | jq
```

### Get All Activities
```bash
curl http://localhost:8000/api/activities | jq
```

### Get Leaderboard
```bash
# Daily
curl http://localhost:8000/api/leaderboard/daily | jq

# Weekly
curl http://localhost:8000/api/leaderboard/weekly | jq

# All Time
curl http://localhost:8000/api/leaderboard/allTime | jq
```

### Create New User
```bash
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@octofit.com",
    "password": "password123",
    "profile": {
      "firstName": "New",
      "lastName": "User"
    }
  }' | jq
```

### Log Activity
```bash
curl -X POST http://localhost:8000/api/activities \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_HERE",
    "type": "running",
    "duration": 30,
    "distance": 5,
    "calories": 300,
    "points": 400,
    "date": "2024-08-17T10:00:00Z"
  }' | jq
```

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if port 8000 is in use
lsof -i :8000

# Kill process on port 8000 if needed
kill -9 <PID>
```

### MongoDB connection error

```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
mongod --dbpath /data/db &
```

### CORS error in frontend

1. Verify backend is running
2. Check API URL in browser console
3. Restart frontend dev server

### Module not found errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation

For more detailed information, see:

- [API Configuration Guide](./API_CONFIGURATION.md) - Full API setup and configuration
- [Database Setup Guide](./DATABASE_SETUP.md) - MongoDB and seeding instructions
- [Backend README](./octofit-tracker/backend/README.md) - Backend-specific documentation

## ✨ Features Implemented

- ✅ User management with profiles
- ✅ Activity logging and tracking
- ✅ Team creation and management
- ✅ Competitive leaderboards (daily, weekly, monthly, all-time)
- ✅ Automatic API URL detection (Codespaces & localhost)
- ✅ Dynamic CORS configuration
- ✅ Sample data seeding
- ✅ TypeScript throughout
- ✅ React + Vite frontend
- ✅ Express + MongoDB backend

## 🎯 Next Steps

1. **Frontend Development:**
   - Build user authentication pages
   - Create activity logging interface
   - Design leaderboard display
   - Implement team management UI

2. **Backend Enhancement:**
   - Implement JWT authentication
   - Add password hashing
   - Create input validation middleware
   - Add comprehensive error handling
   - Implement rate limiting

3. **Database:**
   - Set up indexes for performance
   - Add data backups
   - Implement archival strategies

4. **Deployment:**
   - Configure for production environment
   - Set up GitHub Actions CI/CD
   - Deploy to cloud provider
   - Set up monitoring and logging

## 📞 Support

For issues or questions:
1. Check the relevant README in each directory
2. Review API_CONFIGURATION.md for environment setup
3. See DATABASE_SETUP.md for database issues
4. Check GitHub Issues for similar problems

Happy coding! 🐙
