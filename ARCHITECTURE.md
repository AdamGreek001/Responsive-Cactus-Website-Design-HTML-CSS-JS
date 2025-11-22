# SaaS Platform Architecture

## System Overview

This is a full-stack SaaS platform built with modern technologies following clean architecture principles.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────┐          ┌──────────────────────────┐    │
│  │   Admin Portal   │          │    Client Portal         │    │
│  │   (Next.js)      │          │    (Next.js)             │    │
│  │  - Dashboard     │          │  - Invoices              │    │
│  │  - Management    │          │  - Tickets               │    │
│  │  - Analytics     │          │  - Files                 │    │
│  └────────┬─────────┘          └────────────┬─────────────┘    │
│           │                                  │                   │
└───────────┼──────────────────────────────────┼──────────────────┘
            │                                  │
            └──────────────┬───────────────────┘
                           │
                    ┌──────▼──────┐
                    │  API Gateway │
                    │  (NestJS)    │
                    └──────┬───────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                       │
┌───▼────┐           ┌────▼─────┐          ┌─────▼────┐
│  Auth  │           │ Business │          │  Admin   │
│ Module │           │  Modules │          │  Modules │
└───┬────┘           └────┬─────┘          └─────┬────┘
    │                     │                       │
    │  ┌─────────────────┴───────────────────┐   │
    │  │                                      │   │
┌───▼──▼────────────────────────────────────▼───▼───┐
│              SERVICE LAYER (NestJS)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Invoices │  │ Payments │  │ Tickets  │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │             │               │             │
│  ┌────▼─────┐  ┌───▼──────┐  ┌────▼─────┐       │
│  │ Clients  │  │Contracts │  │  Files   │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │             │               │             │
│  ┌────▼─────┐  ┌───▼──────┐  ┌────▼─────┐       │
│  │Knowledge │  │  Email   │  │Background│       │
│  │   Base   │  │ Service  │  │   Jobs   │       │
│  └──────────┘  └──────────┘  └──────────┘       │
└──────────────────────┬───────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
    ┌────▼────┐                ┌────▼────┐
    │ Prisma  │                │  Redis  │
    │   ORM   │                │  Cache  │
    └────┬────┘                └─────────┘
         │
    ┌────▼─────┐
    │PostgreSQL│
    │ Database │
    └──────────┘
```

## Technology Stack

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Validation**: Zod
- **Charts**: Chart.js

### Backend (NestJS)
- **Framework**: NestJS
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT (Access + Refresh Tokens)
- **Authorization**: Role-Based Access Control (RBAC)
- **Background Jobs**: BullMQ
- **API Documentation**: Swagger/OpenAPI
- **Email**: Nodemailer
- **PDF Generation**: PDFKit
- **File Storage**: AWS S3 or Local

### Infrastructure
- **Monorepo**: Turborepo
- **Containerization**: Docker & Docker Compose
- **Development**: Hot reload for both frontend and backend
- **Production**: Optimized builds with multi-stage Docker

## Module Architecture

### 1. Authentication & Authorization
```
auth/
├── auth.controller.ts     # Login, register, refresh, logout
├── auth.service.ts        # JWT generation, validation
├── strategies/
│   └── jwt.strategy.ts    # Passport JWT strategy
└── guards/
    ├── jwt-auth.guard.ts  # Route protection
    └── roles.guard.ts     # Role-based access
```

**Features**:
- JWT-based authentication
- Access tokens (15 min expiry)
- Refresh tokens (7 days expiry)
- Role-based access control (Admin, Staff, Client)
- Session management

### 2. Invoice Management
```
invoices/
├── invoices.controller.ts  # CRUD endpoints
├── invoices.service.ts     # Business logic
└── dto/
    └── invoice.dto.ts      # Validation schemas
```

**Features**:
- Create, read, update, delete invoices
- Automatic total calculation (subtotal, tax, discount)
- Invoice status tracking (Draft → Sent → Viewed → Paid)
- PDF generation
- Email invoices to clients
- Line items management

### 3. Payment Processing
```
payments/
├── payments.controller.ts  # Payment endpoints
├── payments.service.ts     # Payment logic
└── integrations/
    ├── stripe.service.ts   # Stripe integration
    ├── paypal.service.ts   # PayPal integration
    └── paytm.service.ts    # Paytm integration
```

**Features**:
- Multiple payment gateways (Stripe, PayPal, Paytm)
- Webhook handling for payment events
- Transaction logs
- Manual payment recording
- Payment history

### 4. Support Ticket System
```
tickets/
├── tickets.controller.ts   # Ticket endpoints
├── tickets.service.ts      # Ticket logic
└── dto/
    └── ticket.dto.ts       # Validation
```

**Features**:
- Create and manage support tickets
- Email-to-ticket automation
- Assign tickets to staff
- Status workflow (Open → In Progress → Resolved → Closed)
- Internal notes
- File attachments
- Priority levels

### 5. Knowledge Base
```
knowledge-base/
├── knowledge-base.controller.ts
├── knowledge-base.service.ts
└── dto/
    └── article.dto.ts
