import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Click Success: confetti burst + checkmark morph on click
export default function ClickButton({ children, doneLabel = 'Done', onClick, className = 'btn-gold', as = 'button', ...rest }) {
  const [burst, setBurst] = useState(0);
  const [done, setDone] = useState(false);
  const Tag = motion[as];
  const handle = (e) => {
    onClick?.(e);
    setBurst((b) => b + 1); setDone(true);
    setTimeout(() => setDone(false), 1600);
  };
  return (
    <Tag className={`relative ${className}`} onClick={handle} whileTap={{ scale: 0.95 }} {...rest}>
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.span key="ok" className="flex items-center gap-2" initial={{ opacity: 0, scale: .6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <motion.path d="M5 12l5 5L20 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .35 }} />
            </svg>{doneLabel}
          </motion.span>
        ) : (
          <motion.span key="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{children}</motion.span>
        )}
      </AnimatePresence>
      {burst > 0 && <Confetti key={burst} />}
    </Tag>
  );
}

const colors = ['#4ADE9A', '#F2C46D', '#DAF1DE', '#8EB69B'];
function Confetti() {
  const bits = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2 + Math.random() * 0.4, d = 50 + Math.random() * 40;
    return { x: Math.cos(a) * d, y: Math.sin(a) * d, c: colors[i % 4], r: Math.random() * 360 };
  });
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
      {bits.map((b, i) => (
        <motion.span key={i} className="absolute h-2 w-2 rounded-sm" style={{ background: b.c }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }} animate={{ x: b.x, y: b.y, opacity: 0, rotate: b.r }} transition={{ duration: .8, ease: 'easeOut' }} />
      ))}
    </span>
  );
}
