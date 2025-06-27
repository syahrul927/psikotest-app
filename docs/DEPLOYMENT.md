# Deployment Guide

## Overview

This guide covers deployment options for the Psikotest App v2, from development to production environments. The application is designed to be deployed on modern cloud platforms with minimal configuration.

## Prerequisites

### System Requirements
- **Node.js**: v18.17 or later
- **PostgreSQL**: v12 or later
- **Memory**: Minimum 512MB RAM (2GB+ recommended for production)
- **Storage**: Minimum 1GB available space

### Required Services
- **Database**: PostgreSQL instance (local or cloud)
- **File Storage**: For test images and assets (optional)
- **Email Service**: For notifications (optional)

## Environment Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Application Configuration
APP_NAME="Psikotest App"
NODE_ENV="production"
BASE_URL="https://your-domain.com"

# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication Configuration
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"

# Optional: Email Configuration
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@your-domain.com"

# Optional: File Storage
UPLOAD_DIR="/uploads"
MAX_FILE_SIZE="10485760" # 10MB
```

### Security Considerations

#### NEXTAUTH_SECRET
Generate a secure secret for NextAuth.js:
```bash
openssl rand -base64 32
```

#### Database Security
- Use SSL connections in production
- Implement connection pooling
- Regular security updates
- Backup strategy

## Deployment Options

## 1. Vercel (Recommended)

Vercel provides the easiest deployment experience for Next.js applications.

### Prerequisites
- Vercel account
- GitHub/GitLab repository
- PostgreSQL database (Vercel Postgres, Supabase, etc.)

### Step-by-Step Deployment

#### 1. Database Setup
```bash
# Option A: Vercel Postgres
# Create database through Vercel dashboard

# Option B: External PostgreSQL
# Set up PostgreSQL instance (Supabase, Railway, etc.)
```

#### 2. Repository Setup
```bash
# Push your code to GitHub/GitLab
git add .
git commit -m "Initial commit"
git push origin main
```

#### 3. Vercel Configuration
1. **Connect Repository**: Link your GitHub/GitLab repository
2. **Configure Environment Variables**: Add all required environment variables
3. **Build Settings**: Vercel auto-detects Next.js configuration
4. **Deploy**: Vercel automatically builds and deploys

#### 4. Database Migration
```bash
# Run migrations after deployment
npx prisma migrate deploy
```

### Vercel Configuration File

Create `vercel.json` for advanced configuration:

```json
{
  "buildCommand": "yarn build",
  "outputDirectory": ".next",
  "installCommand": "yarn install",
  "framework": "nextjs",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "SKIP_ENV_VALIDATION": "1"
  }
}
```

## 2. Docker Deployment

Docker provides a consistent deployment environment across different platforms.

### Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
# Use the official Node.js image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml` for local development:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/psikotest
      - NEXTAUTH_SECRET=your-secret-key
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=psikotest
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Docker Commands

```bash
# Build the image
docker build -t psikotest-app .

# Run with Docker Compose
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy

# View logs
docker-compose logs -f app
```

## 3. Manual Server Deployment

For deployment on VPS or dedicated servers.

### Prerequisites
- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+ installed
- PostgreSQL installed and configured
- Nginx (recommended for reverse proxy)
- PM2 (for process management)

### Step-by-Step Setup

#### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Nginx
sudo apt install nginx

# Install PM2
sudo npm install -g pm2
```

#### 2. Database Setup
```bash
# Create database user
sudo -u postgres createuser --interactive
# Follow prompts to create user

# Create database
sudo -u postgres createdb psikotest

# Set password
sudo -u postgres psql
ALTER USER username PASSWORD 'password';
\q
```

#### 3. Application Deployment
```bash
# Clone repository
git clone <your-repository-url>
cd psikotest-app-v2

# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
yarn db:generate

# Run migrations
yarn db:migrate

# Build application
yarn build
```

#### 4. PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'psikotest-app',
    script: 'yarn',
    args: 'start',
    cwd: '/path/to/your/app',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

#### 5. Start Application
```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

#### 6. Nginx Configuration

Create `/etc/nginx/sites-available/psikotest`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/psikotest /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 7. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 4. Railway Deployment

Railway provides a simple deployment platform with built-in PostgreSQL.

### Step-by-Step Deployment

#### 1. Railway Setup
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init
```

#### 2. Database Setup
```bash
# Add PostgreSQL service
railway add postgresql

# Get database URL
railway variables
```

#### 3. Environment Configuration
```bash
# Set environment variables
railway variables set NEXTAUTH_SECRET=your-secret-key
railway variables set NEXTAUTH_URL=https://your-app.railway.app
```

#### 4. Deploy
```bash
# Deploy application
railway up
```

## Database Migration Strategies

### Production Migration Best Practices

#### 1. Backup Before Migration
```bash
# Create backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore if needed
psql $DATABASE_URL < backup_file.sql
```

#### 2. Zero-Downtime Migration
```bash
# Use Prisma's migration preview
npx prisma migrate diff --preview-feature

# Apply migrations
npx prisma migrate deploy
```

#### 3. Rollback Strategy
```bash
# Create rollback migration if needed
npx prisma migrate resolve --rolled-back migration_name
```

## Monitoring and Maintenance

### Health Checks

Create a health check endpoint in `src/app/api/health/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET() {
  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Database connection failed",
      },
      { status: 503 }
    );
  }
}
```

### Logging

Configure structured logging:

```typescript
// src/lib/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Performance Monitoring

#### Application Metrics
- Response times
- Error rates
- Memory usage
- Database query performance

#### Database Monitoring
```sql
-- Monitor slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Monitor database size
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next node_modules
yarn install
yarn build
```

#### Database Connection Issues
```bash
# Test database connection
npx prisma db pull

# Reset database (development only)
npx prisma migrate reset
```

#### Memory Issues
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" yarn build
```

#### SSL Certificate Issues
```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

### Performance Optimization

#### Database Optimization
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_ist_invitation_secret_key ON "IstInvitation"("secretKey");
CREATE INDEX idx_ist_result_invitation_id ON "IstResult"("istInvitationId");

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM "IstInvitation" WHERE "secretKey" = 'example';
```

#### Application Optimization
```typescript
// Enable Next.js compression
/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  experimental: {
    optimizeCss: true,
  },
};
```

## Security Checklist

### Pre-Deployment Security
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] SSL certificates configured
- [ ] Security headers implemented
- [ ] Input validation enabled
- [ ] Rate limiting configured

### Post-Deployment Security
- [ ] Regular security updates
- [ ] Database backups automated
- [ ] Monitoring alerts configured
- [ ] Access logs reviewed
- [ ] Vulnerability scans performed

## Backup and Recovery

### Automated Backups
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="psikotest"

# Create backup
pg_dump $DATABASE_URL > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

# Upload to cloud storage (optional)
# aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://your-backup-bucket/
```

### Recovery Procedures
```bash
# Restore from backup
gunzip backup_file.sql.gz
psql $DATABASE_URL < backup_file.sql

# Verify restoration
npx prisma db pull
```

This deployment guide covers the most common deployment scenarios. Choose the option that best fits your infrastructure requirements and technical expertise.