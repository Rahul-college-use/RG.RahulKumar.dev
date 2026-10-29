import 'dotenv/config';
import mongoose from 'mongoose';
import { Project, Achievement } from './models/index.js';
await mongoose.connect(process.env.MONGO_URI);
await Project.deleteMany({}); await Achievement.deleteMany({});
await Project.create({
  title: 'Sample MERN Project', shortDescription: 'Replace me from the admin dashboard.',
  technologies: 'React, Node.js, MongoDB', details: 'Describe logic, features and security here.',
  liveUrl: 'https://example.com', githubUrl: 'https://github.com',
});
await Achievement.create({ title: 'Smart India Hackathon', type: 'Hackathon', organization: 'Govt. of India', date: '2026', description: 'Edit from admin.' });
console.log('Seeded'); process.exit(0);
