# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a psychological test administration application (psikotest-app-v2) built with Next.js 15, TypeScript, and Prisma. The application manages two main psychological tests:
- **Kraepelin Test**: A numerical sequence test for concentration assessment
- **IST (Intelligence Structure Test)**: A comprehensive intelligence test with multiple subtests
- **PAPI-Kostick**: A personality assessment test

## Essential Commands

### Development
```bash
npm run dev              # Start development server with turbo mode
npm run build            # Build for production
npm run preview          # Build and start production server
```

### Database
```bash
npm run db:push          # Push schema changes to database
npm run db:generate      # Generate Prisma client and migrations
npm run db:migrate       # Run migrations in production
npm run db:studio        # Open Prisma Studio
```

### Code Quality
```bash
npm run check            # Run both linting and type checking (recommended)
npm run lint             # Run ESLint
npm run lint:fix         # Run ESLint with auto-fix
npm run typecheck        # Run TypeScript type checking
npm run format:check     # Check code formatting with Prettier
npm run format:write     # Format code with Prettier
```

## Architecture

### Stack & Frameworks
- **Frontend**: Next.js 15 (App Router) with React 19
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **State Management**: TanStack Query (React Query) + React Hook Form
- **Backend**: tRPC v11 for type-safe API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (beta)
- **Type Safety**: TypeScript with strict mode

### Project Structure
```
src/
├── app/                  # Next.js App Router pages
│   ├── (dashboard)/     # Protected admin/dashboard routes
│   ├── authentication/  # Authentication pages
│   └── guest/           # Public test-taking routes
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── table/          # Data table utilities
│   └── sidebar/        # Dashboard navigation
├── features/           # Domain-specific feature modules
│   ├── ist-*/          # IST test features
│   ├── kraepelin-*/    # Kraepelin test features
│   ├── user-*/         # User management
│   └── auth-*/         # Authentication features
├── hooks/              # Custom React hooks (API calls, utilities)
├── lib/                # Utility functions and configurations
├── server/             # Server-side code
│   └── api/           # tRPC API routers
└── trpc/              # tRPC setup
```

### Key Patterns

#### Component Architecture
- **Feature-based organization**: Components grouped by domain (ist-, kraepelin-, etc.)
- **shadcn/ui integration**: All UI components use shadcn/ui with Tailwind
- **Compound components**: Complex UIs use compound patterns (e.g., KraepelinScreen with Header/Roller/Numpad)

#### Data Flow
- **tRPC**: Type-safe API calls using `useMutation` and `useQuery` from `@trpc/react-query`
- **TanStack Query**: Server state management with caching
- **React Hook Form**: Form handling with Zod validation
- **Prisma**: Type-safe database access

#### Authentication
- **NextAuth.js**: Authentication with custom session management
- **Role-based access**: Protected routes in `(dashboard)` group
- **Public test access**: Guest routes for test takers

### Database Schema
- **User management**: Users, Sessions, Accounts (NextAuth models)
- **Test invitations**: Separate invitation systems for each test type
- **Test results**: Structured results storage for different test formats
- **Audit trails**: Created/Updated timestamps throughout

## Development Guidelines

### Component Creation
1. Place components in appropriate `features/` directory
2. Use shadcn/ui components from `src/components/ui/`
3. Follow existing naming conventions (kebab-case for files, PascalCase for components)
4. Implement proper TypeScript types and interfaces

### API Development
1. Create tRPC routers in `src/server/api/routers/`
2. Use Zod schemas for input validation
3. Implement proper error handling
4. Add routers to `src/server/api/root.ts`

### Database Changes
1. Update `prisma/schema.prisma`
2. Run `npm run db:push` for development
3. Generate migrations with `npm run db:generate`
4. Test changes with Prisma Studio

### Testing
- The application uses behavioral testing with the test routes themselves
- Test data is managed through the invitation systems
- Use the training routes for testing functionality without affecting production data

## UI/UX Guidelines

### Design System
- **shadcn/ui**: Primary component library
- **Tailwind CSS**: Utility-first styling
- **Theme support**: Light/dark mode with `next-themes`
- **Responsive**: Mobile-first design approach

### Common Components
- **Card**: Section containers with consistent styling
- **Table**: Data display with sorting/filtering capabilities
- **Form**: Standardized form layouts with validation
- **Dialog**: Modal interactions
- **Skeleton**: Loading states

## Testing Environment

### Training Routes
- `/guest/kraepelin/training` - Practice Kraepelin test
- Test functionality without creating real test sessions

### Development Features
- Development flag indicators in UI
- Comprehensive error handling
- Loading states and skeleton components