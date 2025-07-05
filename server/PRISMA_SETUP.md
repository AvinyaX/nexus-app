# Prisma Setup with PostgreSQL

This project has been configured with Prisma ORM and PostgreSQL database with a modular architecture.

## Project Structure

```
src/
├── prisma/
│   ├── prisma.service.ts    # Prisma service with lifecycle hooks
│   ├── prisma.module.ts     # Global Prisma module
│   └── index.ts             # Module exports
├── users/
│   ├── users.service.ts     # User CRUD operations
│   ├── users.controller.ts  # User REST endpoints
│   ├── users.module.ts      # Users module
│   └── index.ts             # Module exports
└── app.module.ts            # Main application module
```

## Database Configuration

### 1. Environment Variables

Update your `.env` file with your PostgreSQL connection:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/nexus_db"
NODE_ENV=development
```

### 2. Database Setup

1. **Create PostgreSQL Database:**

   ```sql
   CREATE DATABASE nexus_db;
   ```

2. **Run Database Migration:**

   ```bash
   pnpm db:migrate
   ```

3. **Generate Prisma Client:**
   ```bash
   pnpm db:generate
   ```

## Available Scripts

- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema changes to database
- `pnpm db:migrate` - Create and apply migrations
- `pnpm db:migrate:deploy` - Deploy migrations to production
- `pnpm db:reset` - Reset database and apply migrations
- `pnpm db:seed` - Seed database with initial data
- `pnpm db:studio` - Open Prisma Studio for database management

## API Endpoints

The application includes a complete CRUD API for users:

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Modular Architecture

### Prisma Module

- **Global Module**: Available throughout the application
- **Lifecycle Management**: Automatic connection/disconnection
- **Logging**: Query, info, warn, and error logging

### Users Module

- **Service Layer**: Business logic and database operations
- **Controller Layer**: REST API endpoints
- **Dependency Injection**: Uses PrismaService for database access

## Adding New Models

1. **Update Schema** (`prisma/schema.prisma`):

   ```prisma
   model YourModel {
     id        String   @id @default(cuid())
     // your fields here
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

2. **Create Service** (`src/your-model/your-model.service.ts`):

   ```typescript
   import { Injectable } from '@nestjs/common';
   import { PrismaService } from '../prisma';

   @Injectable()
   export class YourModelService {
     constructor(private prisma: PrismaService) {}

     // CRUD methods
   }
   ```

3. **Create Controller** (`src/your-model/your-model.controller.ts`):

   ```typescript
   import { Controller } from '@nestjs/common';
   import { YourModelService } from './your-model.service';

   @Controller('your-model')
   export class YourModelController {
     constructor(private yourModelService: YourModelService) {}

     // REST endpoints
   }
   ```

4. **Create Module** (`src/your-model/your-model.module.ts`):

   ```typescript
   import { Module } from '@nestjs/common';
   import { YourModelService } from './your-model.service';
   import { YourModelController } from './your-model.controller';
   import { PrismaModule } from '../prisma';

   @Module({
     imports: [PrismaModule],
     controllers: [YourModelController],
     providers: [YourModelService],
     exports: [YourModelService],
   })
   export class YourModelModule {}
   ```

5. **Add to App Module** (`src/app.module.ts`):
   ```typescript
   imports: [PrismaModule, UsersModule, YourModelModule];
   ```

## Development

1. **Start Development Server:**

   ```bash
   pnpm start:dev
   ```

2. **Open Prisma Studio:**

   ```bash
   pnpm db:studio
   ```

3. **Test API Endpoints:**

   ```bash
   # Create a user
   curl -X POST http://localhost:3000/users \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","name":"Test User"}'

   # Get all users
   curl http://localhost:3000/users
   ```

## Production Deployment

1. **Set Production Environment:**

   ```env
   NODE_ENV=production
   DATABASE_URL="your-production-database-url"
   ```

2. **Deploy Migrations:**

   ```bash
   pnpm db:migrate:deploy
   ```

3. **Build and Start:**
   ```bash
   pnpm build
   pnpm start:prod
   ```
