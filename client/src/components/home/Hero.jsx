import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ClickButton from '../ui/ClickButton';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const rise = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };

// Word Rotator
export function WordRotator({ words }) {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((n) => (n + 1) % words.length), 2400); return () => clearInterval(t); }, [words.length]);
  return (
    <span className="inline-block h-[1.4em] overflow-hidden align-bottom font-mono text-accent">
      <AnimatePresence mode="wait">
        <motion.span key={words[i]} className="inline-block" initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ duration: .35 }}>
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// Sale Pings / Status Pulse
export function StatusPulse({ text }) {
  return (
    <span className="inline-flex items-center gap-3 rounded-full border border-line bg-card/70 px-4 py-2 text-sm text-ink">
      <span className="relative flex h-2.5 w-2.5">
        <span className="ping-ring absolute inset-0 rounded-full bg-accent" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-accent" />
      </span>{text}
    </span>
  );
}

// Hero Reveal: one staggered entrance on page load
export default function Hero({ home, compact }) {
  const copyEmail = () => navigator.clipboard?.writeText(home.email || '').catch(() => {});
  return (
    <motion.section variants={stagger} initial="hidden" animate="show"
      className={`mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 ${compact ? 'py-6' : 'min-h-[88vh] py-16 md:grid-cols-[1.4fr_1fr]'}`}>
      <div>
        <motion.div variants={rise}><StatusPulse text={home.status} /></motion.div>
        <motion.h1 variants={rise} className="mt-6 font-bold leading-[1.05]" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>{home.headline}</motion.h1>
        <motion.p variants={rise} className="mt-5 text-xl text-ink">I'm a <WordRotator words={home.roles?.length ? home.roles : ['Developer']} /></motion.p>
        <motion.p variants={rise} className="mt-4 max-w-xl leading-relaxed">{home.bio}</motion.p>
        <motion.div variants={rise} className="mt-8 flex flex-wrap gap-3">
          <Link to="/projects" className="btn-gold">View projects</Link>
          {home.email
            ? <ClickButton className="btn-ghost" doneLabel="Email copied" onClick={copyEmail}>Copy email</ClickButton>
            : <Link to="/about" className="btn-ghost">About me</Link>}
            {/* <Link to="/projects" className="btn-gold">Old Site</Link> */}
        </motion.div>
      </div>
      <motion.div variants={rise} className="mx-auto w-full max-w-xs">
        <div className="glass aspect-square overflow-hidden p-2 shadow-[0_0_60px_rgba(74,222,154,.15)]">
          {home.heroImage
            ? <img src={home.heroImage} alt="Portrait" className="h-full w-full rounded-xl object-cover" />
            : <div className="flex h-full w-full items-center justify-center rounded-xl bg-card font-mono text-6xl text-accent">{'</>'}</div>}
        </div>
      </motion.div>
    </motion.section>
  );
}
