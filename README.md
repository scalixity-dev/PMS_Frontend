# PMS Frontend (React + Vite)

Property Management System frontend. 4 role-based dashboards: **Property Manager**, **Tenant**, **Service Provider**, **Admin**. Plus a public marketing website.

## Stack

- **Framework:** React 19 + Vite 7 + TypeScript
- **Routing:** React Router v7
- **State:** Zustand (persisted) + TanStack React Query v5
- **Styling:** Tailwind CSS v4
- **Forms:** Controlled components (no Formik/RHF)
- **Drag & drop:** @dnd-kit
- **Charts:** Recharts
- **Maps:** Google Maps API
- **Payments:** Stripe (integrated, not fully wired)
- **Build:** Vite (ESM), TypeScript strict mode
- **Real-time:** Socket.IO for chat

---

## 1. Setup

### Prerequisites
- Node.js 22.x
- npm or pnpm
- Backend running (see `../Pms_backend_fastify/README.md`)

### Install
```bash
cd PMS_Frontend
npm install
# or
pnpm install
```

### Environment Variables — `.env`

```env
# Backend API
VITE_API_BASE_URL=http://localhost:3000

# AI Chat (optional)
VITE_AI_CHAT_API_URL=http://localhost:8000
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/...

# Google Maps (for address autocomplete)
VITE_GOOGLE_MAPS_API_KEY=<your-key>

# Stripe (optional, for payment UI)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Production:**
```env
VITE_API_BASE_URL=https://api.your-domain.com
```

---

## 2. Run

### Development
```bash
npm run dev
```
Opens at `http://localhost:5173`.

### Production build
```bash
npm run build          # tsc + vite build → outputs to dist/
npm run preview        # local preview of dist/
```

### Lint
```bash
npm run lint
```

---

## 3. Project Structure

```
src/
├── pages/
│   ├── Dashboard/              # Property Manager portal
│   │   ├── Dashboard.tsx       # PM home (charts, stats)
│   │   ├── features/           # Properties, Units, Tenants, Leases, etc.
│   │   └── settings/           # PM settings (account, rental, team, etc.)
│   ├── userdashboard/          # Tenant portal
│   │   ├── UserDashboard.tsx
│   │   ├── features/
│   │   │   ├── Profile/        # Profile + Security + Notifications + Renter profile
│   │   │   ├── Properties/     # Tenant property browsing
│   │   │   ├── Applications/   # Rental applications
│   │   │   ├── Leases/
│   │   │   ├── Requests/       # Maintenance requests
│   │   │   ├── Transactions/
│   │   │   └── Settings/
│   ├── ServiceDashboard/       # Service Provider portal
│   ├── Admin/                  # Admin portal
│   ├── basewebsite/            # Marketing site (public)
│   ├── login/                  # Login flow
│   └── register/               # Registration flow
├── hooks/                      # React Query hooks (one per feature)
├── services/                   # API service layer (fetch wrappers)
│   └── utils/unwrapResponse.ts # Pagination-safe array unwrap helper
├── config/
│   └── api.config.ts           # All API endpoint URLs centralized
├── stores/                     # Zustand stores (persisted)
├── components/                 # Shared UI components
├── context/                    # React context providers
└── utils/                      # Shared helpers
```

---

## 4. Architecture

### Data flow
```
Component → React Query hook → Service (fetch) → Backend API
                                      ↓
                            Zustand store (UI state only)
```

### Service layer pattern
Each service in `services/*.service.ts` has:
- `getAll(filters?)` — list (unwraps pagination response)
- `getOne(id)` — single
- `create(data)` — POST
- `update(id, data)` — PATCH
- `delete(id)` — DELETE

**All `getAll()` methods safely handle both array and `{data, pagination}` responses** — see `services/utils/unwrapResponse.ts`.

### Cache invalidation
All mutations in hooks (`use*Mutation`) invalidate the relevant query key on success. No manual refetch needed.

---

## 5. Key Features

