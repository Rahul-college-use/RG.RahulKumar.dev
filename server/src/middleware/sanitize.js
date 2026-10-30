// import sanitizeHtml from 'sanitize-html';
// const clean = (v) =>
//   typeof v === 'string' ? sanitizeHtml(v, { allowedTags: [], allowedAttributes: {} }).trim()
//   : Array.isArray(v) ? v.map(clean)
//   : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, clean(x)]))
//   : v;
// export default (req, _res, next) => { if (req.body) req.body = clean(req.body); next(); };

// Native JavaScript se HTML tags remove karne ka function
const stripHtmlTags = (str) => {
  if (typeof str !== 'string') return str;
  // Yeh regex saare HTML tags ko hata kar extra spaces trim kar deta hai
  return str.replace(/<[^>]*>?/gm, '').trim();
};

const clean = (v) =>
  typeof v === 'string' ? stripHtmlTags(v)
  : Array.isArray(v) ? v.map(clean)
  : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, clean(x)]))
  : v;

export default (req, _res, next) => { 
  if (req.body) req.body = clean(req.body); 
  next(); 
};