import 'dotenv/config';
import express from 'express';
import { createTransformTextStreamRouter } from './routes/transform-text-stream.js';
import rateLimit from 'express-rate-limit';

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

app.use('/transform-text', createTransformTextStreamRouter());

app.listen(3000, () => {
    console.log('API running: http://localhost:3000');
    console.log('Stream test:  curl -N "http://localhost:3000/transform-text/stream?style=children%27s%20book%20author&text=The%20cat%20went%20surfing."');
});