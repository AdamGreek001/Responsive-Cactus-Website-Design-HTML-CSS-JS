# Contributing Guide

Thank you for your interest in contributing to the SaaS Platform! This guide will help you understand the codebase structure and development workflow.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Style](#code-style)
4. [Project Structure](#project-structure)
5. [Adding Features](#adding-features)
6. [Testing](#testing)
7. [Pull Request Process](#pull-request-process)

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git
- Code editor (VS Code recommended)

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd Responsive-Cactus-Website-Design-HTML-CSS-JS

# Install dependencies
npm install

# Start development environment
npm run dev
```

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

Follow the code structure and patterns used in existing modules.

### 3. Test Your Changes

```bash
# Lint
npm run lint

# Run tests
npm run test
```

### 4. Commit Changes

Use clear, descriptive commit messages:

```bash
git commit -m "feat: add invoice PDF generation"
git commit -m "fix: resolve authentication token refresh issue"
git commit -m "docs: update API documentation"
```

Commit message types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Code Style

### TypeScript

We use TypeScript throughout the codebase with strict mode enabled.

**Good practices:**
- Use explicit types, avoid `any`
- Use interfaces for object shapes
- Use enums for fixed sets of values
- Use async/await instead of promises

```typescript
// Good
interface CreateInvoiceDto {
  clientId: string;
  amount: number;
  dueDate: Date;
}

async function createInvoice(data: CreateInvoiceDto): Promise<Invoice> {
  return await this.prisma.invoice.create({ data });
}

// Avoid
function createInvoice(data: any): any {
  return this.prisma.invoice.create({ data });
}
```

### Formatting

We use Prettier for code formatting:

```bash
# Format all files
npm run format

# Check formatting
npm run lint
```

### Naming Conventions

- **Files**: kebab-case (`user-service.ts`)
- **Classes**: PascalCase (`UserService`)
- **Functions/Variables**: camelCase (`getUserById`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Interfaces**: PascalCase with descriptive names (`User`, `CreateUserDto`)

## Project Structure

```
apps/
├── backend/          # NestJS API
│   └── src/
│       ├── auth/           # Authentication module
│       ├── users/          # Users module
│       ├── clients/        # Clients module
│       └── [module]/       # Other modules
│           ├── [module].module.ts
│           ├── [module].controller.ts
│           ├── [module].service.ts
│           └── dto/
│               └── [module].dto.ts
│
├── frontend/         # Next.js app
│   ├── app/               # Pages (App Router)
│   ├── components/        # React components
│   └── lib/              # Utilities
│
packages/
├── ui/              # Shared UI components
├── types/           # Shared TypeScript types
└── utils/           # Shared utilities
```

## Adding Features

### Adding a Backend Module

#### 1. Create Module Structure

```bash
cd apps/backend/src
mkdir my-feature
cd my-feature
mkdir dto entities
touch my-feature.module.ts
touch my-feature.controller.ts
touch my-feature.service.ts
```

#### 2. Create Service

```typescript
// my-feature.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class MyFeatureService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.myModel.findMany();
  }

  async findOne(id: string) {
    return this.prisma.myModel.findUnique({ where: { id } });
  }

  async create(data: CreateMyFeatureDto) {
    return this.prisma.myModel.create({ data });
  }

  async update(id: string, data: UpdateMyFeatureDto) {
    return this.prisma.myModel.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.myModel.delete({ where: { id } });
  }
}
```

#### 3. Create Controller

```typescript
// my-feature.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MyFeatureService } from './my-feature.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('My Feature')
@Controller('my-feature')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MyFeatureController {
  constructor(private service: MyFeatureService) {}

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new item' })
  create(@Body() createDto: CreateMyFeatureDto) {
    return this.service.create(createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update item' })
  update(@Param('id') id: string, @Body() updateDto: UpdateMyFeatureDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete item' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
```

#### 4. Create Module

```typescript
// my-feature.module.ts
import { Module } from '@nestjs/common';
import { MyFeatureService } from './my-feature.service';
import { MyFeatureController } from './my-feature.controller';

@Module({
  controllers: [MyFeatureController],
  providers: [MyFeatureService],
  exports: [MyFeatureService],
})
export class MyFeatureModule {}
```

#### 5. Create DTOs with Zod

```typescript
// dto/my-feature.dto.ts
import { z } from 'zod';

export const CreateMyFeatureDtoSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const UpdateMyFeatureDtoSchema = CreateMyFeatureDtoSchema.partial();

export type CreateMyFeatureDto = z.infer<typeof CreateMyFeatureDtoSchema>;
export type UpdateMyFeatureDto = z.infer<typeof UpdateMyFeatureDtoSchema>;
```

#### 6. Add Database Model

Edit `apps/backend/prisma/schema.prisma`:

```prisma
model MyModel {
  id          String   @id @default(cuid())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("my_models")
}
```

Run migration:

```bash
npx prisma migrate dev --name add-my-model
```

#### 7. Register Module

Edit `apps/backend/src/app.module.ts`:

```typescript
import { MyFeatureModule } from './my-feature/my-feature.module';

@Module({
  imports: [
    // ... other imports
    MyFeatureModule,
  ],
})
export class AppModule {}
```

### Adding a Frontend Page

#### 1. Create Page

```bash
cd apps/frontend/app
mkdir my-page
touch my-page/page.tsx
```

#### 2. Implement Page

```tsx
'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api/client';

export default function MyPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await apiClient.get('/my-feature');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Feature</h1>
      <div className="grid gap-4">
        {data.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded shadow">
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Adding Shared Components

#### 1. Create Component in UI Package

```bash
cd packages/ui/components
touch MyComponent.tsx
```

```tsx
// MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  children: React.ReactNode;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, children }) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
};
```

#### 2. Export Component

Edit `packages/ui/index.tsx`:

```typescript
export { MyComponent } from './components/MyComponent';
```

#### 3. Use in Frontend

```tsx
import { MyComponent } from '@saas-platform/ui';

function Page() {
  return (
    <MyComponent title="Hello">
      <p>Content here</p>
    </MyComponent>
  );
}
```

## Testing

### Backend Tests

```typescript
// my-feature.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MyFeatureService } from './my-feature.service';
import { PrismaService } from '../database/prisma.service';

describe('MyFeatureService', () => {
  let service: MyFeatureService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyFeatureService,
        {
          provide: PrismaService,
          useValue: {
            myModel: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MyFeatureService>(MyFeatureService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const mockData = [{ id: '1', name: 'Test' }];
      jest.spyOn(prisma.myModel, 'findMany').mockResolvedValue(mockData);

      const result = await service.findAll();
      expect(result).toEqual(mockData);
    });
  });
});
```

Run tests:

```bash
cd apps/backend
npm test
```

### Frontend Tests

```typescript
// MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders title correctly', () => {
    render(<MyComponent title="Test Title">Content</MyComponent>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

## Pull Request Process

1. **Ensure Code Quality**
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

2. **Update Documentation**
   - Update README if needed
   - Add JSDoc comments to functions
   - Update API documentation in Swagger

3. **Create Pull Request**
   - Write clear PR title and description
   - Link related issues
   - Add screenshots for UI changes
   - Request review from maintainers

4. **PR Checklist**
   - [ ] Code follows project style guidelines
   - [ ] Tests added/updated and passing
   - [ ] Documentation updated
   - [ ] No breaking changes (or documented)
   - [ ] Migrations tested
   - [ ] Environment variables documented

## Common Patterns

### Error Handling

```typescript
// Backend
import { NotFoundException, BadRequestException } from '@nestjs/common';

async findOne(id: string) {
  const item = await this.prisma.myModel.findUnique({ where: { id } });
  
  if (!item) {
    throw new NotFoundException(`Item with ID ${id} not found`);
  }
  
  return item;
}

// Frontend
try {
  const response = await apiClient.get('/my-feature');
  setData(response.data);
} catch (error: any) {
  if (error.response?.status === 404) {
    setError('Item not found');
  } else {
    setError('An error occurred');
  }
}
```

### Authentication

```typescript
// Protected route
@UseGuards(JwtAuthGuard)
@Get('protected')
getProtected(@Req() req) {
  return { userId: req.user.userId };
}

// Role-based access
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Get('admin-only')
getAdminOnly() {
  return { message: 'Admin access' };
}
```

### Database Transactions

```typescript
async createWithRelations(data: CreateDto) {
  return this.prisma.$transaction(async (tx) => {
    const parent = await tx.parent.create({ data: data.parent });
    const child = await tx.child.create({
      data: { ...data.child, parentId: parent.id },
    });
    return { parent, child };
  });
}
```

## Getting Help

- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Review existing modules for examples
- Check [QUICKSTART.md](./QUICKSTART.md) for setup help
- Look at Swagger docs at http://localhost:4000/api/docs

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

Happy coding! 🚀
