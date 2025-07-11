# Psikotest App v2

A comprehensive psychological testing platform built with the T3 Stack, providing IST (Intelligence Structure Test) and Kraepelin concentration tests for psychological assessment.

## 🚀 Features

### Core Functionality
- **IST (Intelligence Structure Test)**: Multi-subtest intelligence assessment with time limits
- **Kraepelin Test**: Concentration and attention assessment with numerical calculations
- **Test Management**: Create, manage, and track test invitations
- **Results Analysis**: Comprehensive scoring and standardized results
- **User Management**: Role-based access control for administrators and test takers

### Technical Features
- **Type-safe APIs** with tRPC
- **Real-time updates** with React Query
- **Responsive design** with Tailwind CSS
- **Dark/Light theme** support
- **Mobile-optimized** test interface
- **Secure authentication** with NextAuth.js
- **Database migrations** with Prisma

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://prisma.io)
- **API**: [tRPC](https://trpc.io) for type-safe APIs
- **Authentication**: [NextAuth.js](https://next-auth.js.org)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev) validation
- **Charts**: [Recharts](https://recharts.org/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.17 or later)
- **PostgreSQL** (v12 or later)
- **Yarn** (v1.22 or later) - recommended package manager

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd psikotest-app-v2
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Configure the following environment variables in `.env`:

```env
# Application
APP_NAME="Psikotest App"
BASE_URL="http://localhost:3000"

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/psikotest_db"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup

Start your PostgreSQL database and run the migrations:

```bash
# Generate Prisma client
yarn db:generate

# Run database migrations
yarn db:migrate

# (Optional) Open Prisma Studio to view your database
yarn db:studio
```

### 5. Start Development Server

```bash
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   ├── authentication/    # Auth pages
│   └── guest/             # Public test-taking routes
├── components/            # Reusable UI components
│   ├── layout/           # Layout components
│   ├── sidebar/          # Navigation components
│   ├── table/            # Data table components
│   ├── timer/            # Timer components
│   └── ui/               # Base UI components
├── features/             # Feature-specific components
│   ├── auth/             # Authentication features
│   ├── dashboard/        # Dashboard features
│   ├── ist-invitation/   # IST test management
│   ├── ist-subtest/      # IST test execution
│   ├── kraepelin-invitation/ # Kraepelin test management
│   └── kraepelin-test/   # Kraepelin test execution
├── hooks/                # Custom React hooks
│   └── api/              # API-specific hooks
├── lib/                  # Utility functions
├── server/               # Server-side code
│   ├── api/              # tRPC routers
│   ├── auth/             # Authentication config
│   └── data/             # Static data
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## 🧪 Available Scripts

```bash
# Development
yarn dev              # Start development server with Turbo
yarn build            # Build for production
yarn start            # Start production server
yarn preview          # Build and start production server

# Database
yarn db:generate      # Generate Prisma client
yarn db:migrate       # Run database migrations
yarn db:push          # Push schema changes to database
yarn db:studio        # Open Prisma Studio

# Code Quality
yarn lint             # Run ESLint
yarn lint:fix         # Fix ESLint issues
yarn typecheck        # Run TypeScript type checking
yarn format:check     # Check code formatting
yarn format:write     # Format code with Prettier
yarn check            # Run all checks (lint + typecheck)
```

## 🔐 Authentication

The application uses NextAuth.js for authentication with the following features:

- **Credential-based authentication** with email and password
- **Session management** with secure cookies
- **Password hashing** using Argon2
- **Role-based access control** for different user types

### Default Admin Account

After running migrations, you can create an admin account through the application interface.

## 🧠 Test Types

### IST (Intelligence Structure Test)

The IST is a comprehensive intelligence assessment consisting of multiple subtests:

- **Subtest Management**: Create and configure different test modules
- **Question Templates**: Support for text, image, and multiple-choice questions
- **Time Limits**: Configurable time constraints per subtest
- **Scoring System**: Raw scores and standardized scoring
- **Progress Tracking**: Real-time test progress monitoring

### Kraepelin Test

The Kraepelin test assesses concentration and sustained attention:

- **Numerical Calculations**: Addition-based concentration tasks
- **Performance Metrics**: Speed, accuracy, and consistency analysis
- **Visual Interface**: Grid-based number presentation
- **Result Analysis**: Comprehensive performance statistics

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

### Core Models
- **User**: Application users and administrators
- **TesterProfile**: Test taker information
- **IstTesterProfile**: IST-specific tester profiles

### IST Models
- **IstInvitation**: Test invitations and sessions
- **IstSubtestTemplate**: Test configuration templates
- **IstQuestionTemplate**: Individual questions
- **IstResult**: Test results and scoring

### Kraepelin Models
- **Invitation**: Kraepelin test invitations
- **KraepelinTemplate**: Number grid templates
- **KraepelinResult**: Test results and analysis

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `APP_NAME` | Application name | No |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `BASE_URL` | Application base URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | Yes |
| `NEXTAUTH_URL` | NextAuth.js callback URL | Yes |

### Database Configuration

The application requires PostgreSQL with the following recommended settings:

- **Version**: PostgreSQL 12 or later
- **Timezone**: UTC (recommended)
- **Encoding**: UTF8
- **Connection Pool**: Configure based on your deployment needs

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Configure environment variables** in the Vercel dashboard
3. **Set up PostgreSQL database** (Vercel Postgres, Supabase, or other)
4. **Deploy** - Vercel will automatically build and deploy

### Docker

```bash
# Build the Docker image
docker build -t psikotest-app .

# Run the container
docker run -p 3000:3000 --env-file .env psikotest-app
```

### Manual Deployment

1. **Build the application**:
   ```bash
   yarn build
   ```

2. **Set up production database** and run migrations:
   ```bash
   yarn db:migrate
   ```

3. **Start the production server**:
   ```bash
   yarn start
   ```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

### Test Structure

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API route and database tests
- **E2E Tests**: Full user workflow tests

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Run the test suite**: `yarn check`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Style

- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Use Prettier for code formatting
- **TypeScript**: Maintain strict type safety
- **Conventional Commits**: Use conventional commit messages

## 🔒 Security

### Security Features

- **Input Validation**: All inputs validated with Zod schemas
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: NextAuth.js CSRF protection
- **Secure Headers**: Security headers configured in Next.js

### Security Best Practices

- **Environment Variables**: Never commit sensitive data
- **Password Security**: Passwords hashed with Argon2
- **Session Security**: Secure session management
- **Database Security**: Use connection pooling and SSL

## 📈 Performance

### Optimization Features

- **Server-Side Rendering**: Next.js SSR for better performance
- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js Image component
- **Database Optimization**: Prisma query optimization
- **Caching**: React Query for client-side caching

### Performance Monitoring

- **Core Web Vitals**: Monitor loading performance
- **Database Queries**: Monitor query performance
- **API Response Times**: Track API performance
- **Error Tracking**: Monitor application errors

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connection
yarn db:studio

# Reset database
yarn db:push --force-reset
```

#### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules yarn.lock
yarn install
```

#### Environment Issues
```bash
# Validate environment variables
yarn build
```

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **T3 Stack**: For the excellent full-stack TypeScript framework
- **Vercel**: For the amazing deployment platform
- **Radix UI**: For the accessible UI components
- **Prisma**: For the excellent database toolkit

---

Built with ❤️ using the [T3 Stack](https://create.t3.gg/)
