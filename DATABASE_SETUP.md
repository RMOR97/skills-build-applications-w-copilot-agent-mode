# OctoFit Tracker Database Setup Guide

This guide explains how to initialize and populate the MongoDB database for the OctoFit Tracker application.

## Prerequisites

Ensure the following are installed in your development environment:

- **Node.js** (LTS version recommended)
- **MongoDB** (version 6.0+)
- **npm** or **pnpm** for package management

## Step 1: Environment Setup

### For GitHub Codespaces (Ubuntu-based)

The `.devcontainer/post_create.sh` script automatically installs MongoDB and Node.js. After the container is created, MongoDB will be set up on port 27017.

### For Local Development

#### Install MongoDB

**On macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**On Ubuntu/Debian:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt-get update
apt-get install -y mongodb-org
```

**On Windows:**
- Download from https://www.mongodb.com/try/download/community
- Follow the installer instructions

#### Start MongoDB

**macOS/Linux:**
```bash
# Start MongoDB in the background
mongod --dbpath /data/db &
```

**Windows (PowerShell as Administrator):**
```powershell
mongod --dbpath C:\data\db
```

## Step 2: Install Backend Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd octofit-tracker/backend
npm install
```

## Step 3: Configure Environment Variables (Optional)

Create a `.env` file in the backend directory if you want to use a non-default MongoDB connection:

```bash
# .env (optional)
MONGODB_URI=mongodb://localhost:27017/octofit_db
PORT=8000
```

If the `.env` file is not present, the application uses the default connection string:
- `mongodb://localhost:27017/octofit_db`

## Step 4: Populate the Database

Run the seed script to create sample data:

```bash
npm run seed
```

This command will:
1. Connect to MongoDB
2. Clear any existing data (WARNING: This will delete all existing data)
3. Create 5 sample users:
   - alex_runner (Runner)
   - jordan_cyclist (Cyclist)
   - casey_swimmer (Swimmer)
   - morgan_trainer (Trainer)
   - taylor_yogi (Yogi)
4. Create 2 teams:
   - Octopus Runners (led by alex_runner)
   - Speed Demons (led by jordan_cyclist)
5. Create 7 sample activities across different activity types
6. Generate leaderboard rankings based on activity points
7. Disconnect from MongoDB

### Expected Output

```
Connected to octofit_db
Clearing existing data...
Creating users...
Created 5 users
Creating teams...
Created 2 teams
Creating activities...
Created 7 activities
Creating leaderboard entries...
Created 7 leaderboard entries
✅ Database seeding complete!
   - 5 users created
   - 2 teams created
   - 7 activities logged
   - 7 leaderboard rankings generated
```

## Step 5: Start the Backend Server

Run the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:8000`

### Health Check

Verify the server is running:

```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{ "status": "ok" }
```

## Sample Data Overview

### Users
- **alex_runner**: Marathon enthusiast (1850 points)
- **jordan_cyclist**: Mountain biking lover (3150 points)
- **casey_swimmer**: Triathlon competitor (900 points)
- **morgan_trainer**: Personal trainer (800 points)
- **taylor_yogi**: Yoga instructor (400 points)

### Teams
- **Octopus Runners**: alex_runner + casey_swimmer
- **Speed Demons**: jordan_cyclist + morgan_trainer

### Activity Types
- Running
- Cycling
- Swimming
- Strength Training
- Yoga

## API Endpoints Available

Once the database is seeded and the server is running, you can access:

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Activities
- `GET /api/activities` - Get all activities
- `POST /api/activities` - Log new activity

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create new team

### Leaderboard
- `GET /api/leaderboard/:period` - Get leaderboard (daily, weekly, monthly, allTime)

## Troubleshooting

### MongoDB Connection Error
```
MongooseError: Cannot connect to mongodb://localhost:27017
```

**Solution:** Ensure MongoDB is running. Check with:
```bash
ps aux | grep mongod
```

Start MongoDB if it's not running:
```bash
mongod --dbpath /data/db &
```

### Permission Denied Error
```
Error: /data/db: permission denied
```

**Solution:** Create the data directory with proper permissions:
```bash
sudo mkdir -p /data/db
sudo chmod 777 /data/db
```

### Module Not Found Error
```
Error: Cannot find module 'mongoose'
```

**Solution:** Install dependencies:
```bash
npm install
```

## Running in GitHub Codespaces

In a GitHub Codespace, MongoDB and Node.js are automatically set up. Simply:

1. Open the terminal in VS Code
2. Navigate to the backend directory
3. Run: `npm install && npm run seed`
4. Run: `npm run dev` to start the server

The ports are already configured to be accessible.

## Resetting the Database

To clear all data and start fresh:

```bash
npm run seed
```

The seed script always clears existing data before creating new sample data.

## Next Steps

- Start the frontend development server (see `octofit-tracker/frontend/README.md`)
- Implement JWT authentication
- Add password hashing
- Configure CORS for frontend communication
- Set up input validation middleware
