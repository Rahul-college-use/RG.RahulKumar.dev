import { useContent, useList } from '../hooks/useData';
import { cgpa } from '../data/defaults';
import Hero from '../components/home/Hero';
import { Stats, Bento, ReviewShuffle, ProcessDraw, BeforeAfter, MetricRoll, UsVsThem } from '../components/home/Sections';

export default function Home() {
  const { home, about, reviews } = useContent();
  const [projects] = useList('projects');
  const [achievements] = useList('achievements');
  const g = parseFloat(cgpa(about.semesters)) || 0;
  const stats = [
    { label: 'B.Tech CGPA', value: g, decimals: 2 },
    { label: 'GitHub commits', value: home.stats?.commits ?? 0, suffix: '+' },
    { label: 'Projects built', value: projects.length },
    { label: 'Hackathons', value: home.stats?.hackathons ?? achievements.filter((a) => /hackathon/i.test(a.type)).length },
  ];
  const metrics = [
    { label: 'Projects shipped', value: projects.length || 3 },
    { label: 'Technologies used', value: about.skills?.length || 7 },
    { label: 'Commits pushed', value: home.stats?.commits ?? 500 },
  ];
  return (
    <>
      <Hero home={home} />
      <Stats items={stats} />
      <Bento skills={about.skills || []} focus={home.focus || 'Full-stack projects, DSA practice and open-source contributions.'} />
      <ReviewShuffle reviews={reviews} />
      <ProcessDraw />
      <BeforeAfter />
      <MetricRoll items={metrics} />
      <UsVsThem />
    </>
  );
}
