// Shown until the API responds (and offline), so the site never looks empty.
export const defaults = {
  home: {
    headline: 'I build full-stack products that ship.',
    bio: 'B.Tech CSE student building MERN apps, mobile apps and hackathon projects. I like clean architecture and interfaces that feel fast.',
    heroImage: '',
    status: 'Available for full-time roles & collaborations',
    roles: ['Full-Stack MERN Developer', 'Backend Engineer', 'PWA Architect', 'CSE Student'],
    stats: { commits: 500, hackathons: 1 },
  },
  about: {
    bio: 'Computer Science & Engineering student focused on full-stack web and mobile development.',
    degree: 'B.Tech, Computer Science & Engineering',
    tenth: '', twelfth: '',
    semesters: [{ sem: 1, sgpa: 8.5 }, { sem: 2, sgpa: 8.7 }],
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'React Native', 'Git'],
    resumeUrl: '',
  },
  socials: [
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'LinkedIn', url: 'https://linkedin.com' },
    { name: 'Twitter / X', url: 'https://x.com' },
    { name: 'LeetCode', url: 'https://leetcode.com' },
  ],
  reviews: [
    { name: 'Hackathon mentor', role: 'Smart India Hackathon', text: 'Shipped a working prototype under pressure and explained every trade-off clearly.' },
    { name: 'Project teammate', role: 'College team', text: 'Reliable, writes readable code, and unblocks others quickly.' },
    { name: 'Professor', role: 'Dept. of CSE', text: 'Strong fundamentals and a habit of building things beyond the syllabus.' },
  ],
};
export const cgpa = (sems = []) => {
  const v = sems.map((s) => Number(s.sgpa)).filter((n) => !Number.isNaN(n) && n > 0);
  return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(2) : '—';
};
