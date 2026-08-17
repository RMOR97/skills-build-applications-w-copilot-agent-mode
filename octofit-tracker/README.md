# OctoFit Tracker - Multi-tier Application

A comprehensive fitness tracking application built with React, Node.js/Express, and MongoDB.

## Project Structure

```
octofit-tracker/
├── frontend/          # React 19 + Vite
│   ├── src/          # Frontend source code
│   ├── public/       # Static assets
│   ├── index.html    # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── backend/          # Node.js + Express + TypeScript
    ├── src/
    │   ├── index.ts  # Main server entry point
    │   ├── config/   # Configuration files
    │   └── scripts/  # Database scripts
    ├── package.json
    └── tsconfig.json
```

## Tech Stack

### Frontend (Presentation Tier)
- React 19 with Vite
- React Router for navigation
- Bootstrap for styling
- Port: **5173**

### Backend (Logic Tier)
- Node.js (LTS)
- Express.js
- TypeScript
- Port: **8000**

### Database (Data Tier)
- MongoDB
- Mongoose ODM
- Port: **27017**

## Prerequisites

Before you can run the application, you need to have the following installed:
- **Node.js** (LTS version)
- **MongoDB** (`mongodb-org` package)
- **npm** or **yarn** (included with Node.js)

## Setup Instructions

### 1. Install Dependencies

**Frontend:**
```bash
cd octofit-tracker/frontend
npm install
```

**Backend:**
```bash
cd octofit-tracker/backend
npm install
```

### 2. Configure Backend Environment

Copy the environment file and configure it:
```bash
cd octofit-tracker/backend
cp .env.example .env
```

Edit `.env` with your MongoDB connection string and other settings.

### 3. Start MongoDB

Ensure MongoDB is running:
```bash
# Check if MongoDB is running
ps aux | grep mongod

# If not running, start MongoDB service
mongod
```

## Running the Application

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd octofit-tracker/backend
npm run dev
```
Backend will run on `http://localhost:8000`

**Terminal 2 - Start Frontend:**
```bash
cd octofit-tracker/frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### Production Build

**Frontend:**
```bash
cd octofit-tracker/frontend
npm run build
npm run preview
```

**Backend:**
```bash
cd octofit-tracker/backend
npm run build
npm start
```

## Features (In Development)

- User authentication and profiles
- Activity logging and tracking
- Team creation and management
- Competitive leaderboard
- Personalized workout suggestions

## Available Scripts

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled server
- `npm run lint` - Run ESLint

## API Health Check

Once the backend is running, you can check the API health:
```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "OctoFit Tracker API is running"
}
```

## Database

The application uses MongoDB with Mongoose for data modeling. MongoDB should be running on the default port 27017.

To verify MongoDB is running:
```bash
ps aux | grep mongod
```

## Development Notes

- Ensure all environment variables are properly configured before running
- The backend listens on port 8000
- The frontend dev server runs on port 5173
- MongoDB runs on port 27017

## Troubleshooting

### Node.js/npm not found
Ensure Node.js (LTS version) is installed:
```bash
node --version
npm --version
```

### MongoDB connection errors
Check if MongoDB is running and accessible:
```bash
mongosh mongodb://localhost:27017
```

### Port conflicts
If ports 5173, 8000, or 27017 are already in use, update the configuration in:
- Frontend: `vite.config.ts`
- Backend: `.env` file (PORT variable)
- MongoDB: Configuration file or startup command

## License

See LICENSE file for details.
