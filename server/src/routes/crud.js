import { Router } from 'express';
import mongoose from 'mongoose';
import auth from '../middleware/auth.js';
import { Project, Achievement } from '../models/index.js';

const validId = (req, res, next) =>
  mongoose.isValidObjectId(req.params.id) ? next() : res.status(400).json({ message: 'Invalid id' });

const crud = (Model, sort) => {
  const r = Router();
  r.get('/', async (_req, res, next) => { try { res.json(await Model.find().sort(sort).lean()); } catch (e) { next(e); } });
  r.post('/', auth, async (req, res, next) => { try { res.status(201).json(await Model.create(req.body)); } catch (e) { next(e); } });
  r.put('/:id', auth, validId, async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      doc ? res.json(doc) : res.status(404).json({ message: 'Not found' });
    } catch (e) { next(e); }
  });
  r.delete('/:id', auth, validId, async (req, res, next) => {
    try { (await Model.findByIdAndDelete(req.params.id)) ? res.json({ ok: true }) : res.status(404).json({ message: 'Not found' }); }
    catch (e) { next(e); }
  });
  return r;
};

export const projectRouter = Router();
// Git integration: list a GitHub user's public repos as project drafts (defined before /:id routes)
projectRouter.get('/github/:user', auth, async (req, res, next) => {
  try {
    if (!/^[a-zA-Z0-9-]{1,39}$/.test(req.params.user)) return res.status(400).json({ message: 'Invalid username' });
    const gh = await fetch(`https://api.github.com/users/${req.params.user}/repos?sort=updated&per_page=30`);
    if (!gh.ok) return res.status(502).json({ message: 'GitHub request failed' });
    const repos = await gh.json();
    res.json(repos.filter((x) => !x.fork).map((x) => ({
      title: x.name, shortDescription: x.description || 'No description yet',
      technologies: [x.language, ...(x.topics || [])].filter(Boolean),
      githubUrl: x.html_url, liveUrl: x.homepage || '',
    })));
  } catch (e) { next(e); }
});
projectRouter.use(crud(Project, { order: 1, createdAt: -1 }));
export const achievementRouter = crud(Achievement, { createdAt: -1 });
