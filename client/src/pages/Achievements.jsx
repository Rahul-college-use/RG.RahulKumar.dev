import { useList } from '../hooks/useData';
import { Title, Spot } from '../components/ui/bits';

export default function Achievements() {
  const [items, state] = useList('achievements');
  return (
    <div className="section">
      <Title sub="Certifications, hackathons and milestones.">Achievements</Title>
      {state === 'error' && <p className="text-danger">Couldn't reach the server.</p>}
      {state === 'ok' && !items.length && <p className="text-muted">No achievements yet. Add one from the admin dashboard.</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((a) => (
          <Spot key={a._id} className="p-5">
            <span className="badge">{a.type}</span>
            <h3 className="mt-3 text-lg font-semibold">{a.title}</h3>
            <p className="text-sm text-muted">{[a.organization, a.date].filter(Boolean).join(' · ')}</p>
            {a.description && <p className="mt-2 text-sm">{a.description}</p>}
            {a.link && <a className="mt-3 inline-block text-sm text-accent underline" href={a.link} target="_blank" rel="noreferrer noopener">View credential</a>}
          </Spot>
        ))}
      </div>
    </div>
  );
}
