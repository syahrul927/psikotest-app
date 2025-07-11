# Architecture Documentation

## System Overview

The Psikotest App v2 is a full-stack psychological testing platform built with modern web technologies. The architecture follows a modular, type-safe approach with clear separation of concerns.

## Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Side   │    │   Server Side   │    │    Database     │
│                 │    │                 │    │                 │
│  React/Next.js  │◄──►│   tRPC API      │◄──►│  PostgreSQL     │
│  TanStack Query │    │   NextAuth.js   │    │  Prisma ORM     │
│  Radix UI       │    │   Middleware    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Core Principles

### 1. Type Safety
- **End-to-end type safety** with TypeScript and tRPC
- **Runtime validation** with Zod schemas
- **Database type safety** with Prisma

### 2. Modularity
- **Feature-based organization** with clear boundaries
- **Reusable components** with consistent APIs
- **Separation of concerns** between UI, business logic, and data

### 3. Performance
- **Server-side rendering** for initial page loads
- **Client-side caching** with React Query
- **Code splitting** for optimal bundle sizes
- **Database optimization** with efficient queries

### 4. Security
- **Authentication** with NextAuth.js
- **Authorization** with role-based access control
- **Input validation** at all layers
- **Secure session management**

## Technology Stack

### Frontend Layer

#### Next.js 15 with App Router
- **Server Components**: For better performance and SEO
- **Client Components**: For interactive functionality
- **API Routes**: For server-side logic
- **Middleware**: For authentication and routing

#### React 19
- **Concurrent Features**: For better user experience
- **Suspense**: For loading states
- **Error Boundaries**: For error handling

#### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Custom Components**: Built on top of Radix primitives
- **Theme System**: Dark/light mode support

### Backend Layer

#### tRPC
- **Type-safe APIs**: End-to-end type safety
- **Automatic serialization**: With SuperJSON
- **Error handling**: Structured error responses
- **Middleware**: For authentication and logging

#### NextAuth.js
- **Session management**: Secure session handling
- **Credential provider**: Email/password authentication
- **Database adapter**: Prisma adapter for session storage
- **Security**: CSRF protection and secure cookies

#### Prisma ORM
- **Type-safe database access**: Generated client types
- **Migration system**: Version-controlled schema changes
- **Query optimization**: Efficient database queries
- **Connection pooling**: For better performance

### Database Layer

#### PostgreSQL
- **ACID compliance**: Reliable transactions
- **JSON support**: For flexible data storage
- **Full-text search**: For content searching
- **Scalability**: Horizontal and vertical scaling

## Data Flow

### 1. Request Flow
```
User Action → React Component → tRPC Hook → tRPC Router → Prisma → Database
```

### 2. Response Flow
```
Database → Prisma → tRPC Router → React Query Cache → React Component → UI Update
```

### 3. Authentication Flow
```
Login Request → NextAuth.js → Database Verification → Session Creation → Protected Route Access
```

## Feature Architecture

### IST (Intelligence Structure Test)

#### Components
- **IstInvitation**: Test invitation management
- **IstSubtest**: Test execution interface
- **IstResults**: Results analysis and display

#### Data Models
- **IstInvitation**: Test session metadata
- **IstSubtestTemplate**: Test configuration
- **IstQuestionTemplate**: Individual questions
- **IstResult**: Test results and scoring

#### Flow
1. **Admin creates invitation** with test configuration
2. **Test taker accesses invitation** via secret key
3. **Profile collection** with demographic information
4. **Test execution** with timed subtests
5. **Result calculation** with standardized scoring
6. **Result review** by administrators

### Kraepelin Test

#### Components
- **KraepelinInvitation**: Test invitation management
- **KraepelinScreen**: Test execution interface
- **KraepelinResults**: Performance analysis

#### Data Models
- **Invitation**: Test session metadata
- **KraepelinTemplate**: Number grid configuration
- **KraepelinResult**: Performance metrics

#### Flow
1. **Admin creates invitation** with test parameters
2. **Test taker accesses test** via secret key
3. **Profile collection** with basic information
4. **Test execution** with numerical calculations
5. **Performance analysis** with statistical metrics
6. **Result visualization** with charts and graphs

## Security Architecture

### Authentication
- **NextAuth.js** handles all authentication flows
- **Argon2** for password hashing
- **Secure sessions** with HTTP-only cookies
- **CSRF protection** built-in

### Authorization
- **Role-based access control** (Admin, User)
- **Route protection** with middleware
- **API endpoint protection** with tRPC middleware
- **Resource-level permissions** for data access

### Data Protection
- **Input validation** with Zod schemas
- **SQL injection prevention** with Prisma
- **XSS protection** with React's built-in sanitization
- **Environment variable security** for sensitive data

## Performance Considerations

### Frontend Optimization
- **Code splitting** with Next.js dynamic imports
- **Image optimization** with Next.js Image component
- **Bundle analysis** for size optimization
- **Lazy loading** for non-critical components

### Backend Optimization
- **Database indexing** for query performance
- **Connection pooling** for database efficiency
- **Query optimization** with Prisma
- **Caching strategies** with React Query

### Monitoring
- **Performance metrics** tracking
- **Error monitoring** and alerting
- **Database query analysis**
- **User experience metrics**

## Deployment Architecture

### Development Environment
- **Local development** with hot reloading
- **Database migrations** with Prisma
- **Environment configuration** with .env files
- **Development tools** (Prisma Studio, etc.)

### Production Environment
- **Vercel deployment** (recommended)
- **PostgreSQL database** (managed service)
- **Environment variables** configuration
- **SSL/TLS encryption** for all connections

### CI/CD Pipeline
- **Automated testing** on pull requests
- **Type checking** and linting
- **Database migration** validation
- **Deployment automation** with Vercel

## Scalability Considerations

### Horizontal Scaling
- **Stateless application** design
- **Database connection pooling**
- **CDN integration** for static assets
- **Load balancing** capabilities

### Vertical Scaling
- **Database optimization** for larger datasets
- **Memory management** for large test sessions
- **CPU optimization** for calculation-intensive operations

### Future Enhancements
- **Microservices** architecture for larger scale
- **Caching layer** (Redis) for session data
- **Message queues** for background processing
- **Analytics service** for detailed reporting

## Development Guidelines

### Code Organization
- **Feature-based** folder structure
- **Consistent naming** conventions
- **Clear separation** of concerns
- **Reusable components** and utilities

### Type Safety
- **Strict TypeScript** configuration
- **Zod schemas** for runtime validation
- **tRPC contracts** for API type safety
- **Prisma types** for database operations

### Testing Strategy
- **Unit tests** for components and utilities
- **Integration tests** for API endpoints
- **E2E tests** for critical user flows
- **Type tests** for TypeScript definitions

### Documentation
- **Inline code** documentation
- **API documentation** with tRPC
- **Component documentation** with Storybook
- **Architecture documentation** (this file)