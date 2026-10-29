import { useContent } from '../hooks/useData';
import { cgpa } from '../data/defaults';
import { Title, CountUp } from '../components/ui/bits';
import ClickButton from '../components/ui/ClickButton';

export default function About() {
  const { about } = useContent();
  return (
    <div className="section">
      <Title sub={about.degree}>About me</Title>
      <p className="max-w-2xl leading-relaxed">{about.bio}</p>
      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {[['10th', about.tenth], ['12th', about.twelfth]].map(([l, v]) => (
          <div key={l} className="glass p-5"><div className="text-sm text-muted">{l}</div><div className="mt-1 font-mono text-2xl text-ink">{v || '—'}</div></div>
        ))}
        <div className="glass p-5"><div className="text-sm text-muted">B.Tech CGPA</div><div className="mt-1 font-mono text-2xl text-accent">{cgpa(about.semesters)}</div></div>
      </div>
      <h3 className="mb-3 mt-10 text-xl font-semibold">Semester-wise SGPA</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(about.semesters || []).map((s) => (
          <div key={s.sem} className="glass p-4"><div className="text-xs text-muted">Semester {s.sem}</div>
            <div className="font-mono text-xl text-ink"><CountUp to={s.sgpa} decimals={2} /></div></div>
        ))}
      </div>
      <h3 className="mb-3 mt-10 text-xl font-semibold">Skills</h3>
      <div className="flex flex-wrap gap-2">{(about.skills || []).map((s) => <span key={s} className="badge">{s}</span>)}</div>
      {about.resumeUrl && (
        <ClickButton as="a" className="btn-gold mt-10" doneLabel="Opening resume" href={about.resumeUrl} target="_blank" rel="noreferrer noopener">Download resume</ClickButton>
      )}
    </div>
  );
}
