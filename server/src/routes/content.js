import { Router } from 'express';
import auth from '../middleware/auth.js';
import { Site } from '../models/index.js';

const r = Router();
const FIELDS = ['home', 'about', 'socials', 'reviews', 'stats'];

r.get('/', async (_req, res, next) => {
  try { res.json((await Site.findOne().lean()) || {}); } catch (e) { next(e); }
});

r.put('/', auth, async (req, res, next) => {
  try {
    const $set = Object.fromEntries(FIELDS.filter((k) => k in req.body).map((k) => [k, req.body[k]]));
    res.json(await Site.findOneAndUpdate({}, { $set }, { upsert: true, new: true, lean: true }));
  } catch (e) { next(e); }
});

export default r;
