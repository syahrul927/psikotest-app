# Database Documentation

## Overview

The Psikotest App v2 uses PostgreSQL as its primary database with Prisma ORM for type-safe database operations. This document provides comprehensive information about the database schema, relationships, and best practices.

## Database Schema

### Core Authentication Models

#### User
Stores application users and administrators.

```sql
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT UNIQUE,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
```

**Fields:**
- `id`: Unique identifier (CUID)
- `name`: User's display name
- `email`: Unique email address
- `password`: Argon2 hashed password
- `createdAt/updatedAt`: Timestamp tracking

#### Account & Session
NextAuth.js authentication tables for session management.

```sql
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "expires" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
```

### Test Taker Profiles

#### TesterProfile (Kraepelin)
Basic profile information for Kraepelin test takers.

```sql
CREATE TABLE "TesterProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "educationId" TEXT NOT NULL,
    "educationName" TEXT NOT NULL,
    "educationDescription" TEXT
);
```

#### IstTesterProfile (IST)
Extended profile information for IST test takers.

```sql
CREATE TABLE "IstTesterProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "educationId" TEXT NOT NULL,
    "placeOfBirth" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "educationName" TEXT NOT NULL,
    "educationDescription" TEXT
);
```

**Key Differences:**
- IST profiles include birth information for age-based scoring
- Separate tables allow for different profile requirements per test type

### IST (Intelligence Structure Test) Models

#### IstInvitation
Manages IST test invitations and sessions.

```sql
CREATE TABLE "IstInvitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "secretKey" TEXT NOT NULL,
    "status" "StatusIstInvitation" NOT NULL DEFAULT 'PENDING',
    "testerProfileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("testerProfileId") REFERENCES "IstTesterProfile"("id")
);

CREATE TYPE "StatusIstInvitation" AS ENUM ('PENDING', 'ONPROGRESS', 'AWAITING_REVIEW', 'DONE');
```

**Status Flow:**
1. `PENDING`: Invitation created, awaiting test taker
2. `ONPROGRESS`: Test taker has started the test
3. `AWAITING_REVIEW`: Test completed, awaiting admin review
4. `DONE`: Test reviewed and finalized

#### IstSubtestTemplate
Defines the structure and configuration of IST subtests.

```sql
CREATE TABLE "IstSubtestTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timeLimit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
```

**Fields:**
- `timeLimit`: Duration in seconds for the subtest
- `description`: Markdown-formatted instructions

#### IstQuestionTemplate
Individual questions within subtests.

```sql
CREATE TABLE "IstQuestionTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subtestTemplateId" TEXT NOT NULL,
    "text" TEXT,
    "imageUrl" TEXT,
    "correctAnswer" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("subtestTemplateId") REFERENCES "IstSubtestTemplate"("id")
);
```

**Question Types:**
- Text-based questions (`text` field populated)
- Image-based questions (`imageUrl` field populated)
- Mixed questions (both fields populated)

#### IstOptionTemplate
Multiple choice options for questions.

```sql
CREATE TABLE "IstOptionTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "text" TEXT,
    "imageUrl" TEXT,
    FOREIGN KEY ("questionId") REFERENCES "IstQuestionTemplate"("id")
);
```

**Option Types:**
- Text options (`text` field)
- Image options (`imageUrl` field)
- Labels: A, B, C, D, E

#### IstSubtestSession
Tracks individual test sessions for each subtest.

```sql
CREATE TABLE "IstSubtestSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "questionOrder" TEXT[],
    "subtestTemplateId" TEXT NOT NULL,
    "istInvitationId" TEXT NOT NULL,
    FOREIGN KEY ("subtestTemplateId") REFERENCES "IstSubtestTemplate"("id"),
    FOREIGN KEY ("istInvitationId") REFERENCES "IstInvitation"("id")
);
```

**Features:**
- `questionOrder`: Array of question IDs in presentation order
- Timing tracking with `startedAt` and `submittedAt`
- Supports question randomization

#### IstResult & IstResultDetail
Stores test results and detailed answer information.

