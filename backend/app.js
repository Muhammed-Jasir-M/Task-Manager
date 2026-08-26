import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();

const rawFrontendUrl = process.env.FRONTEND_URL || '';
const cleanFrontendUrl = rawFrontendUrl.trim().replace(/\/+$/, '');

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/+$/, '');

    if (
      !cleanFrontendUrl || 
      normalizedOrigin === cleanFrontendUrl ||
      normalizedOrigin.includes('vercel.app') ||
      normalizedOrigin.includes('localhost')
    ) {
      return callback(null, origin);
    }

    return callback(null, origin);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'X-User-Id'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(json());

if (!process.env.MONGODB_URI) {
  console.error('CRITICAL ERROR: MONGODB_URI environment variable is missing or undefined!');
} else {
  connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}

app.use('/api/v1/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
