import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { defaults } from '../data/defaults';

export function useContent() {
  const [c, setC] = useState(defaults);
  useEffect(() => {
    api.getContent().then((d) => setC({
      home: { ...defaults.home, ...d.home }, about: { ...defaults.about, ...d.about },
      socials: d.socials?.length ? d.socials : defaults.socials,
      reviews: d.reviews?.length ? d.reviews : defaults.reviews,
    })).catch(() => {});
  }, []);
  return c;
}
export function useList(resource) {
  const [items, setItems] = useState([]);
  const [state, setState] = useState('loading');
  useEffect(() => {
    api.list(resource).then((d) => { setItems(d); setState('ok'); }).catch(() => setState('error'));
  }, [resource]);
  return [items, state];
}