```sql
CREATE TABLE "IstResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "istInvitationId" TEXT NOT NULL,
    "subtestTemplateId" TEXT NOT NULL,
    "answered" INTEGER,
    "missed" INTEGER,
    "answeredCorrectly" INTEGER,
    "answeredWrong" INTEGER,
    "standarizedScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("istInvitationId") REFERENCES "IstInvitation"("id"),
    FOREIGN KEY ("subtestTemplateId") REFERENCES "IstSubtestTemplate"("id")
);

CREATE TABLE "IstResultDetail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "istResultId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isCorrect" BOOLEAN,
    "score" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("istResultId") REFERENCES "IstResult"("id"),
    FOREIGN KEY ("questionId") REFERENCES "IstQuestionTemplate"("id")
);
```

#### IstStandardScore
Age-based scoring normalization table.

```sql
CREATE TABLE "IstStandardScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "age" INTEGER NOT NULL,
    "subtestTemplateId" TEXT NOT NULL,
    "rawScore" INTEGER NOT NULL,
    "standarizedScore" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("subtestTemplateId") REFERENCES "IstSubtestTemplate"("id")
);
```

### Kraepelin Test Models

#### Invitation (Kraepelin)
Manages Kraepelin test invitations.

```sql
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "secretKey" TEXT NOT NULL,
    "startAt" TIMESTAMP(3),
    "testerProfileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("testerProfileId") REFERENCES "TesterProfile"("id")
);
```

#### KraepelinTemplate
Number grid templates for Kraepelin tests.

```sql
CREATE TABLE "KraepelinTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "version" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "value" INTEGER NOT NULL
);

CREATE INDEX "KraepelinTemplate_version_x_y_idx" ON "KraepelinTemplate"("version", "x", "y");
```

**Grid Structure:**
- `x`: Column position (0-based)
- `y`: Row position (0-based)
- `value`: Single digit number (0-9)
- `version`: Template version identifier

#### KraepelinResult
Comprehensive performance analysis for Kraepelin tests.

```sql
CREATE TABLE "KraepelinResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invitationId" TEXT NOT NULL,
    "panker" DOUBLE PRECISION,
    "highestJanker" INTEGER,
    "lowestJanker" INTEGER,
    "janker" INTEGER,
    "tianker" INTEGER,
    "hanker" DOUBLE PRECISION,
    "totalAnswered" INTEGER,
    "totalIncorrect" INTEGER,
    "totalNotAnswered" INTEGER,
    "highestFilled" INTEGER,
    "lowestFilled" INTEGER,
    "deciel" DOUBLE PRECISION,
    "generated" BOOLEAN
);

CREATE INDEX "KraepelinResult_invitationId_idx" ON "KraepelinResult"("invitationId");
```

**Performance Metrics:**
- `panker`: Overall performance score
- `janker`: Consistency measure
- `tianker`: Speed measure
- `hanker`: Accuracy measure
- `deciel`: Percentile ranking

#### KraepelinResultSummary
Row-by-row performance summary.

```sql
CREATE TABLE "KraepelinResultSummary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kraepelinResultId" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "answered" INTEGER NOT NULL,
    "correct" INTEGER,
    "wrong" INTEGER,
    FOREIGN KEY ("kraepelinResultId") REFERENCES "KraepelinResult"("id")
);
```

#### KraepelinResultDetail
Individual answer details.

```sql
CREATE TABLE "KraepelinResultDetail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kraepelinResultId" TEXT NOT NULL,
    "xA" INTEGER NOT NULL,
    "yA" INTEGER NOT NULL,
    "xB" INTEGER NOT NULL,
    "yB" INTEGER NOT NULL,
    "a" INTEGER NOT NULL,
    "b" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("kraepelinResultId") REFERENCES "KraepelinResult"("id")
);
```

**Answer Structure:**
- `xA, yA`: Position of first number
- `xB, yB`: Position of second number
- `a, b`: The two numbers being added
- `value`: User's answer

## Database Relationships

### Entity Relationship Diagram

```
User
├── Account (1:N)
├── Session (1:N)

IstInvitation
├── IstTesterProfile (N:1)
├── IstSubtestSession (1:N)
└── IstResult (1:N)

IstSubtestTemplate
├── IstQuestionTemplate (1:N)
├── IstSubtestSession (1:N)
├── IstResult (1:N)
└── IstStandardScore (1:N)

IstQuestionTemplate
├── IstOptionTemplate (1:N)
└── IstResultDetail (1:N)

IstResult
└── IstResultDetail (1:N)

Invitation (Kraepelin)
├── TesterProfile (N:1)
└── KraepelinResult (1:1)

KraepelinResult
├── KraepelinResultSummary (1:N)
└── KraepelinResultDetail (1:N)
```

