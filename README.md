# Double M Agency Platform

Production-oriented recruitment platform with a Vercel-hosted Next.js frontend and a HostAfrica-hosted Node.js API backed by MySQL. It intentionally uses direct `mysql2` queries and versioned SQL migrations; Prisma is not part of this project.

## Local development

The included ignored local environment files are configured for MySQL on `127.0.0.1`, user `root`, with no password.

```bash
npm install
npm --prefix backend install
npm --prefix backend run db:migrate
npm run dev:all
```

- Website: `http://localhost:3000`
- API health: `http://localhost:4000/health`

## Deployment boundary

- Deploy the repository root to Vercel.
- Deploy `backend/` to HostAfrica as a Node.js application.
- Configure production values from `.env.example` and `backend/.env.example` in each host's environment manager.
- Use a dedicated, least-privilege MySQL user in production. Never use the local root/no-password configuration outside development.

The `docs/` directory is local-only and excluded from Git and deployment.