### Pagination Pattern (frontend)
```ts
const { data } = useQuery({
  queryFn: () => someService.getAll({ page: 1, limit: 10, search: 'foo' }),
});
// data is guaranteed array, never pagination object
```

If you need pagination metadata:
```ts
// Service returns { data, pagination } — fetch raw response for metadata
```

### Auto-save settings
`UserNotifications` saves each toggle change to API instantly — no Save button. Pattern: local state updates immediately, `persist()` fires mutation in background.

### Role-based routing
`context/UserRoleContext.tsx` determines role post-login. Routes wrapped in role guards:
- PROPERTY_MANAGER → `/dashboard/*`
- TENANT → `/userdashboard/*`
- SERVICE_PROVIDER → `/servicedashboard/*`
- ADMIN → `/admin/*`

---

## 6. Deployment

### Production build
```bash
npm run build
```
Output: `dist/` folder — static files only.

### Deploy targets

| Platform | Command |
|---|---|
| **Vercel** | `vercel --prod` (auto-detects Vite) |
| **Netlify** | `netlify deploy --prod --dir=dist` |
| **Cloudflare Pages** | connect repo, build cmd `npm run build`, output `dist` |
| **S3 + CloudFront** | `aws s3 sync dist/ s3://bucket/` |
| **Nginx** | serve `dist/` as static root, fallback to `index.html` for SPA routing |

### Nginx config (SPA fallback)
```nginx
location / {
  root /var/www/pms/dist;
  try_files $uri $uri/ /index.html;
}
```

### Environment
Set `VITE_API_BASE_URL` at build time (Vite embeds it into the bundle). Rebuild after env change.

### Bundle size note
Current bundle is ~15MB (~4MB gzipped). To reduce, add manual chunks in `vite.config.ts`:
```ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
        charts: ['recharts'],
        maps: ['@react-google-maps/api'],
      },
    },
  },
},
```

---

## 7. Common Issues

| Symptom | Fix |
|---|---|
| `TypeError: x.map is not a function` | API returned pagination object instead of array. Service layer should unwrap — check `services/utils/unwrapResponse.ts` is used. |
| CORS errors | Backend `FRONTEND_URL` env doesn't match this deployment's domain |
| Login works but protected routes redirect to login | Cookie not set — check backend cookie config + `credentials: 'include'` in fetch |
| Google Maps autocomplete blank | `VITE_GOOGLE_MAPS_API_KEY` missing or API not enabled in GCP |
| "w.map" minified error after login (prod only) | Older build before pagination-unwrap fix. Rebuild + redeploy. |
| Blank page on refresh at `/dashboard/foo` | SPA fallback not configured — see Nginx config above |

---

## 8. Tenant Settings Wiring Status

As of latest commit:

| Page | Status | Endpoint |
|---|---|---|
| Profile (personal info + address) | ✅ Wired | `PATCH /auth/profile` |
| Change Password | ✅ Wired | `POST /auth/change-password` |
| Notifications | ✅ Wired (auto-save) | `GET/PATCH /notifications/settings` |
| Public Renter Profile | ✅ Wired | `GET/POST /tenant/preferences` |
| Security (2FA + sessions) | ❌ Not wired | Needs TOTP lib + sessions table |
| My Cards | ❌ Not wired | Needs Stripe integration |

---

## 9. Testing a Feature Locally

1. Start backend: `cd ../Pms_backend_fastify && pnpm start:dev`
2. Start frontend: `npm run dev`
3. Register a tenant via `/register/tenant`
4. Verify email via OTP (check backend console for OTP in dev mode)
5. Log in → redirects to `/userdashboard`

---

## 10. Related Docs

- `../Pms_backend_fastify/README.md` — backend setup
- `../googlecalender.md` — Google Calendar OAuth setup
- `../DEPLOYMENT_STATUS.md` — deploy checklist
- `../FINAL_VERIFICATION_CHECKLIST.md` — QA checklist
