# ProjectFlow

ProjectFlow is a learning project designed to develop and demonstrate full-stack development skills using a modern TypeScript-based technology stack.

The project uses a monorepo structure to keep the backend API and frontend application in a single repository.

## Technology Stack

### Backend

* [NestJS](https://nestjs.com/) — Backend application framework.
* TypeScript — Programming language.
* TypeORM — Object-relational mapper (ORM).
* PostgreSQL — Relational database.
* Jest — Automated testing.

### Frontend

* [Next.js](https://nextjs.org/) — React framework.
* React — User interface library.
* TypeScript — Programming language.
* Tailwind CSS — Styling framework.

### Infrastructure and Development Tools

* Docker Compose — Local PostgreSQL environment.
* npm workspaces — Dependency and monorepo management.
* Git — Version control.

## Repository Structure

```text
ProjectFlow/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── database/
│   │   │   │   ├── migrations/
│   │   │   │   ├── data-source.ts
│   │   │   │   └── database.module.ts
│   │   │   ├── entities/
│   │   │   │   └── customer.entity.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── test/
│   │   └── package.json
│   └── web/
├── infrastructure/
│   └── docker-compose.yml
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

The structure may evolve as new features and stories are implemented.

## Prerequisites

Install the following tools before starting development:

* Node.js 24.x, using the project's configured version where applicable.
* npm.
* Docker Desktop with Docker Compose.
* Git.
* Visual Studio Code or another suitable editor.

Verify the Node.js and npm installations:

```powershell
node --version
npm --version
```

Make sure Docker Desktop is running before starting the database.

## Getting Started

### 1. Install Dependencies

From the repository root, run:

```powershell
npm install
```

npm workspaces manage the dependencies for the applications in the repository.

### 2. Configure Environment Variables

The repository contains `.env.example`, which documents the environment variables required for local development.

Create your local environment file:

```powershell
Copy-Item .env.example .env
```

Open `.env` and replace the placeholder values with your local development settings.

The database configuration includes the following variables:

| Variable            | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `POSTGRES_DB`       | Database created by the PostgreSQL container.      |
| `POSTGRES_USER`     | PostgreSQL user created for the application.       |
| `POSTGRES_PASSWORD` | Password for the PostgreSQL user.                  |
| `DATABASE_HOST`     | Hostname used by the API to connect to PostgreSQL. |
| `DATABASE_PORT`     | PostgreSQL port used by the API.                   |
| `DATABASE_NAME`     | Database name used by the API.                     |
| `DATABASE_USER`     | PostgreSQL username used by the API.               |
| `DATABASE_PASSWORD` | Password used by the API.                          |

For the current local Docker configuration, the database is exposed on `localhost:5432`.

The `POSTGRES_*` variables configure the PostgreSQL container. The `DATABASE_*` variables configure the API's TypeORM connection.

Use matching database names, usernames, and passwords for the two sets of variables.

**Security:** Never commit `.env` to source control. It contains local configuration and potentially sensitive credentials. Commit `.env.example` instead, using placeholders rather than real secrets.

### 3. Start PostgreSQL

From the repository root, run:

```powershell
docker compose --env-file .env -f infrastructure/docker-compose.yml up -d
```

This starts PostgreSQL in the background.

Check the container status:

```powershell
docker compose --env-file .env -f infrastructure/docker-compose.yml ps
```

Wait until PostgreSQL reports a healthy status before proceeding.

To inspect the container logs:

```powershell
docker compose --env-file .env -f infrastructure/docker-compose.yml logs postgres
```

The database uses a named Docker volume to persist its data across container restarts.

Stopping the container does not delete the volume or its data.

### 4. Apply Database Migrations

ProjectFlow uses TypeORM migrations to manage database schema changes.

Automatic schema synchronization is disabled. Database changes should be represented by migrations rather than relying on TypeORM to modify the schema at application startup.

To inspect the migration status:

```powershell
npm run typeorm --workspace=apps/api -- migration:show -d src/database/data-source.ts
```

To apply pending migrations:

```powershell
npm run typeorm --workspace=apps/api -- migration:run -d src/database/data-source.ts
```

The migration commands are executed from the API workspace. The paths above are therefore relative to `apps/api`.

To generate a migration after changing an entity, use:

```powershell
npm run typeorm --workspace=apps/api -- migration:generate src/database/migrations/DescribeYourChange -d src/database/data-source.ts
```

Replace `DescribeYourChange` with a meaningful name for the schema change.

Review every generated migration before applying it. Migrations are version-controlled database changes and should be treated as part of the application's source code.

To inspect the migration status again after applying migrations:

```powershell
npm run typeorm --workspace=apps/api -- migration:show -d src/database/data-source.ts
```

### 5. Start the Backend API

From the repository root, run:

```powershell
npm run start:dev --workspace=apps/api
```

This starts the NestJS API in development mode.

The API currently exposes its health endpoint at:

```text
http://localhost:3000/health
```

Open that address in a browser or use the following PowerShell command to check the endpoint:

```powershell
Invoke-RestMethod http://localhost:3000/health
```

The health endpoint confirms that the API is responding. It should not be interpreted as a comprehensive database health check.

### 6. Stop PostgreSQL

When you finish working, stop the PostgreSQL container:

```powershell
docker compose --env-file .env -f infrastructure/docker-compose.yml down
```

This stops and removes the container and its Compose network, but preserves the named database volume.

To permanently delete the local database volume as well, you can use:

```powershell
docker compose --env-file .env -f infrastructure/docker-compose.yml down -v
```

**Warning:** The `-v` option deletes the database volume and its persisted data. Use it only when you intentionally want to reset the local database.

## Database Development

### Customer Entity

The initial domain model includes a `Customer` entity.

The entity currently contains:

* `id` — Database-generated integer primary key.
* `name` — Required string with a maximum length of 150 characters.
* `createdAt` — Timestamp generated by PostgreSQL when a record is created.

The entity maps to the `customers` table.

### Migration Strategy

The project uses code-first database development with TypeORM migrations.

The expected workflow is:

1. Create or modify an entity.
2. Generate a migration when a database schema change is required.
3. Review the generated migration.
4. Apply the migration to the development database.
5. Test the affected persistence behavior.
6. Commit the entity and migration together.

Do not enable automatic schema synchronization as a substitute for migrations.

## Automated Testing

### Unit Tests

Run the backend unit tests:

```powershell
npm test --workspace=apps/api
```

Unit tests should be designed to run without depending on a running PostgreSQL instance.

### Database Integration Tests

Database integration tests verify behavior that requires the real database.

Make sure Docker Desktop is running, the PostgreSQL container is healthy, and migrations have been applied before running:

```powershell
npm run test:integration --workspace=apps/api
```

These tests use the application's TypeORM data source and the configured local database.

Integration tests may modify database data while running. The current customer persistence test removes the record it creates.

### Build

Build the backend API:

```powershell
npm run build --workspace=apps/api
```

### Lint

Run the backend lint command:

```powershell
npm run lint --workspace=apps/api
```

Check `git status` after linting because the current lint script may automatically fix some issues.

## Development Principles

ProjectFlow follows these principles:

* Keep the backend and frontend in a single npm-workspaces repository.
* Use TypeScript for application code.
* Use PostgreSQL for relational persistence.
* Use TypeORM entities and migrations to manage the database schema.
* Keep database credentials out of source control.
* Separate unit tests from tests that require external infrastructure.
* Make changes incrementally and verify them before proceeding to the next story.
* Keep documentation aligned with the implemented functionality.

## Current Development Status

The initial setup story established the monorepo and application scaffolding.

The database integration story introduces:

* PostgreSQL running locally through Docker Compose.
* TypeORM configuration in the NestJS API.
* A `Customer` entity.
* An initial migration for the `customers` table.
* Database persistence verification.
* Documentation for local setup and database development.

Subsequent stories will build on this foundation to implement customer management and additional ERP functionality.
