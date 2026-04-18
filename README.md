# API Solid — GymPass Style App

REST API built with Node.js following SOLID principles, developed during the Rocketseat Node.js bootcamp.

## Tech Stack

- **Node.js** + **TypeScript**
- **Fastify** — web framework
- **Prisma** — ORM
- **PostgreSQL** — database
- **Zod** — schema validation
- **Vitest** — unit testing
- **bcryptjs** — password hashing
- **Biome** — linter & formatter
- **tsup** — build tool
- **Docker** — containerized database

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
