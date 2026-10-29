import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useList } from '../hooks/useData';
import { Title } from '../components/ui/bits';

export function ProjectCard({ p, onOpen }) {
  return (
    <article className="spot glass flex flex-col overflow-hidden transition"
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`); }}>
      <div className="aspect-video bg-card">
        {p.image ? <img src={p.image} alt="" loading="lazy" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center font-mono text-3xl text-line">{'{ }'}</div>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold">{p.title}</h3>
        <p className="mt-2 text-sm">{p.shortDescription}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">{(p.technologies || []).map((t) => <span key={t} className="badge">{t}</span>)}</div>
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          {onOpen && <button className="btn-ghost !px-3 !py-2 text-sm" onClick={() => onOpen(p)}>Details</button>}
          {p.liveUrl && <a className="btn-gold !px-3 !py-2 text-sm" href={p.liveUrl} target="_blank" rel="noreferrer noopener">View live</a>}
          {p.githubUrl && <a className="btn-ghost !px-3 !py-2 text-sm" href={p.githubUrl} target="_blank" rel="noreferrer noopener">GitHub</a>}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const [items, state] = useList('projects');
  const [open, setOpen] = useState(null);
  return (
    <div className="section">
      <Title sub="Pulled live from the database. Add or edit them from the admin dashboard.">Projects</Title>
      {state === 'loading' && <p className="text-muted">Loading projects…</p>}
      {state === 'error' && <p className="text-danger">Couldn't reach the server. Check that the API is running and VITE_API_URL is correct.</p>}
      {state === 'ok' && !items.length && <p className="text-muted">No projects yet. Add one from the admin dashboard.</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((p) => <ProjectCard key={p._id} p={p} onOpen={setOpen} />)}</div>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.div role="dialog" aria-modal="true" className="glass max-h-[90vh] w-full max-w-2xl overflow-y-auto !bg-card p-6" initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-4"><h2 className="text-2xl font-bold">{open.title}</h2>
                <button className="btn-ghost !px-3" onClick={() => setOpen(null)} aria-label="Close">✕</button></div>
              <div className="mt-3 flex flex-wrap gap-1.5">{(open.technologies || []).map((t) => <span key={t} className="badge">{t}</span>)}</div>
              <p className="mt-5 whitespace-pre-line leading-relaxed">{open.details || open.shortDescription}</p>
              <div className="mt-6 flex gap-2">
                {open.liveUrl && <a className="btn-gold" href={open.liveUrl} target="_blank" rel="noreferrer noopener">View live</a>}
                {open.githubUrl && <a className="btn-ghost" href={open.githubUrl} target="_blank" rel="noreferrer noopener">GitHub</a>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
