import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import summaryRoutes from './routes/summary.js';
import sessionsRoutes from './routes/sessions.js';

import { apiLimiter } from './middleware/rateLimiter.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());

// Apply global rate limiting before mounting routes
app.use(apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/sessions', sessionsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
