# Quick Start Guide

This guide will help you get the SaaS platform up and running in minutes.

## Prerequisites

Make sure you have installed:
- Node.js 18+ ([Download](https://nodejs.org/))
- Docker & Docker Compose ([Download](https://www.docker.com/))
- Git

## Option 1: Quick Start with Docker (Recommended)

This is the fastest way to get started. Everything runs in containers.

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Responsive-Cactus-Website-Design-HTML-CSS-JS
```

### Step 2: Start All Services

```bash
# Start PostgreSQL, Redis, Backend, and Frontend
docker-compose up -d

# Wait for services to be ready (about 30 seconds)
docker-compose logs -f backend
# Press Ctrl+C when you see "Application is running"
```

### Step 3: Initialize the Database

```bash
# Run database migrations
docker-compose exec backend npx prisma migrate deploy

# Seed with sample data
docker-compose exec backend npm run seed
```

### Step 4: Access the Application

Open your browser and visit:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/api/docs

### Test Accounts

| Role   | Email                  | Password   |
|--------|------------------------|------------|
| Admin  | admin@example.com      | admin123   |
| Staff  | staff@example.com      | staff123   |
| Client | client1@example.com    | client123  |
| Client | client2@example.com    | client123  |

### Stop Services

```bash
docker-compose down
```

---

## Option 2: Local Development Setup

For active development with hot reload.

### Step 1: Install Dependencies

```bash
# Install all dependencies
npm install
```

### Step 2: Start PostgreSQL and Redis

```bash
# Start only database and cache
docker-compose up postgres redis -d
```

### Step 3: Setup Backend

```bash
cd apps/backend

# Create .env file
cp .env.example .env

# Edit .env and update DATABASE_URL if needed
# Default: postgresql://postgres:password@localhost:5432/saas_db?schema=public

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npm run seed

# Start backend (in a new terminal)
npm run dev
```

Backend will be available at http://localhost:4000

### Step 4: Setup Frontend

```bash
# In a new terminal
cd apps/frontend

# Create .env.local file
cp .env.example .env.local

# Start frontend
npm run dev
```

Frontend will be available at http://localhost:3000

### Step 5: Access the Application

Visit http://localhost:3000 and login with test accounts above.

---

## Common Tasks

### View Database

```bash
# Using Prisma Studio
cd apps/backend
npx prisma studio
```

This opens a GUI at http://localhost:5555 to browse your database.

### View Logs

```bash
# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Local development
# Check the terminal where you ran npm run dev
```

### Reset Database

```bash
# Docker
docker-compose down -v  # Removes volumes
docker-compose up -d
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run seed

# Local
cd apps/backend
npx prisma migrate reset  # This also runs seed
```

### Run Tests

```bash
# Backend tests
cd apps/backend
npm test

# Frontend tests
cd apps/frontend
npm test
```

---

## Development Workflow

### 1. Create a New Module

```bash
cd apps/backend/src

# Create module directory
mkdir my-module
cd my-module

# Create files
touch my-module.module.ts
touch my-module.controller.ts
touch my-module.service.ts
mkdir dto
```

### 2. Add to App Module

Edit `apps/backend/src/app.module.ts`:

```typescript
import { MyModuleModule } from './my-module/my-module.module';

@Module({
  imports: [
    // ... other imports
    MyModuleModule,
  ],
})
export class AppModule {}
```

### 3. Create Database Model

Edit `apps/backend/prisma/schema.prisma`:

```prisma
model MyModel {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  
  @@map("my_models")
}
```

Run migration:

```bash
npx prisma migrate dev --name add-my-model
```

### 4. Create Frontend Page

```bash
cd apps/frontend/app
mkdir my-page
touch my-page/page.tsx
```

### 5. Build for Production

```bash
# Build all packages
npm run build

# Or build individually
cd apps/backend && npm run build
cd apps/frontend && npm run build
```

---

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Check what's using the port
lsof -i :3000  # Frontend
lsof -i :4000  # Backend
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Kill the process or change ports in docker-compose.yml
```

### Database Connection Error

```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# Check connection string in .env
# Should be: postgresql://postgres:password@localhost:5432/saas_db?schema=public
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install

# Regenerate Prisma Client
cd apps/backend
npx prisma generate
```

### Docker Issues

```bash
# Clean up Docker
docker-compose down -v
docker system prune -a

# Rebuild images
docker-compose build --no-cache
docker-compose up -d
```

---

## Next Steps

Now that you have the platform running:

1. **Explore the Admin Dashboard** at http://localhost:3000/dashboard
2. **Check the API Documentation** at http://localhost:4000/api/docs
3. **Try the Client Portal** at http://localhost:3000/portal
4. **Review the Architecture** in [ARCHITECTURE.md](./ARCHITECTURE.md)
5. **Start Building Features** - Add new modules or extend existing ones

## Need Help?

- Check [README.md](./README.md) for detailed documentation
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Look at existing modules for examples
- Check the Swagger API docs at http://localhost:4000/api/docs

## Quick Reference

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start all services |
| `docker-compose down` | Stop all services |
| `docker-compose logs -f` | View logs |
| `npm run dev` | Start all services locally |
| `npm run build` | Build all packages |
| `npx prisma studio` | Open database GUI |
| `npx prisma migrate dev` | Create new migration |

Happy coding! 🚀
