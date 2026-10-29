import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

const tabs = [['/', 'Home'], ['/about', 'About'], ['/projects', 'Projects'], ['/achievements', 'Achievements'], ['/social', 'Social']];
const cls = ({ isActive }) => `rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-card2 text-accent' : 'text-body hover:text-ink'}`;

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="font-display text-lg font-bold text-ink">RG. — Rahul Kumar<span className="text-accent">.dev</span></Link>
          <div className="hidden gap-1 md:flex">
            {tabs.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={cls}>{l}</NavLink>)}
            <NavLink to="/admin" className={cls}>Admin</NavLink>
          </div>
          <button className="btn-ghost md:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>{open ? '✕' : '☰'}</button>
        </nav>
        {open && (
          <div className="grid gap-1 border-t border-line/60 px-4 py-3 md:hidden" onClick={() => setOpen(false)}>
            {[...tabs, ['/admin', 'Admin']].map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={cls}>{l}</NavLink>)}
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="border-t border-line/60 py-8 text-center text-sm text-muted">Built with the MERN stack · installable as an app</footer>
    </>
  );
}
