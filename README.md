# React Spring Boot Mini-Eshop

Simple full‑stack mini e‑shop built with a Spring Boot backend and a Vite + React + TypeScript frontend.

This README explains the project's intent, technology stack, how to run it in development (locally and with Docker), what environment variables are required, and common build commands.

## What this project is

- Backend: Spring Boot (Java 21) providing REST endpoints for products, categories, orders, users and authentication (JWT). Integrations: PostgreSQL, Stripe, email sending, and scheduled tasks.
- Frontend: Vite + React + TypeScript application that consumes the backend API and implements shopping, cart, checkout, account management, and admin views.
- Dev tooling: Docker Compose for local stacks (Postgres + pgAdmin + backend), Maven wrapper for backend builds, and pnpm (preferred) / npm for the frontend.

## Architecture

- Backend: `backend/` — Spring Boot application (Java 21). Uses Spring Data JPA (Postgres), Spring Security (JWT), Stripe, Spring Mail and actuator endpoints.
- Frontend: `frontend/` — Vite + React + TypeScript app (React 19 + TanStack libraries, TailwindCSS). Development server runs on port 5173 by default.
- Database: PostgreSQL (defined in `backend/docker-compose.yaml`).

## Ports (defaults)

- Backend: http://localhost:8080
- Frontend (Vite dev): http://localhost:5173
- PostgreSQL: 5432
- pgAdmin: http://localhost:8081

## Prerequisites

- Java 21 (JDK 21) for backend development
- Maven (optional if you use the included `mvnw` wrapper)
- Node.js (16+ recommended) and pnpm (preferred) or npm/yarn for frontend
- Docker & Docker Compose (for easy local stack)

If you don't have pnpm, you can still use npm or yarn; the commands below use pnpm where applicable but notes include npm alternatives.

## Quickstart — Docker (recommended for a fast local stack)

1. Copy or create `backend/.env` with the environment variables listed below (an example is provided further down).
2. From the `backend/` folder run:

```bash
# from repository root
cd backend
docker compose up --build
```

This will start the backend (built from the `backend` Dockerfile), a Postgres container with a persistent volume, and pgAdmin on port 8081.

The frontend can be run separately (see local development below) and should point to the backend URL configured via `FRONTEND_URL` / `BASE_URL`.

## Local development (backend + frontend separately)

Backend (run with Maven wrapper):

```bash
# from repository root
cd backend
./mvnw spring-boot:run
```

Build and run the produced jar:

```bash
./mvnw clean package
java -jar target/*.jar
```

Frontend (pnpm preferred):

```bash
# from repository root
cd frontend
pnpm install
pnpm dev
# if you don't have pnpm, use: npm install && npm run dev
```

Open the frontend at http://localhost:5173. The frontend expects the backend API at the URL configured in the backend's env (default: http://localhost:8080).

## Environment variables (example .env for `backend/`)

Create `backend/.env` and set values appropriate for your environment. Minimal example for local development with Dockerized Postgres:

```env
# App
BASE_URL=http://localhost:8080
FRONTEND_URL=http://localhost:5173

# Database (used by Spring datasource URL below)
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/minieshop
SPRING_DATASOURCE_USERNAME=username
SPRING_DATASOURCE_PASSWORD=password

# JWT
JWT_SECRET_KEY=change_this_to_a_long_random_value

# Stripe (test keys)
STRIPE_PUBLISH_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Mail (if you want to test email sending)
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=you@example.com
MAIL_PASSWORD=secret
```

Notes:

- When running the backend with Docker Compose (from `backend/docker-compose.yaml`), the PostgreSQL service name is `postgres`. The example `SPRING_DATASOURCE_URL` uses that service name so the backend container can reach the DB.
- For local non-Docker development, set `SPRING_DATASOURCE_URL` to `jdbc:postgresql://localhost:5432/minieshop` (or your DB host).

## Useful commands

- Backend (in `backend/`):

  - `./mvnw spring-boot:run` — run backend in dev mode
  - `./mvnw clean package` — build jar
  - `docker compose up --build` — start backend + postgres + pgadmin via Docker Compose (from `backend/`)

- Frontend (in `frontend/`):
  - `pnpm install` — install deps (or `npm install`)
  - `pnpm dev` — start Vite dev server
  - `pnpm build` — build production bundle (runs `tsc -b && vite build`)
  - `pnpm preview` — preview production build

## Tests

- Backend tests are available under `backend/src/test`. Run them with:

```bash
cd backend
./mvnw test
```

## What to expect / features

- JWT authentication and user management
- Product listing, categories and simple admin CRUD
- Cart, orders and a Stripe-based checkout integration
- Email sending support (Spring Mail)
- Health and info endpoints via Spring Actuator

## Project layout (short)

- `backend/` — Spring Boot app, `pom.xml`, `Dockerfile`, `docker-compose.yaml`, `.env` usage
- `frontend/` — Vite + React app, `package.json`, TypeScript source under `src/`

## Contributing

PRs are welcome. For small changes:

1. Fork the repo
2. Create a feature branch
3. Open a PR describing the change

If you plan larger changes, open an issue first so we can discuss scope.
