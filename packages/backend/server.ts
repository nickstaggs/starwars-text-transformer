import 'dotenv/config';
import express from 'express';
import { createTransformTextStreamRouter } from './routes/transform-text-stream.js';
import rateLimit from 'express-rate-limit';

const port = process.env.PORT || '8080'

const app = express();
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, 
  legacyHeaders: false, 
});

app.use(limiter);

// Health check endpoint
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.use('/transform-text', createTransformTextStreamRouter());

app.listen(port, () => {
    console.log(`API running: http://localhost:${port}`);
});