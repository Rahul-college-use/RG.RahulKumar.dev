import sanitizeHtml from 'sanitize-html';
const clean = (v) =>
  typeof v === 'string' ? sanitizeHtml(v, { allowedTags: [], allowedAttributes: {} }).trim()
  : Array.isArray(v) ? v.map(clean)
  : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, clean(x)]))
  : v;
export default (req, _res, next) => { if (req.body) req.body = clean(req.body); next(); };
