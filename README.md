# API Solid — GymPass Style App

A study project from the [Rocketseat](https://rocketseat.com.br) Node.js bootcamp. A REST API for a GymPass-style application built with SOLID principles and best practices.

## Tech Stack

**Core**
- Node.js 20+ + TypeScript
- Fastify — high-performance web framework
- Prisma — type-safe ORM
- @prisma/adapter-pg — PostgreSQL adapter for Prisma
- tsx — TypeScript executor for development

**Database & Utilities**
- PostgreSQL — relational database
- pg — PostgreSQL client driver
- dayjs — date/time manipulation library
- dotenv — environment variables loader

**Validation & Schema**
- Zod — runtime schema validation

**Authentication**
- @fastify/jwt — JWT-based authentication
- @fastify/cookie — HTTP-only cookie support for refresh tokens

**Testing & Quality**
- Vitest — unit testing framework with coverage
- Supertest — HTTP API integration testing
- Biome — fast linter and formatter

**Security & Build**
- bcryptjs — password hashing
- tsup — TypeScript bundler
- Docker — containerized PostgreSQL

## Database Schema

- **User** — app users with hashed passwords and role (MEMBER / ADMIN)
- **Gym** — gyms with geolocation (latitude/longitude)
- **CheckIn** — check-in records linking users to gyms

## Features (Functional Requirements)

- [x] User registration
- [x] User authentication
- [x] Get logged-in user profile
- [x] Get check-in count for logged-in user
- [x] User check-in history
- [x] Search nearby gyms
- [x] Search gyms by name
- [x] Perform gym check-in
- [x] Validate user check-in
- [x] Register a gym

## Business Rules

- [x] No duplicate email registration
- [x] Max 1 check-in per day per user
- [x] Check-in only allowed within 100m of the gym
- [x] Check-in validation window: 20 minutes after creation
- [x] Only admins can validate check-ins
- [x] Only admins can register gyms

## Non-Functional Requirements

- [x] Passwords must be hashed
- [x] PostgreSQL for data persistence
- [x] All lists paginated with 20 items per page
- [x] JWT-based authentication with refresh token via HTTP-only cookie

## Testing

### Test Structure

- **Unit tests** — business logic in `src/use-cases/*.spec.ts`
- **E2E tests** — API endpoints in `src/http/controllers/*.spec.ts`

### Schema Isolation

Tests use a custom Prisma Vitest environment (`prisma/vitest-environment-prisma/prisma-test-environment.ts`) that ensures complete data isolation:

- **Per-test schemas**: Each test file gets its own unique PostgreSQL schema
- **Automatic migrations**: Schema is initialized with `prisma migrate deploy`
- **Cleanup**: Schema is dropped after tests complete via `pg.Client`
- **No interference**: Test data never leaks between runs or test files

### Authentication in E2E Tests

Use the `createAndAuthenticateUser()` helper from `src/utils/test/create-and-authenticate-user.ts` to avoid repetition:

```typescript
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

// Default member (John Doe / johndoe@example.com / 123456)
const { token } = await createAndAuthenticateUser(app)

// Admin user
const { token } = await createAndAuthenticateUser(app, true)

// Use token in requests
await request(app.server)
  .get('/me')
  .set('Authorization', `Bearer ${token}`)
```

### Running Tests

```bash
npm run test             # Run unit tests only
npm run test:watch       # Unit tests in watch mode
npm run test:e2e         # Run E2E tests only
npm run test:e2e:watch   # E2E tests in watch mode
npm run test:coverage    # Unit tests with coverage report
npm run test:ui          # Open Vitest interactive UI
```

## Getting Started

### Requirements

- Node.js 20+
- Docker

### Setup

```bash
# Install dependencies
npm install

# Start the database
docker compose up -d

# Run migrations
npx prisma migrate dev

# Start dev server
npm run dev
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
NODE_ENV=dev
JWT_SECRET=your-secret-key
DATABASE_URL="postgresql://docker:docker@localhost:5432/api-solid-pg"
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Lint source files |
| `npm run format` | Format source files |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:e2e:watch` | Run E2E tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:ui` | Open Vitest UI |
| `npm run studio` | Open Prisma Studio |
