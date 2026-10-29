import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export function CountUp({ to, decimals = 0, duration = 1400 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const end = Number(to) || 0, t0 = performance.now();
    let id;
    const tick = (t) => {
      const p = Math.min((t - t0) / duration, 1);
      setV(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [inView, to, duration]);
  return <span ref={ref}>{v.toFixed(decimals)}</span>;
}

// Price / Metric Roll: odometer-style digits
export function RollNumber({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const digits = String(value).split('');
  return (
    <span ref={ref} className="inline-flex font-mono tabular-nums" aria-label={String(value)}>
      {digits.map((d, i) => /\d/.test(d) ? (
        <span key={i} className="inline-block h-[1.2em] overflow-hidden leading-[1.2em]" aria-hidden>
          <span className="flex flex-col transition-transform duration-[1400ms] ease-out"
            style={{ transform: `translateY(-${inView ? Number(d) * 1.2 : 0}em)`, transitionDelay: `${i * 90}ms` }}>
            {[0,1,2,3,4,5,6,7,8,9].map((n) => <span key={n} className="h-[1.2em]">{n}</span>)}
          </span>
        </span>
      ) : <span key={i} className="leading-[1.2em]">{d}</span>)}
    </span>
  );
}

export const Spot = ({ className = '', children, ...p }) => (
  <div className={`spot glass transition ${className}`} {...p}
    onMouseMove={(e) => {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
      e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
    }}>{children}</div>
);

export const Title = ({ children, sub }) => (
  <div className="mb-8"><h2 className="text-3xl sm:text-4xl font-bold">{children}</h2>{sub && <p className="mt-2 max-w-xl text-muted">{sub}</p>}</div>
);
