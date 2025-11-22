# SaaS Platform - Full-Stack Application

A complete full-stack SaaS platform with invoicing, payments, subscriptions, support tickets, knowledge base, contracts, file storage, and client portal.

## 🏛️ Technology Stack

### Frontend
- **Next.js 14** (App Router)
- **React** + **TypeScript**
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **Zustand** for global state management
- **Zod** for validation
- **Chart.js** for dashboard analytics

### Backend
- **Node.js** + **TypeScript**
- **NestJS** framework with modular architecture
- **Prisma ORM** with PostgreSQL
- **Redis** for caching, sessions, and rate-limiting
- **BullMQ** for background jobs
- **JWT Authentication** with access + refresh tokens
- **RBAC** (Role-Based Access Control): admin, staff, client
- **Swagger** API documentation

### Infrastructure
- **Turborepo** monorepo structure
- **Docker** containerization
- **PostgreSQL** database
- **Redis** for caching and queues

## 📂 Project Structure

```
.
├── apps/
│   ├── backend/          # NestJS API
│   │   ├── src/
│   │   │   ├── auth/           # Authentication module
│   │   │   ├── users/          # User management
│   │   │   ├── clients/        # Client management
│   │   │   ├── invoices/       # Invoice management
│   │   │   ├── payments/       # Payment processing
│   │   │   ├── subscriptions/  # Subscription billing
│   │   │   ├── tickets/        # Support tickets
│   │   │   ├── knowledge-base/ # Knowledge base
│   │   │   ├── contracts/      # Contract management
│   │   │   ├── files/          # File storage
│   │   │   ├── notifications/  # Notifications
│   │   │   ├── emails/         # Email service
│   │   │   ├── portal/         # Client portal
│   │   │   ├── dashboard/      # Admin dashboard
│   │   │   ├── common/         # Shared utilities
│   │   │   └── database/       # Database module
│   │   └── prisma/
│   │       └── schema.prisma   # Database schema
│   │
│   └── frontend/         # Next.js client
│       ├── app/
│       │   ├── auth/           # Authentication pages
│       │   ├── dashboard/      # Admin dashboard
│       │   ├── clients/        # Client management UI
│       │   ├── invoices/       # Invoice management UI
│       │   ├── tickets/        # Support tickets UI
│       │   └── portal/         # Client portal
│       ├── components/
│       │   ├── ui/             # Reusable UI components
│       │   └── layout/         # Layout components
│       └── lib/
│           ├── api/            # API client
│           └── store/          # State management
│
├── packages/
│   ├── ui/               # Shared UI components
│   ├── types/            # Shared TypeScript types
│   └── utils/            # Shared utilities
│
├── docker-compose.yml    # Docker services configuration
├── turbo.json           # Turborepo configuration
└── package.json         # Root package.json

```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Docker & Docker Compose (optional, for containerized setup)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Responsive-Cactus-Website-Design-HTML-CSS-JS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Backend:
   ```bash
   cd apps/backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Setup database**
   ```bash
   cd apps/backend
   npx prisma generate
   npx prisma migrate dev
   npm run seed  # Optional: seed with sample data
   ```

### Development

#### Using Turborepo (Recommended)

Run all services:
```bash
npm run dev
```

This will start:
- Backend API on http://localhost:4000
- Frontend on http://localhost:3000

#### Individual Services

Backend:
```bash
cd apps/backend
npm run dev
```

Frontend:
```bash
cd apps/frontend
npm run dev
```

### Docker Deployment

1. **Start all services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Run database migrations**
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - API Documentation: http://localhost:4000/api/docs

## 📦 Features

### 1. Invoices
- CRUD operations for invoices
- Invoice line items with automatic total calculation
- Support for discounts and taxes
- Generate PDF invoices
- Email invoices to clients
- Track invoice status: Draft → Sent → Viewed → Paid → Overdue

### 2. Payments
- Multiple payment methods:
  - Stripe integration
  - PayPal integration
  - Paytm integration
  - Manual cash payments
- Webhook handling for payment events
- Transaction logs

### 3. Subscriptions
- Monthly and yearly billing cycles
- Auto-charge via Stripe or PayPal
- Retry logic for failed payments
- Client subscription portal

### 4. Client Management
- CRUD operations for clients
- Store billing information
- Link invoices, payments, tickets, contracts, and files
- Activity logs

### 5. Support Ticket System
- Email-to-ticket automation
- Assign tickets to staff
- Status workflow: Open → In Progress → Resolved → Closed
- Internal notes and client messages
- File attachments
- SLA reminders

### 6. Knowledge Base
- Organize articles by categories
- Rich text editor (TipTap)
- Public or client-only visibility
- Search functionality

### 7. Contracts
- Contract templates
- Generate contracts with dynamic fields
- PDF export
- E-signature support
- Status tracking: Draft → Sent → Signed → Completed

### 8. Client Portal
Clients can:
- View invoices and payments
- Pay invoices online
- Access contracts
- Open support tickets
- Browse knowledge base
- Update profile
- Download shared files

### 9. File Storage
- Organize files in folders
- Upload, download, and delete files
- Version control
- Local or S3-compatible storage

### 10. Notifications
- Email notifications
- In-app notifications
- Push notifications (optional)
- Customizable templates

### 11. Admin Dashboard
- Business analytics and metrics
- Revenue charts
- Ticket statistics
- Client activity tracking
- Unified management panel

## 🔐 Authentication & Authorization

- JWT-based authentication with access and refresh tokens
- Role-Based Access Control (RBAC):
  - **Admin**: Full system access
  - **Staff**: Manage clients, tickets, invoices
  - **Client**: Access to personal portal only

## 📊 Database Schema

The application uses Prisma ORM with the following main models:
- User
- Client
- Invoice
- InvoiceItem
- Payment
- Subscription
- Ticket
- TicketMessage
- KnowledgeCategory
- KnowledgeArticle
- Contract
- File
- Folder
- Notification
- Session
- AuditLog
- WebhookEvent

See `apps/backend/prisma/schema.prisma` for the complete schema.

## 🧪 Testing

Backend:
```bash
cd apps/backend
npm test
```

Frontend:
```bash
cd apps/frontend
npm test
```

## 📝 API Documentation

Once the backend is running, access the Swagger documentation at:
http://localhost:4000/api/docs

## 🛠️ Available Scripts

### Root
- `npm run dev` - Run all services in development mode
- `npm run build` - Build all packages and apps
- `npm run lint` - Lint all packages and apps
- `npm run format` - Format code with Prettier
- `npm run clean` - Clean all build artifacts

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## 🔧 Configuration

### Environment Variables

Backend (`apps/backend/.env`):
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/saas_db
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
STRIPE_SECRET_KEY=sk_test_...
PAYPAL_CLIENT_ID=...
```

Frontend (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 📄 License

This project is for demonstration purposes.

## 🤝 Contributing

This is a complete SaaS platform implementation. To extend functionality:

1. Create a new module in `apps/backend/src`
2. Add corresponding frontend pages in `apps/frontend/app`
3. Update Prisma schema if database changes are needed
4. Add shared types to `packages/types`
5. Run migrations and tests

## 📞 Support

For support and questions, please open an issue in the repository.

---

Built with ❤️ using Next.js, NestJS, Prisma, and TypeScript