## Indexing Strategy

### Primary Indexes
All tables have primary key indexes on `id` fields using CUID.

### Secondary Indexes

#### Performance Indexes
```sql
-- IST Invitation lookup
CREATE INDEX "IstInvitation_secretKey_idx" ON "IstInvitation"("secretKey");
CREATE INDEX "IstInvitation_status_idx" ON "IstInvitation"("status");

-- Question ordering
CREATE INDEX "IstQuestionTemplate_subtestTemplateId_order_idx" 
ON "IstQuestionTemplate"("subtestTemplateId", "order");

-- Result analysis
CREATE INDEX "IstResult_istInvitationId_idx" ON "IstResult"("istInvitationId");
CREATE INDEX "IstResultDetail_questionId_idx" ON "IstResultDetail"("questionId");

-- Kraepelin grid lookup
CREATE INDEX "KraepelinTemplate_version_x_y_idx" 
ON "KraepelinTemplate"("version", "x", "y");

-- Performance analysis
CREATE INDEX "KraepelinResult_invitationId_idx" ON "KraepelinResult"("invitationId");
```

#### Composite Indexes
```sql
-- User session lookup
CREATE INDEX "Session_userId_expires_idx" ON "Session"("userId", "expires");

-- Standard score lookup
CREATE INDEX "IstStandardScore_age_subtestTemplateId_rawScore_idx" 
ON "IstStandardScore"("age", "subtestTemplateId", "rawScore");
```

## Data Types and Constraints

### Custom Types
```sql
-- IST invitation status enum
CREATE TYPE "StatusIstInvitation" AS ENUM (
    'PENDING',
    'ONPROGRESS', 
    'AWAITING_REVIEW',
    'DONE'
);
```

### Constraints

#### Unique Constraints
```sql
-- Prevent duplicate secret keys
ALTER TABLE "IstInvitation" ADD CONSTRAINT "IstInvitation_secretKey_unique" 
UNIQUE ("secretKey");

-- Prevent duplicate emails
ALTER TABLE "User" ADD CONSTRAINT "User_email_unique" 
UNIQUE ("email");

-- Prevent duplicate session tokens
ALTER TABLE "Session" ADD CONSTRAINT "Session_sessionToken_unique" 
UNIQUE ("sessionToken");
```

#### Check Constraints
```sql
-- Ensure valid time limits
ALTER TABLE "IstSubtestTemplate" ADD CONSTRAINT "IstSubtestTemplate_timeLimit_check" 
CHECK ("timeLimit" > 0);

-- Ensure valid ages
ALTER TABLE "IstStandardScore" ADD CONSTRAINT "IstStandardScore_age_check" 
CHECK ("age" >= 16 AND "age" <= 65);

-- Ensure valid grid coordinates
ALTER TABLE "KraepelinTemplate" ADD CONSTRAINT "KraepelinTemplate_coordinates_check" 
CHECK ("x" >= 0 AND "y" >= 0);

-- Ensure valid single digits
ALTER TABLE "KraepelinTemplate" ADD CONSTRAINT "KraepelinTemplate_value_check" 
CHECK ("value" >= 0 AND "value" <= 9);
```

## Query Optimization

### Common Query Patterns

#### IST Invitation Lookup
```sql
-- Optimized invitation lookup with profile
SELECT 
    i.id,
    i.name,
    i.status,
    i.secretKey,
    p.name as tester_name
FROM "IstInvitation" i
LEFT JOIN "IstTesterProfile" p ON i."testerProfileId" = p.id
WHERE i."secretKey" = $1;
```

#### Test Results with Details
```sql
-- Efficient result retrieval with question details
SELECT 
    r.id,
    r.answered,
    r.answeredCorrectly,
    r.standarizedScore,
    rd.questionId,
    rd.answer,
    rd.isCorrect,
    q.text as question_text
FROM "IstResult" r
JOIN "IstResultDetail" rd ON r.id = rd."istResultId"
JOIN "IstQuestionTemplate" q ON rd."questionId" = q.id
WHERE r."istInvitationId" = $1
ORDER BY q."order";
```

