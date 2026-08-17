# API Configuration for GitHub Codespaces and Localhost

This document explains how the OctoFit Tracker API is configured to work seamlessly in both GitHub Codespaces and localhost development environments.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│ GitHub Codespaces                                           │
│ ┌───────────────┐         ┌──────────────┐                  │
│ │ Frontend      │         │ Backend API  │                  │
│ │ Port: 5173    │────────→│ Port: 8000   │                  │
│ └───────────────┘         └──────────────┘                  │
│   https://codespace-5173    https://codespace-8000           │
│        .app.github.dev           .app.github.dev            │
│                                                              │
│        ┌────────────────────────────────┐                   │
│        │ MongoDB (Port: 27017 - Private)│                   │
│        └────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Localhost Development                                       │
│ ┌───────────────┐         ┌──────────────┐                  │
│ │ Frontend      │         │ Backend API  │                  │
│ │ Port: 5173    │────────→│ Port: 8000   │                  │
│ └───────────────┘         └──────────────┘                  │
│   http://localhost:5173  http://localhost:8000              │
│                                                              │
│        ┌────────────────────────────────┐                   │
│        │ MongoDB (Port: 27017 - Local)  │                   │
│        └────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

## Backend Configuration

### Auto-Detection

The backend automatically detects the environment and configures itself accordingly using the `CODESPACE_NAME` environment variable.

**File:** `octofit-tracker/backend/src/config/environment.ts`

```typescript
// GitHub Codespaces
if (CODESPACE_NAME) {
  apiBaseUrl = `https://${CODESPACE_NAME}-8000.app.github.dev`;
  corsOrigins = [
    `https://${CODESPACE_NAME}-5173.app.github.dev`,
    `http://localhost:5173`,
  ];
}

// Localhost
else {
  apiBaseUrl = `http://localhost:8000`;
  corsOrigins = [
    `http://localhost:5173`,
    `http://127.0.0.1:5173`,
  ];
}
```

### CORS Configuration

The backend uses dynamic CORS configuration that allows:

- **Codespaces Mode:**
  - `https://$CODESPACE_NAME-5173.app.github.dev` (frontend)
  - `http://localhost:5173` (local fallback)
  - `http://localhost:8000` (local API)

- **Localhost Mode:**
  - `http://localhost:5173` (frontend)
  - `http://127.0.0.1:5173` (frontend alternative)
  - `http://localhost:8000` (API)
  - `http://127.0.0.1:8000` (API alternative)

### Server Startup

When the backend starts, it displays:

```
═══════════════════════════════════════════════════════════
🐙 OctoFit Tracker API Server Started
═══════════════════════════════════════════════════════════
📍 Environment: CODESPACE or LOCALHOST
🌐 API Base URL: https://codespace-8000.app.github.dev
🔗 Server Port: 8000
📊 Database: mongodb://localhost:27017/octofit_db

Allowed CORS Origins:
  ✓ https://codespace-5173.app.github.dev
  ✓ http://localhost:5173
═══════════════════════════════════════════════════════════
```

## Frontend Configuration

### API Client

The frontend uses an intelligent API client that auto-detects the environment.

**File:** `octofit-tracker/frontend/src/api/client.ts`

```typescript
function getApiBaseUrl(): string {
  // Check if running in GitHub Codespaces
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  
  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }
  
  // Use localhost (development)
  return `http://localhost:8000`;
}
```

### Usage in React Components

```typescript
import { apiClient } from '@/api/client';

// Fetch users
const { data, error, status } = await apiClient.get('/api/users');

// Create activity
const { data, error, status } = await apiClient.post('/api/activities', {
  type: 'running',
  duration: 30,
  points: 500
});
```

## Port Mapping

| Service | Local | Codespaces | Visibility |
|---------|-------|------------|-----------|
| Frontend | 5173 | `codespace-5173.app.github.dev` | Public |
| Backend API | 8000 | `codespace-8000.app.github.dev` | Public |
| MongoDB | 27017 | 27017 | Private |

## Environment Variables

### Backend (.env or .env.example)

```bash
# Server Configuration
PORT=8000
MONGODB_URI=mongodb://localhost:27017/octofit_db
NODE_ENV=development

# Authentication
JWT_SECRET=your_jwt_secret_key_here_change_in_production

