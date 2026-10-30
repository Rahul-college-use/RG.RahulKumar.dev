import { useContent } from '../hooks/useData';
import { Title, Spot } from '../components/ui/bits';

export default function Social() {
  const { socials } = useContent();
  return (
    <div className="section">
      <Title sub="Find me and my work here.">Social</Title>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {socials.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noreferrer noopener" className="block">
            <Spot className="p-6"><div className="font-display text-xl text-ink">{s.name}</div></Spot>
          </a>
        ))}
      </div>
    </div>
  );
}
