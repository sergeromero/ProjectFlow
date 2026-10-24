# ProjectFlow

ProjectFlow is a learning application for tracking customers, service providers, services, service usage, and associated expenses.

The project is designed to develop practical skills with NestJS, TypeORM, PostgreSQL, Next.js, React, and Tailwind CSS while following production-oriented engineering practices.

## Technology Stack

### Backend

* NestJS 11
* TypeScript 5.9.3
* Node.js 24
* npm

### Frontend

* Next.js 16.2
* React 19.2
* TypeScript 5.9.3
* Tailwind CSS 4

### Development Tools

* Git
* VS Code
* Docker

## Repository Structure

```text
ProjectFlow/
├── apps/
│   ├── api/              # NestJS backend
│   └── web/              # Next.js frontend
├── infrastructure/       # Infrastructure configuration
├── docs/                 # Project documentation
├── .gitignore
├── package.json          # Root npm workspace configuration
├── package-lock.json     # Dependency lockfile
└── README.md
```

## Prerequisites

Install the following tools:

* Node.js 24
* npm
* Git
* Docker

The project uses npm workspaces to manage its backend and frontend from the repository root.

## Installation

Clone the repository and navigate to the project directory.

Install all workspace dependencies:

```powershell
npm install
```

## Running the Backend

From the repository root:

```powershell
npm run start:dev --workspace=apps/api
```

The backend listens on port 3000 by default.

### Health Endpoint

Send an HTTP GET request to:

```text
http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

## Running the Frontend

Open another terminal at the repository root:

```powershell
npm run dev --workspace=apps/web
```

Open the local address reported by the Next.js development server.

If port 3000 is occupied by the backend, Next.js can use another available port.

## Testing and Validation

### Backend

Run the unit tests:

```powershell
npm test --workspace=apps/api
```

Run linting:

```powershell
npm run lint --workspace=apps/api
```

Build the backend:

```powershell
npm run build --workspace=apps/api
```

### Frontend

Run linting:

```powershell
npm run lint --workspace=apps/web
```

Run TypeScript validation:

```powershell
npx tsc --noEmit -p apps/web/tsconfig.json
```

Build the frontend:

```powershell
npm run build --workspace=apps/web
```

## Current Status

Story 0.1 establishes the initial monorepo, scaffolds the NestJS and Next.js applications, configures the required framework versions, and verifies that both applications can run independently.

The PostgreSQL and TypeORM integration will be implemented in Story 0.2.

The customer management functionality will follow in Story 1.1.
