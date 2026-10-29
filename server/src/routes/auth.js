import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Guard } from '../models/index.js';

const MAX_ATTEMPTS = 5;
const LOCK_MS = 60 * 60 * 1000; // 1 hour
const r = Router();
const isLocked = (g) => !!(g.lockedUntil && g.lockedUntil > new Date());

r.post('/login', async (req, res, next) => {
  try {
    const g = (await Guard.findOne({ key: req.ip })) || new Guard({ key: req.ip });
    if (isLocked(g)) {
      const mins = Math.ceil((g.lockedUntil - Date.now()) / 60000);
      return res.status(429).json({ message: `Too many attempts. Try again in ${mins} min.`, locked: true });
    }
    const { password } = req.body;
    const ok = password && process.env.ADMIN_PASSWORD_HASH &&
      (await bcrypt.compare(String(password), process.env.ADMIN_PASSWORD_HASH));
    if (!ok) {
      g.attempts += 1;
      if (g.attempts >= MAX_ATTEMPTS) { g.lockedUntil = new Date(Date.now() + LOCK_MS); g.attempts = 0; }
      await g.save();
      const locked = isLocked(g);
      return res.status(locked ? 429 : 401).json({
        message: locked ? 'Locked for 1 hour after 5 failed attempts.' : 'Incorrect password.',
        attemptsLeft: locked ? 0 : MAX_ATTEMPTS - g.attempts,
        locked,
      });
    }
    g.attempts = 0; g.lockedUntil = undefined; await g.save();
    res.json({ token: jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' }) });
  } catch (e) { next(e); }
});

export default r;
