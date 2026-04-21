# SmartSeason Field Monitoring System

SmartSeason is a production-ready full-stack agriculture monitoring platform for tracking fields, crop progress, agent reports, and operational risk in a calm, data-driven interface.

## Project Structure

```text
smartseason-field-monitoring-system/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── types/
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── backend/
│   ├── apps/
│   │   ├── dashboard/
│   │   ├── fields/
│   │   └── users/
│   ├── smartseason/
│   ├── .env.example
│   ├── manage.py
│   └── requirements.txt
└── README.md
```

## Backend Overview

- `apps.users`
  - Custom user model with `admin` and `agent` roles
  - JWT login via `djangorestframework-simplejwt`
  - Register, login, current-user, and admin-only agent listing endpoints
- `apps.fields`
  - `Field` and `FieldUpdate` models
  - Role-aware field access
  - Admin field creation and assignment
  - Agent update submission and field timeline history
  - Computed field status:
    - `Completed` when stage is `Harvested`
    - `At Risk` when the last update is older than 7 days
    - `At Risk` when a field remains `Planted` for more than 14 days
    - `Active` otherwise
- `apps.dashboard`
  - Admin summary metrics
  - Agent summary metrics and recent updates

## API Endpoints

### Auth

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `GET /api/auth/me/`
- `GET /api/auth/agents/`

### Fields

- `GET /api/fields/`
- `POST /api/fields/`
- `GET /api/fields/{id}/`
- `PUT /api/fields/{id}/`
- `PATCH /api/fields/{id}/assign/`
- `POST /api/fields/{id}/update/`
- `GET /api/fields/{id}/updates/`

### Dashboard

- `GET /api/dashboard/admin/`
- `GET /api/dashboard/agent/`

## Frontend Overview

- React + TypeScript + Vite
- Tailwind theme extended with the requested earthy palette
- Role-aware navigation and dashboards
- Reusable UI components:
  - `Sidebar`
  - `Navbar`
  - `DashboardCard`
  - `FieldCard`
  - `StatusBadge`
  - `StageBadge`
- Pages:
  - Login/Register
  - Dashboard
  - Fields List
  - Field Details
  - Update Form

## Design Decisions

- The UI uses a dark control sidebar with light analytical work surfaces to make metrics and tables easy to scan.
- Status and stage colors follow the provided palette exactly so the interface reads quickly without adding visual clutter.
- The backend keeps business logic close to the `Field` model using a computed `status` property so dashboards and serializers stay simple.
- Admin and agent experiences share one frontend shell, but data visibility stays role-aware through API permissions and filtered querysets.

## Assumptions

- Self-registration is allowed for both admins and agents in this demo build.
- PostgreSQL is the target runtime database in all environments.
- Agents submit updates only for fields assigned to them.
- The admin assigns fields from the UI after agents exist.

## Environment Variables

### Backend (`backend/.env`)

Use `backend/.env.example` as a starting point:

```env
SECRET_KEY=replace-with-a-long-random-secret
DEBUG=False
ALLOWED_HOSTS=your-api-domain.com
DATABASE_URL=postgresql://user:password@host:5432/database
DB_NAME=smartseason
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
CSRF_TRUSTED_ORIGINS=https://your-frontend-domain.com,https://your-api-domain.com
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### Frontend (`frontend/.env`)

Use `frontend/.env.example`:

```env
VITE_API_URL=https://your-api-domain.com/api
```

## Production Notes

- Set `VITE_API_URL` in the frontend environment for your deployed API. The frontend now requires this in production builds instead of silently falling back to localhost.
- Set `DEBUG=False` in production.
- Set a real `SECRET_KEY` in production. The backend now refuses to start with an empty secret key when `DEBUG=False`.
- Update `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `CSRF_TRUSTED_ORIGINS` to your real deployment domains before going live.
- Keep `.env` files out of git and provide values through your hosting platform's environment settings where possible.

## Vercel + Render Deployment

### Frontend on Vercel

- Root directory: `frontend`
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable:

```env
VITE_API_URL=https://your-render-api.onrender.com/api
```

- `frontend/vercel.json` is included so React Router routes rewrite to `index.html` correctly on Vercel.

### Backend on Render

- Service type: `Web Service`
- Root directory: `backend`
- Build command:

```bash
./build.sh
```

- Start command:

```bash
gunicorn smartseason.wsgi:application
```

- Recommended environment variables in Render:

```env
SECRET_KEY=your-real-secret-key
DEBUG=False
DATABASE_URL=<use Render Postgres Internal or External Database URL>
ALLOWED_HOSTS=your-render-api.onrender.com
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-vercel-app.vercel.app,https://your-render-api.onrender.com
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

- Render automatically provides `RENDER_EXTERNAL_HOSTNAME`, and the Django settings now use it to help with host and CSRF handling.
- The backend now supports `DATABASE_URL`, uses `gunicorn`, and serves collected static files with WhiteNoise.

### Render Postgres

- Create a PostgreSQL database in Render.
- Copy the database connection string into the backend service's `DATABASE_URL`.
- After the first deploy, seed demo data with:

```bash
python manage.py seed_demo_data
```

## Setup Instructions

### 1. Backend setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo_data
python manage.py runserver
```

### 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`

Backend default URL: `http://127.0.0.1:8000`
