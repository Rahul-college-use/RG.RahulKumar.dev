import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import sanitize from './middleware/sanitize.js';
import auth from './routes/auth.js';
import content from './routes/content.js';
import { projectRouter, achievementRouter } from './routes/crud.js';

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || '*' }));
app.use(express.json({ limit: '200kb' }));
app.use(mongoSanitize());
app.use(sanitize);
app.use('/api', rateLimit({ windowMs: 60_000, max: 200 }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', auth);
app.use('/api/content', content);
app.use('/api/projects', projectRouter);
app.use('/api/achievements', achievementRouter);

app.use((_req, res) => res.status(404).json({ message: 'Not found' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.name === 'ValidationError' ? 400 : err.status || 500;
  res.status(status).json({ message: status === 500 ? 'Server error' : err.message });
});

await mongoose.connect(process.env.MONGO_URI);
app.listen(process.env.PORT || 5000, () => console.log('API running on :' + (process.env.PORT || 5000)));