#### Kraepelin Performance Analysis
```sql
-- Comprehensive Kraepelin analysis
SELECT 
    r.panker,
    r.totalAnswered,
    r.totalIncorrect,
    s.x as column_number,
    s.answered as column_answered,
    s.correct as column_correct
FROM "KraepelinResult" r
LEFT JOIN "KraepelinResultSummary" s ON r.id = s."kraepelinResultId"
WHERE r."invitationId" = $1
ORDER BY s.x;
```

### Performance Tips

#### Query Optimization
1. **Use appropriate indexes** for WHERE clauses
2. **Limit SELECT fields** to only what's needed
3. **Use JOINs efficiently** with proper foreign key relationships
4. **Implement pagination** for large result sets

#### Connection Management
```typescript
// Prisma connection pooling configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});

// Connection pool settings in DATABASE_URL
// postgresql://user:pass@host:port/db?connection_limit=20&pool_timeout=20
```

## Migration Management

### Migration Best Practices

#### Development Migrations
```bash
# Create new migration
npx prisma migrate dev --name add_new_feature

# Reset database (development only)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

#### Production Migrations
```bash
# Deploy migrations to production
npx prisma migrate deploy

# Check migration status
npx prisma migrate status
```

#### Migration Safety
1. **Always backup** before production migrations
2. **Test migrations** in staging environment
3. **Use transactions** for complex migrations
4. **Plan rollback strategy** for each migration

### Custom Migration Example
```sql
-- Migration: Add performance indexes
-- Up migration
CREATE INDEX CONCURRENTLY "IstResult_performance_idx" 
ON "IstResult"("istInvitationId", "standarizedScore");

CREATE INDEX CONCURRENTLY "KraepelinResult_performance_idx" 
ON "KraepelinResult"("invitationId", "panker");

-- Down migration (if needed)
-- DROP INDEX "IstResult_performance_idx";
-- DROP INDEX "KraepelinResult_performance_idx";
```

## Data Seeding

### Seed Script Structure
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: await hash('admin123'),
    },
  });

  // Create IST subtest templates
  const istSubtest = await prisma.istSubtestTemplate.create({
    data: {
      name: 'Verbal Reasoning',
      description: 'Test of verbal intelligence and reasoning',
      timeLimit: 900, // 15 minutes
      questions: {
        create: [
          {
            text: 'Sample question text',
            correctAnswer: 'A',
            order: 1,
            options: {
              create: [
                { label: 'A', text: 'Option A' },
                { label: 'B', text: 'Option B' },
                { label: 'C', text: 'Option C' },
                { label: 'D', text: 'Option D' },
              ],
            },
          },
        ],
      },
    },
  });

  // Create Kraepelin template
  const kraepelinTemplate = [];
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 20; y++) {
      kraepelinTemplate.push({
        version: 'v1',
        x,
        y,
        value: Math.floor(Math.random() * 10),
      });
    }
  }

  await prisma.kraepelinTemplate.createMany({
    data: kraepelinTemplate,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Running Seeds
```bash
# Run seed script
npx prisma db seed

# Or with custom script
npx tsx prisma/seed.ts
```

## Backup and Recovery

### Backup Strategies

#### Automated Backups
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Create backup
pg_dump $DATABASE_URL > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Remove old backups (keep 30 days)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

#### Point-in-Time Recovery
```bash
# Create base backup
pg_basebackup -D /backup/base -Ft -z -P

# Restore to specific point in time
pg_ctl start -D /backup/base -o "-c recovery_target_time='2024-01-01 12:00:00'"
```

### Recovery Procedures
```bash
# Restore from backup
gunzip backup_file.sql.gz
psql $DATABASE_URL < backup_file.sql

# Verify restoration
npx prisma db pull
npx prisma generate
```

## Monitoring and Maintenance

### Performance Monitoring
```sql
-- Monitor slow queries
SELECT 
    query,
    mean_time,
    calls,
    total_time
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Monitor table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY size_bytes DESC;

-- Monitor index usage
SELECT 
    indexrelname,
    idx_tup_read,
    idx_tup_fetch,
    idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### Maintenance Tasks
```sql
-- Update table statistics
ANALYZE;

-- Rebuild indexes (if needed)
REINDEX INDEX CONCURRENTLY index_name;

-- Clean up old data (example)
DELETE FROM "Session" WHERE expires < NOW() - INTERVAL '30 days';
```

This comprehensive database documentation provides all the information needed to understand, maintain, and optimize the Psikotest App v2 database.