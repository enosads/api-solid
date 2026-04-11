# API Solid — GymPass Style App

REST API built with Node.js following SOLID principles, developed during the Rocketseat Node.js bootcamp.

## Tech Stack

- **Node.js** + **TypeScript**
- **Fastify** — web framework
- **Zod** — schema validation
- **Biome** — linter & formatter
- **tsup** — build tool

## Features (Functional Requirements)

- [ ] User registration
- [ ] User authentication
- [ ] Get logged-in user profile
- [ ] Get check-in count for logged-in user
- [ ] User check-in history
- [ ] Search nearby gyms
- [ ] Search gyms by name
- [ ] Perform gym check-in
- [ ] Validate user check-in
- [ ] Register a gym

## Business Rules

- [ ] No duplicate email registration
- [ ] Max 1 check-in per day per user
- [ ] Check-in only allowed within 100m of the gym
- [ ] Check-in validation window: 20 minutes after creation
- [ ] Only admins can validate check-ins
- [ ] Only admins can register gyms

## Non-Functional Requirements

- [ ] Passwords must be hashed
- [ ] PostgreSQL for data persistence
- [ ] All lists paginated with 20 items per page
- [ ] JWT-based authentication

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Lint source files |
| `npm run format` | Format source files |
