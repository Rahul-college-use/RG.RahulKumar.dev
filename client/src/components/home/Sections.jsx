import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CountUp, RollNumber, Spot, Title } from '../ui/bits';

// Count-up Stats
export function Stats({ items }) {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 sm:px-6 md:grid-cols-4">
      {items.map((s) => (
        <div key={s.label} className="glass p-5">
          <div className="font-mono text-3xl font-medium text-ink"><CountUp to={s.value} decimals={s.decimals || 0} />{s.suffix}</div>
          <div className="mt-1 text-sm text-muted">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// Bento Build + Cursor Tour
export function Bento({ skills, focus }) {
  return (
    <section className="section">
      <Title sub="What I work with every day.">Stack and focus</Title>
      <div className="grid auto-rows-[150px] grid-cols-2 gap-3 md:grid-cols-4">
        <Spot className="col-span-2 row-span-2 p-6">
          <h3 className="text-xl font-semibold">Core skills</h3>
          <div className="mt-4 flex flex-wrap gap-2">{skills.map((s) => <span key={s} className="badge">{s}</span>)}</div>
        </Spot>
        <Spot className="p-5"><h3 className="font-semibold">Frontend</h3><p className="mt-2 text-sm text-muted">React, Vite, Tailwind, PWAs</p></Spot>
        <Spot className="p-5"><h3 className="font-semibold">Backend</h3><p className="mt-2 text-sm text-muted">Express, REST, JWT, MongoDB</p></Spot>
        <Spot className="col-span-2 p-5"><h3 className="font-semibold">Currently</h3><p className="mt-2 text-sm text-muted">{focus}</p></Spot>
      </div>
    </section>
  );
}

// Review Shuffle
export function ReviewShuffle({ reviews }) {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((n) => (n + 1) % reviews.length), 5000); return () => clearInterval(t); }, [reviews.length]);
  const stack = [0, 1, 2].map((k) => reviews[(i + k) % reviews.length]);
  return (
    <section className="section">
      <Title sub="Tap the cards to shuffle.">What people say</Title>
      <div className="relative mx-auto h-56 max-w-xl cursor-pointer" onClick={() => setI((n) => (n + 1) % reviews.length)}>
        <AnimatePresence>
          {stack.map((r, k) => (
            <motion.figure key={r.name + r.text} layout className="glass absolute inset-x-0 top-0 p-6"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1 - k * .3, y: k * 14, scale: 1 - k * .05, zIndex: 3 - k }} exit={{ opacity: 0, x: -80, rotate: -4 }}>
              <blockquote className="text-ink">“{r.text}”</blockquote>
              <figcaption className="mt-4 text-sm text-muted">{r.name} · {r.role}</figcaption>
            </motion.figure>
          )).reverse()}
        </AnimatePresence>
      </div>
    </section>
  );
}

// Process Draw
const steps = ['Plan', 'Design', 'Build', 'Test', 'Ship'];
export function ProcessDraw() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section className="section" ref={ref}>
      <Title sub="How a project goes from idea to production.">My workflow</Title>
      <div className="relative">
        <svg className="absolute left-0 top-5 hidden h-2 w-full md:block" preserveAspectRatio="none" viewBox="0 0 100 2">
          <motion.line x1="5" y1="1" x2="95" y2="1" stroke="#4ADE9A" strokeWidth="0.4" vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 1.6, ease: 'easeInOut' }} />
        </svg>
        <div className="grid gap-4 md:grid-cols-5">
          {steps.map((s, i) => (
            <motion.div key={s} className="relative text-center" initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ delay: i * .3 }}>
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-accent bg-bg font-mono text-accent">{i + 1}</div>
              <div className="mt-3 font-display text-ink">{s}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Before / After slider
const messy = `function g(d){var r=[];for(var i=0;i<d.length;i++){
if(d[i].a==1){r.push(d[i].n)}}
return r}`;
const clean = `const getActiveNames = (users) =>
  users.filter((u) => u.isActive).map((u) => u.name);`;
export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  return (
    <section className="section">
      <Title sub="Drag the slider to compare.">Messy vs. production code</Title>
      <div className="glass relative mx-auto max-w-2xl overflow-hidden font-mono text-sm">
        <pre className="p-6 text-danger/90">{`// before\n${messy}`}</pre>
        <pre className="absolute inset-0 bg-card p-6 text-accent" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>{`// after\n${clean}`}</pre>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-gold" style={{ left: `${pos}%` }} />
        <input type="range" min="0" max="100" value={pos} onChange={(e) => setPos(+e.target.value)} aria-label="Compare before and after"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
      </div>
    </section>
  );
}

// Metric Roll
export function MetricRoll({ items }) {
  return (
    <section className="section">
      <div className="glass grid gap-6 p-8 text-center sm:grid-cols-3">
        {items.map((m) => (
          <div key={m.label}><div className="text-4xl text-ink"><RollNumber value={m.value} /></div><div className="mt-2 text-sm text-muted">{m.label}</div></div>
        ))}
      </div>
    </section>
  );
}

// Us vs Them
const rows = [
  ['Architecture', 'Modular services, one API layer', 'Logic scattered across components'],
  ['Security', 'JWT, sanitised input, lockout', 'Passwords checked in the client'],
  ['Performance', 'Lazy loading, cached offline (PWA)', 'Reloads everything every visit'],
  ['Code quality', 'Small functions, clear names', 'Copy-pasted blocks'],
];
export function UsVsThem() {
  return (
    <section className="section">
      <Title>My approach vs. the shortcut</Title>
      <div className="glass overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead><tr className="border-b border-line text-ink"><th className="p-4"></th><th className="p-4 text-accent">How I build</th><th className="p-4 text-muted">Typical shortcut</th></tr></thead>
          <tbody>{rows.map(([a, b, c]) => (
            <tr key={a} className="border-b border-line/50 last:border-0"><td className="p-4 font-medium text-ink">{a}</td><td className="p-4">{b}</td><td className="p-4 text-muted">{c}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  );
}
