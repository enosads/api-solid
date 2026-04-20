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

**Testing & Quality**
- Vitest — unit testing framework with coverage
- Supertest — HTTP API integration testing
- Custom Vitest Prisma environment — isolated schema per test
- Biome — fast linter and formatter

**Security & Build**
- bcryptjs — password hashing
- tsup — TypeScript bundler
- Docker — containerized PostgreSQL

## Database Schema

- **User** — app users with hashed passwords
- **Gym** — gyms with geolocation (latitude/longitude)
- **CheckIn** — check-in records linking users to gyms

## Features (Functional Requirements)

- [x] User registration
- [x] User authentication
- [x] Get logged-in user profile
- [ ] Get check-in count for logged-in user
- [ ] User check-in history
- [ ] Search nearby gyms
- [ ] Search gyms by name
- [x] Perform gym check-in
- [ ] Validate user check-in
- [x] Register a gym

## Business Rules

- [x] No duplicate email registration
- [x] Max 1 check-in per day per user
- [x] Check-in only allowed within 100m of the gym
- [ ] Check-in validation window: 20 minutes after creation
- [ ] Only admins can validate check-ins
- [ ] Only admins can register gyms

## Non-Functional Requirements

- [x] Passwords must be hashed
- [x] PostgreSQL for data persistence
- [ ] All lists paginated with 20 items per page
- [ ] JWT-based authentication

## Testing

Tests are isolated using a custom Prisma Vitest environment that:
- Creates a unique PostgreSQL schema per test file
- Runs migrations for each schema automatically
- Cleans up orphaned schemas on setup
- Provides complete data isolation without test interference

```bash
npm run test          # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # With coverage report
npm run test:ui      # Interactive UI
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
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:ui` | Open Vitest UI |
| `npm run studio` | Open Prisma Studio |
