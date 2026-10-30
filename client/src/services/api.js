// Single source of API configuration — every request in the app goes through this file.
import axios from 'axios';

const http = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://rgrahulkumardev-one.vercel.app/api', timeout: 10000 });

http.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('admin_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
http.interceptors.response.use((r) => r, (err) => {
  if (err.response?.status === 401 && localStorage.getItem('admin_token')) {
    localStorage.removeItem('admin_token');
    window.dispatchEvent(new Event('admin-logout'));
  }
  return Promise.reject(err);
});

export const errMsg = (e) => e.response?.data?.message || 'Something went wrong. Check your connection and try again.';

export const api = {
  login: (password) => http.post('/auth/login', { password }).then((r) => r.data),
  getContent: () => http.get('/content').then((r) => r.data),
  saveContent: (patch) => http.put('/content', patch).then((r) => r.data),
  list: (res) => http.get(`/${res}`).then((r) => r.data),
  create: (res, body) => http.post(`/${res}`, body).then((r) => r.data),
  update: (res, id, body) => http.put(`/${res}/${id}`, body).then((r) => r.data),
  remove: (res, id) => http.delete(`/${res}/${id}`).then((r) => r.data),
  githubRepos: (user) => http.get(`/projects/github/${encodeURIComponent(user)}`).then((r) => r.data),
};
