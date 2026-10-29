import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const list = (v) => (typeof v === 'string' ? v.split(',').map((s) => s.trim()).filter(Boolean) : v);

export const Project = model('Project', new Schema({
  title: { type: String, required: true, maxlength: 120 },
  shortDescription: { type: String, required: true, maxlength: 300 },
  technologies: { type: [String], set: list },
  image: String,
  details: String,
  liveUrl: String,
  githubUrl: String,
  order: { type: Number, default: 0 },
}, { timestamps: true }));

export const Achievement = model('Achievement', new Schema({
  title: { type: String, required: true },
  type: { type: String, default: 'Certification' },
  organization: String,
  date: String,
  description: String,
  link: String,
}, { timestamps: true }));

// Single-document site content (home, about, socials, reviews, stats)
export const Site = model('Site', new Schema({
  home: Schema.Types.Mixed,
  about: Schema.Types.Mixed,
  socials: Schema.Types.Mixed,
  reviews: Schema.Types.Mixed,
  stats: Schema.Types.Mixed,
}, { timestamps: true, minimize: false }));

export const Guard = model('Guard', new Schema({
  key: { type: String, unique: true },
  attempts: { type: Number, default: 0 },
  lockedUntil: Date,
}));
