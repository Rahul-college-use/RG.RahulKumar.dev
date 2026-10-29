import { useEffect, useState } from 'react';
import { api, errMsg } from '../services/api';
import { defaults, cgpa } from '../data/defaults';
import Hero from '../components/home/Hero';
import { ProjectCard } from '../pages/Projects';
import Crud from './Crud';

const TABS = ['Home', 'About', 'Social', 'Projects', 'Achievements'];

const Field = ({ label, children }) => <label className="block"><span className="mb-1 block text-sm text-muted">{label}</span>{children}</label>;
const csv = (v) => (Array.isArray(v) ? v.join(', ') : v || '');
const toList = (s) => s.split(',').map((x) => x.trim()).filter(Boolean);

export default function Dashboard({ onLogout }) {
  const [tab, setTab] = useState('Home');
  const [c, setC] = useState(defaults);
  const [note, setNote] = useState('');
  useEffect(() => { api.getContent().then((d) => setC({ ...defaults, ...d, home: { ...defaults.home, ...d.home }, about: { ...defaults.about, ...d.about }, socials: d.socials?.length ? d.socials : defaults.socials })).catch(() => {}); }, []);
  const save = async (patch) => {
    try { await api.saveContent(patch); setNote('Saved'); } catch (e) { setNote(errMsg(e)); }
    setTimeout(() => setNote(''), 2500);
  };
  const set = (sec, k, v) => setC((s) => ({ ...s, [sec]: { ...s[sec], [k]: v } }));
  const { home, about } = c;

  return (
    <div className="section">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">{note && <span role="status" className="text-sm text-accent">{note}</span>}<button className="btn-ghost" onClick={onLogout}>Log out</button></div>
      </div>
      <div className="mb-6 flex gap-1 overflow-x-auto">{TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-4 py-2 text-sm ${tab === t ? 'bg-card2 text-accent' : 'text-body'}`}>{t}</button>)}</div>

      {tab === 'Home' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Field label="Headline"><input className="input" value={home.headline} onChange={(e) => set('home', 'headline', e.target.value)} /></Field>
            <Field label="Bio"><textarea rows={4} className="input" value={home.bio} onChange={(e) => set('home', 'bio', e.target.value)} /></Field>
            <Field label="Hero image URL"><input className="input" value={home.heroImage} onChange={(e) => set('home', 'heroImage', e.target.value)} /></Field>
            <Field label="Status badge text"><input className="input" value={home.status} onChange={(e) => set('home', 'status', e.target.value)} /></Field>
            <Field label="Rotating roles (comma-separated)"><input className="input" value={csv(home.roles)} onChange={(e) => set('home', 'roles', toList(e.target.value))} /></Field>
            <Field label="Contact email (for the Copy email button)"><input className="input" type="email" value={home.email || ''} onChange={(e) => set('home', 'email', e.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="GitHub commits"><input className="input" type="number" value={home.stats?.commits ?? 0} onChange={(e) => set('home', 'stats', { ...home.stats, commits: +e.target.value })} /></Field>
              <Field label="Hackathons"><input className="input" type="number" value={home.stats?.hackathons ?? 0} onChange={(e) => set('home', 'stats', { ...home.stats, hackathons: +e.target.value })} /></Field>
            </div>
            <button className="btn-gold" onClick={() => save({ home })}>Save home</button>
          </div>
          <div><p className="mb-2 text-sm text-muted">Live preview</p><div className="glass overflow-hidden"><Hero home={home} compact /></div></div>
        </div>
      )}

      {tab === 'About' && (
        <div className="max-w-2xl space-y-4">
          <Field label="Bio"><textarea rows={3} className="input" value={about.bio} onChange={(e) => set('about', 'bio', e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="10th percentage"><input className="input" value={about.tenth} onChange={(e) => set('about', 'tenth', e.target.value)} /></Field>
            <Field label="12th percentage"><input className="input" value={about.twelfth} onChange={(e) => set('about', 'twelfth', e.target.value)} /></Field>
          </div>
          <Field label="Skills (comma-separated)"><input className="input" value={csv(about.skills)} onChange={(e) => set('about', 'skills', toList(e.target.value))} /></Field>
          <Field label="Resume URL"><input className="input" value={about.resumeUrl} onChange={(e) => set('about', 'resumeUrl', e.target.value)} /></Field>
          <div>
            <p className="mb-2 text-sm text-muted">Semester SGPA · CGPA is {cgpa(about.semesters)}</p>
            <div className="space-y-2">
              {(about.semesters || []).map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input className="input !w-24" type="number" value={s.sem} onChange={(e) => set('about', 'semesters', about.semesters.map((x, j) => j === i ? { ...x, sem: +e.target.value } : x))} aria-label="Semester" />
                  <input className="input" type="number" step="0.01" min="0" max="10" value={s.sgpa} onChange={(e) => set('about', 'semesters', about.semesters.map((x, j) => j === i ? { ...x, sgpa: +e.target.value } : x))} aria-label="SGPA" />
                  <button className="btn-ghost text-danger" onClick={() => set('about', 'semesters', about.semesters.filter((_, j) => j !== i))} aria-label="Remove semester">✕</button>
                </div>
              ))}
            </div>
            <button className="btn-ghost mt-2" onClick={() => set('about', 'semesters', [...(about.semesters || []), { sem: (about.semesters?.length || 0) + 1, sgpa: 0 }])}>Add semester</button>
          </div>
          <button className="btn-gold" onClick={() => save({ about })}>Save about</button>
        </div>
      )}

      {tab === 'Social' && (
        <div className="max-w-2xl space-y-2">
          {c.socials.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input className="input !w-40" value={s.name} aria-label="Name" onChange={(e) => setC({ ...c, socials: c.socials.map((x, j) => j === i ? { ...x, name: e.target.value } : x) })} />
              <input className="input" value={s.url} aria-label="URL" onChange={(e) => setC({ ...c, socials: c.socials.map((x, j) => j === i ? { ...x, url: e.target.value } : x) })} />
              <button className="btn-ghost text-danger" onClick={() => setC({ ...c, socials: c.socials.filter((_, j) => j !== i) })} aria-label="Remove">✕</button>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button className="btn-ghost" onClick={() => setC({ ...c, socials: [...c.socials, { name: '', url: 'https://' }] })}>Add link</button>
            <button className="btn-gold" onClick={() => save({ socials: c.socials })}>Save links</button>
          </div>
        </div>
      )}

      {tab === 'Projects' && (
        <Crud resource="projects" blank={{ title: '', shortDescription: '', technologies: '', image: '', details: '', liveUrl: '', githubUrl: '' }}
          fields={[['title', 'Title'], ['shortDescription', 'Short description', 'area'], ['technologies', 'Technologies (comma-separated)'], ['image', 'Image URL'], ['details', 'Full details (logic, features, security)', 'area'], ['liveUrl', 'Live link'], ['githubUrl', 'GitHub repo link']]}
          preview={(f) => <ProjectCard p={{ ...f, technologies: toList(csv(f.technologies)) }} />} github />
      )}
      {tab === 'Achievements' && (
        <Crud resource="achievements" blank={{ title: '', type: 'Certification', organization: '', date: '', description: '', link: '' }}
          fields={[['title', 'Title'], ['type', 'Type (Certification, Hackathon, Milestone)'], ['organization', 'Organization'], ['date', 'Date'], ['description', 'Description', 'area'], ['link', 'Credential link']]}
          preview={(f) => <div className="glass p-5"><span className="badge">{f.type}</span><h3 className="mt-3 text-lg font-semibold">{f.title || 'Title'}</h3><p className="text-sm text-muted">{[f.organization, f.date].filter(Boolean).join(' · ')}</p><p className="mt-2 text-sm">{f.description}</p></div>} />
      )}
    </div>
  );
}
