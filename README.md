# Portfolio + CMS (MERN, PWA)

React + Vite + Tailwind client, Node + Express + MongoDB API. Dark emerald theme.

## Run it
1. **API**
   ```
   cd server && npm install && cp .env.example .env
   npm run hash -- "your-admin-password"   # paste the output into ADMIN_PASSWORD_HASH in .env
   # set MONGO_URI and a long random JWT_SECRET, then:
   npm run seed   # optional sample data
   npm run dev
   ```
2. **Client**
   ```
   cd client && npm install && cp .env.example .env
   npm run dev      # http://localhost:5173
   ```
3. Open `/admin` and log in with the password you hashed.

## Where things are
- `client/src/services/api.js` is the only file that talks to the API (base URL from `VITE_API_URL`).
- `client/src/components/home/` and `components/ui/` hold the 12 landing interactions.
- `client/vite.config.js` configures the PWA manifest and service worker. Test it with `npm run build && npm run preview`.
- Admin lockout: 5 wrong passwords lock that IP for 1 hour (`server/src/routes/auth.js`).
- Security: helmet, CORS allow-list, Mongo operator sanitising, HTML stripping on all input, JWT (2h), rate limiting.

## Deploy notes
Set `CLIENT_ORIGIN` on the API to your site URL, and `VITE_API_URL` on the client to your API URL + `/api`.
