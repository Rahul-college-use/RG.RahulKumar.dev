import { useEffect, useState } from 'react';
import { api, errMsg } from '../services/api';
import Dashboard from './Dashboard';

export default function Admin() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('admin_token'));
  useEffect(() => {
    const out = () => setAuthed(false);
    window.addEventListener('admin-logout', out);
    return () => window.removeEventListener('admin-logout', out);
  }, []);
  if (authed) return <Dashboard onLogout={() => { localStorage.removeItem('admin_token'); setAuthed(false); }} />;
  return <Login onDone={() => setAuthed(true)} />;
}

function Login({ onDone }) {
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');
  const [locked, setLocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setMsg('');
    try { const { token } = await api.login(pw); localStorage.setItem('admin_token', token); onDone(); }
    catch (err) {
      const d = err.response?.data;
      setLocked(!!d?.locked);
      setMsg(d?.attemptsLeft != null && !d.locked ? `${d.message} ${d.attemptsLeft} attempt(s) left.` : errMsg(err));
    } finally { setBusy(false); setPw(''); }
  };
  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <form onSubmit={submit} className="glass space-y-4 p-6">
        <h1 className="text-2xl font-bold">Admin login</h1>
        <input className="input" type="password" autoComplete="current-password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} disabled={locked || busy} required />
        {msg && <p role="alert" className="text-sm text-danger">{msg}</p>}
        <button className="btn-gold w-full" disabled={locked || busy}>{busy ? 'Checking…' : locked ? 'Locked' : 'Log in'}</button>
        <p className="text-xs text-muted">Five wrong attempts lock this device out for one hour.</p>
      </form>
    </div>
  );
}
