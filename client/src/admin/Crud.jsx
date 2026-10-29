import { useEffect, useState } from 'react';
import { api, errMsg } from '../services/api';

const asText = (f) => ({ ...f, technologies: Array.isArray(f.technologies) ? f.technologies.join(', ') : f.technologies });

export default function Crud({ resource, blank, fields, preview, github }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');
  const [repos, setRepos] = useState([]);
  const [ghUser, setGhUser] = useState('');

  const load = () => api.list(resource).then(setItems).catch((e) => setMsg(errMsg(e)));
  useEffect(() => { load(); }, [resource]);

  const submit = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      editing ? await api.update(resource, editing, form) : await api.create(resource, form);
      setForm(blank); setEditing(null); setMsg('Saved'); load();
    } catch (err) { setMsg(errMsg(err)); }
  };
  const del = async (id) => {
    if (!window.confirm('Delete this item? This can\'t be undone.')) return;
    try { await api.remove(resource, id); load(); } catch (err) { setMsg(errMsg(err)); }
  };
  const fetchRepos = async () => { try { setRepos(await api.githubRepos(ghUser)); } catch (err) { setMsg(errMsg(err)); } };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <form onSubmit={submit} className="space-y-3">
          <h2 className="text-xl font-semibold">{editing ? 'Edit item' : 'Add new'}</h2>
          {fields.map(([k, label, kind]) => (
            <label key={k} className="block"><span className="mb-1 block text-sm text-muted">{label}</span>
              {kind === 'area'
                ? <textarea rows={4} className="input" value={form[k] || ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                : <input className="input" value={form[k] || ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} required={k === 'title'} />}
            </label>
          ))}
          {msg && <p role="status" className={`text-sm ${msg === 'Saved' ? 'text-accent' : 'text-danger'}`}>{msg}</p>}
          <div className="flex gap-2"><button className="btn-gold">{editing ? 'Update' : 'Create'}</button>
            {editing && <button type="button" className="btn-ghost" onClick={() => { setEditing(null); setForm(blank); }}>Cancel</button>}</div>
        </form>
        {github && (
          <div className="glass mt-8 p-4">
            <h3 className="font-semibold">Import from GitHub</h3>
            <div className="mt-2 flex gap-2"><input className="input" placeholder="GitHub username" value={ghUser} onChange={(e) => setGhUser(e.target.value)} /><button className="btn-ghost" onClick={fetchRepos}>Fetch</button></div>
            <ul className="mt-3 space-y-2">{repos.map((r) => (
              <li key={r.githubUrl} className="flex items-center justify-between gap-2 text-sm"><span className="truncate">{r.title}</span>
                <button className="btn-ghost !px-3 !py-1" onClick={() => { setForm(asText(r)); setEditing(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Use</button></li>
            ))}</ul>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div><p className="mb-2 text-sm text-muted">Live preview</p>{preview(form)}</div>
        <p className="text-sm text-muted">Existing ({items.length})</p>
        {items.map((it) => (
          <div key={it._id} className="glass flex items-center justify-between gap-3 p-3">
            <span className="truncate text-ink">{it.title}</span>
            <div className="flex gap-2">
              <button className="btn-ghost !px-3 !py-1" onClick={() => { setEditing(it._id); setForm(asText(it)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</button>
              <button className="btn-ghost !px-3 !py-1 text-danger" onClick={() => del(it._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