# Additional CORS Origins (optional)
ALLOWED_ORIGINS=https://example.com,https://app.example.com
```

### Frontend (.env.example)

```bash
API_PORT=8000
VITE_API_BASE_URL=http://localhost:8000
```

The frontend also automatically reads:
- `CODESPACE_NAME` (via Vite define during build)
- `API_PORT` (via Vite define)

## Testing the API

### Using curl (Localhost)

```bash
# Health check
curl http://localhost:8000/api/health

# Get all users
curl http://localhost:8000/api/users

# Get all activities
curl http://localhost:8000/api/activities

# Get leaderboard
curl http://localhost:8000/api/leaderboard/allTime
```

### Using curl (Codespaces)

```bash
# Set the Codespace name
export CODESPACE_NAME="your-codespace-name"

# Health check
curl https://$CODESPACE_NAME-8000.app.github.dev/api/health

# Get all users
curl https://$CODESPACE_NAME-8000.app.github.dev/api/users

# Get all activities
curl https://$CODESPACE_NAME-8000.app.github.dev/api/activities
```

### Using the Test Script

```bash
# Makes the script executable
chmod +x .github/scripts/test-api.sh

# Run tests
bash .github/scripts/test-api.sh
```

The script automatically detects the environment and tests all endpoints.

## Quick Start

### 1. Backend Setup

```bash
cd octofit-tracker/backend

# Install dependencies
npm install

# Configure environment (optional)
cp .env.example .env

# Run database seed
npm run seed

# Start development server
npm run dev
```

### 2. Frontend Setup (in another terminal)

```bash
cd octofit-tracker/frontend

# Install dependencies
npm install

# Configure environment (optional)
cp .env.example .env

# Start development server
npm run dev
```

### 3. Verify API is Working

```bash
# In another terminal
bash .github/scripts/test-api.sh
```

## Troubleshooting

### CORS Error in Frontend

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
1. Verify backend is running: `curl http://localhost:8000/api/health`
2. Check that the API URL is correct by opening browser console
3. Ensure CORS origins are configured correctly in backend

### Connection Refused

**Error:** `ECONNREFUSED 127.0.0.1:8000`

**Solution:**
1. Start the backend: `npm run dev` in `octofit-tracker/backend`
2. Verify port 8000 is not in use: `lsof -i :8000`
3. Check firewall settings

### Codespaces URL Not Working

**Error:** `Failed to fetch from https://codespace-8000.app.github.dev`

**Solution:**
1. Verify ports are forwarded as public in Codespaces settings
2. Check that CODESPACE_NAME environment variable is set
3. Ensure backend is running and accessible

### MongoDB Connection Error

**Error:** `MongooseError: Cannot connect to mongodb://localhost:27017`

**Solution:**
1. Start MongoDB: `mongod --dbpath /data/db &`
2. Verify port 27017 is available: `lsof -i :27017`
3. Check MONGODB_URI in .env file

## API Endpoints

All endpoints are prefixed with `/api` and return JSON responses.

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Activities
- `GET /api/activities` - Get all activities
- `GET /api/activities/:id` - Get activity by ID
- `POST /api/activities` - Log new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Leaderboard
- `GET /api/leaderboard/daily` - Daily rankings
- `GET /api/leaderboard/weekly` - Weekly rankings
- `GET /api/leaderboard/monthly` - Monthly rankings
- `GET /api/leaderboard/allTime` - All-time rankings

### Health
- `GET /api/health` - Health check endpoint

## Security Considerations

1. **CORS:** Currently allows localhost and Codespaces. Update `corsOrigins` array for additional domains.

2. **HTTPS:** Codespaces URLs use HTTPS automatically. Ensure proper certificate handling.

3. **Environment Variables:** Never commit sensitive data (.env files). Use .env.example as template.

4. **MongoDB:** In production, use Atlas or other managed service with authentication.

5. **JWT:** Implement proper JWT token handling and expiration in production.

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use environment-specific database (e.g., MongoDB Atlas)
3. Generate strong JWT_SECRET
4. Update ALLOWED_ORIGINS with production domain
5. Enable HTTPS everywhere
6. Implement rate limiting
7. Add input validation
8. Set up logging and monitoring