```

**Features**:
- Categories and articles
- Rich text editor support
- Public and client-only visibility
- Search functionality
- Article statistics (views, helpfulness)

### 6. Client Management
```
clients/
├── clients.controller.ts   # Client endpoints
├── clients.service.ts      # Client business logic
└── dto/
    └── client.dto.ts       # Validation
```

**Features**:
- Client profiles
- Billing information
- Linked invoices, payments, tickets
- Activity logs
- Client portal access

### 7. Contract Management
```
contracts/
├── contracts.controller.ts  # Contract endpoints
├── contracts.service.ts     # Contract logic
└── templates/
    └── contract.template.ts # Contract templates
```

**Features**:
- Contract templates
- Dynamic field replacement
- PDF generation
- E-signature support
- Status tracking

### 8. File Storage
```
files/
├── files.controller.ts     # File endpoints
├── files.service.ts        # File handling
└── storage/
    ├── s3.service.ts       # S3 integration
    └── local.service.ts    # Local storage
```

**Features**:
- File upload/download
- Folder organization
- Version control
- Access control
- S3 or local storage

### 9. Subscription Management
```
subscriptions/
├── subscriptions.controller.ts
├── subscriptions.service.ts
└── billing/
    └── billing.service.ts  # Recurring billing
```

**Features**:
- Monthly/yearly billing cycles
- Auto-charge via payment gateways
- Retry logic for failed payments
- Subscription portal
- Plan management

### 10. Email & Notifications
```
emails/
├── emails.service.ts       # Email sending
├── templates/              # Email templates
│   ├── invoice.template.ts
│   ├── ticket.template.ts
│   └── payment.template.ts
└── notifications/
    └── notifications.service.ts
```

**Features**:
- Template-based emails
- In-app notifications
- Push notifications (optional)
- Notification preferences

## Database Schema

### Core Models
- **User**: Authentication and user information
- **Client**: Client profiles and billing info
- **Invoice**: Invoice details and items
- **Payment**: Payment transactions
- **Subscription**: Recurring billing
- **Ticket**: Support tickets and messages
- **Contract**: Legal contracts
- **File**: File storage metadata
- **Notification**: User notifications
- **Session**: JWT session management
- **AuditLog**: Activity tracking

### Relationships
```
User 1:1 Client
Client 1:N Invoice
Client 1:N Payment
Client 1:N Ticket
Client 1:N Contract
Invoice 1:N InvoiceItem
Invoice 1:N Payment
Ticket 1:N TicketMessage
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Invoices
- `GET /api/invoices` - List all invoices
- `GET /api/invoices/:id` - Get invoice details
- `POST /api/invoices` - Create new invoice
- `PATCH /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `PATCH /api/invoices/:id/status` - Update status

### Clients
- `GET /api/clients` - List all clients
- `GET /api/clients/:id` - Get client details
- `POST /api/clients` - Create new client
- `PATCH /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Payments
- `GET /api/payments` - List all payments
- `GET /api/payments/:id` - Get payment details
- `POST /api/payments` - Record payment
- `POST /api/payments/webhook` - Payment webhook

### Tickets
- `GET /api/tickets` - List all tickets
- `GET /api/tickets/:id` - Get ticket details
- `POST /api/tickets` - Create ticket
- `PATCH /api/tickets/:id` - Update ticket
- `POST /api/tickets/:id/messages` - Add message

## Security

### Authentication
- JWT-based authentication
- Secure password hashing with bcrypt
- Token expiration and refresh mechanism
- Session management

### Authorization
- Role-based access control (RBAC)
- Route protection with guards
- Resource-level permissions

### Data Protection
- Input validation with Zod
- SQL injection prevention (Prisma ORM)
- XSS protection
- CSRF protection
- Rate limiting

### Infrastructure
- HTTPS in production
- Environment variable management
- Secrets encryption
- Regular security updates

## Deployment

### Development
```bash
# Install dependencies
npm install

# Start PostgreSQL and Redis
docker-compose up postgres redis -d

# Run database migrations
cd apps/backend
npx prisma migrate dev
npm run seed

# Start all services
npm run dev
```

### Production (Docker)
```bash
# Build and start all services
docker-compose up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# View logs
docker-compose logs -f
```

## Scaling Considerations

### Horizontal Scaling
- Stateless API design
- Redis for session storage
- Load balancer ready
- Database connection pooling

### Caching Strategy
- Redis caching for frequent queries
- API response caching
- Static asset CDN

### Background Jobs
- BullMQ for async processing
- Email queue
- PDF generation queue
- Payment retry queue

### Monitoring
- Application logs
- Error tracking
- Performance monitoring
- Database query optimization

## Future Enhancements

1. **Advanced Analytics**
   - Revenue forecasting
   - Customer lifetime value
   - Churn prediction

2. **Integrations**
   - Accounting software (QuickBooks, Xero)
   - CRM systems (Salesforce, HubSpot)
   - Communication tools (Slack, Microsoft Teams)

3. **Mobile Apps**
   - React Native mobile app
   - Push notifications
   - Offline support

4. **Advanced Features**
   - Multi-currency support
   - Multi-language support
   - White-labeling
   - API access for clients
   - Webhooks for external integrations

5. **AI/ML Features**
   - Chatbot support
   - Automated ticket routing
   - Invoice fraud detection
   - Smart recommendations
