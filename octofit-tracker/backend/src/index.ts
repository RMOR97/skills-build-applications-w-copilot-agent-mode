import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import usersRouter from './routes/users';
import activitiesRouter from './routes/activities';
import teamsRouter from './routes/teams';
import leaderboardRouter from './routes/leaderboard';
import config from './config/environment';

dotenv.config();

const app: Express = express();
const { port, mongodbUri, apiBaseUrl, environment, corsOrigins } = config;

// Middleware
app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(mongodbUri)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OctoFit Tracker API is running' });
});

app.use('/api/users', usersRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/leaderboard', leaderboardRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start server
app.listen(port, () => {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🐙 OctoFit Tracker API Server Started');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📍 Environment: ${environment.toUpperCase()}`);
  console.log(`🌐 API Base URL: ${apiBaseUrl}`);
  console.log(`🔗 Server Port: ${port}`);
  console.log(`📊 Database: ${mongodbUri.replace(/mongodb:\/\/.*@/, 'mongodb://***@')}`);
  console.log('');
  console.log('Allowed CORS Origins:');
  corsOrigins.forEach((origin) => {
    console.log(`  ✓ ${origin}`);
  });
  console.log('═══════════════════════════════════════════════════════════\n');
});
