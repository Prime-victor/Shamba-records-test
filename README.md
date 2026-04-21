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
SECRET_KEY=django-insecure-change-me
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=smartseason
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (`frontend/.env`)

Use `frontend/.env.example`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
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

## Demo Accounts

- Admin
  - Email: `admin@smartseason.io`
  - Password: `Admin123!`
- Agent A
  - Email: `agent.a@smartseason.io`
  - Password: `Agent123!`
- Agent B
  - Email: `agent.b@smartseason.io`
  - Password: `Agent123!`

## Notes

- The repository originally contained empty `Backend/` and `Frontend/` folders. The runnable application is implemented in `backend/` and `frontend/` to match the requested structure.
- Dependencies were not installed in this workspace, so the final verification in this delivery is limited to static structure and code review.
