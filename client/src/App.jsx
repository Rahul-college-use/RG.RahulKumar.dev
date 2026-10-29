import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Social = lazy(() => import('./pages/Social'));
const Admin = lazy(() => import('./admin/Admin'));

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<p className="p-10 text-center text-muted">Loading…</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/social" element={<Social />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<p className="p-16 text-center">Page not found.</p>} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
