# Authix Platform Monorepo

Beginner-friendly starter for a multi-tenant mentorship SaaS with MERN + Tailwind + Stripe Connect.

## Monorepo File Structure

```text
Authix/
├── Frontend/
│   └── authixui/
│       ├── src/
│       │   ├── components/
│       │   │   ├── common/Sidebar.js
│       │   │   └── dashboard/{AdminView,MentorView,StudentView}.js
│       │   ├── context/ThemeContext.js
│       │   ├── data/mockTenant.js
│       │   ├── layouts/DashboardLayout.js
│       │   ├── pages/{LandingPage,AuthHubPage,DashboardPage}.js
│       │   ├── App.js
│       │   └── index.js
│       ├── .env.example
│       ├── tailwind.config.js
│       └── postcss.config.js
└── Backend/
    └── server/
        ├── src/
        │   ├── config/{db.js,env.js}
        │   ├── controllers/{auth,admin,mentor,student}Controller.js
        │   ├── middleware/{checkTenant,auth}.js
        │   ├── models/{User,Course,Enrollment}.js
        │   ├── routes/{auth,admin,mentor,student}Routes.js
        │   ├── services/stripeService.js
        │   └── server.js
        ├── .env.example
        └── package.json
```

## NPM Install Commands

### Frontend

```bash
cd Frontend/authixui
npm install
npm install react-router-dom tailwindcss postcss autoprefixer
```

### Backend

```bash
cd Backend/server
npm install
npm install express mongoose cors dotenv jsonwebtoken bcryptjs stripe
npm install -D nodemon
```

## Environment Setup

1. Frontend:
   - Copy `Frontend/authixui/.env.example` to `Frontend/authixui/.env`.
2. Backend:
   - Copy `Backend/server/.env.example` to `Backend/server/.env`.
3. Put real MongoDB + Stripe credentials in backend `.env`.

## Run Commands

Open two terminals from repo root.

### Terminal 1 (Backend)

```bash
cd Backend/server
npm run dev
```

### Terminal 2 (Frontend)

```bash
cd Frontend/authixui
npm start
```

## Block-by-Block Build Guide

1. **Tenant foundation**
   - Add `tenantId` to every business schema (`User`, `Course`, `Enrollment`).
   - Add global `checkTenant` middleware and require `x-tenant-id` header.

2. **Role security**
   - Use JWT in `requireAuth`.
   - Enforce role access with `permit('admin'|'mentor'|'student')`.

3. **Monetization**
   - Use Stripe Connect in `stripeService.js`.
   - Keep a 10% `application_fee_amount`; transfer 90% to mentor account.

4. **Frontend experience**
   - `LandingPage`: Hero + mentor search + pricing cards.
   - `AuthHubPage`: Login/signup with role select + Admin MFA field.
   - `DashboardPage`: Role-driven sidebar + Admin/Mentor/Student views.
   - `ThemeContext`: apply current tenant logo/colors globally.

## How `tenantId` Prevents Data Leakage

- Every document stores `tenantId`, so each record is explicitly owned by one organization.
- `checkTenant` puts the header tenant into `req.tenantId` for every request.
- Controllers query with `tenantId: req.tenantId` (example: `User.find({ tenantId: req.tenantId })`).
- Even if two tenants have identical user/course IDs in requests, cross-tenant records are excluded by query filter.
- Role checks run after tenant checks, so a valid Admin from tenant A cannot access tenant B resources.
