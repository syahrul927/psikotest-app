# Security Documentation

## Overview

Security is a critical aspect of the Psikotest App v2, given that it handles sensitive psychological assessment data. This document outlines the security measures, best practices, and guidelines implemented throughout the application.

## Security Architecture

### Defense in Depth

The application implements multiple layers of security:

1. **Network Security**: HTTPS/TLS encryption, secure headers
2. **Application Security**: Input validation, authentication, authorization
3. **Data Security**: Encryption at rest and in transit, secure storage
4. **Infrastructure Security**: Secure deployment, monitoring, logging

### Security Principles

- **Principle of Least Privilege**: Users and processes have minimal required permissions
- **Defense in Depth**: Multiple security layers protect against various attack vectors
- **Fail Secure**: System fails to a secure state when errors occur
- **Security by Design**: Security considerations integrated from the beginning
- **Zero Trust**: Never trust, always verify

## Authentication & Authorization

### Authentication System

#### NextAuth.js Implementation
```typescript
// src/server/auth/config.ts
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          return null;
        }

        const isValidPassword = await verify(user.password, credentials.password);
        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
```

#### Password Security
- **Hashing Algorithm**: Argon2 (recommended by OWASP)
- **Salt**: Automatically generated unique salt per password
- **Memory Cost**: 64 MB minimum
- **Time Cost**: 3 iterations minimum
- **Parallelism**: 4 threads

```typescript
import { hash, verify } from "argon2";

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, {
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,
    parallelism: 4,
  });
}

// Password verification
export async function verifyPassword(
  hashedPassword: string,
  password: string
): Promise<boolean> {
  return await verify(hashedPassword, password);
}
```

#### Session Management
- **Session Storage**: Database-backed sessions
- **Session Tokens**: Cryptographically secure random tokens
- **Session Expiry**: Configurable timeout (default: 30 days)
- **Session Invalidation**: Automatic cleanup of expired sessions

### Authorization System

#### Role-Based Access Control (RBAC)
```typescript
// User roles
enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  GUEST = "GUEST"
}

// Permission checking middleware
export const requireRole = (role: UserRole) => {
  return middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { role: true }
    });

    if (!user || user.role !== role) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return next();
  });
};
```

#### Resource-Level Authorization
```typescript
// Check invitation ownership
export const requireInvitationAccess = middleware(async ({ ctx, input, next }) => {
  const invitation = await ctx.db.istInvitation.findUnique({
    where: { id: input.invitationId },
    select: { createdBy: true }
  });

  if (!invitation || invitation.createdBy !== ctx.session.user.id) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next();
});
```

## Input Validation & Sanitization

### Zod Schema Validation

All API inputs are validated using Zod schemas:

```typescript
// Input validation schemas
export const createInvitationSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Invalid characters"),
  
  email: z.string()
    .email("Invalid email format")
    .max(255, "Email too long"),
    
  startDate: z.date()
    .min(new Date(), "Start date must be in the future"),
    
  settings: z.object({
    timeLimit: z.number()
      .int("Time limit must be integer")
      .min(60, "Minimum 1 minute")
      .max(7200, "Maximum 2 hours"),
  }).optional(),
});

// Usage in tRPC procedure
export const createInvitation = protectedProcedure
  .input(createInvitationSchema)
  .mutation(async ({ ctx, input }) => {
    // Input is automatically validated and typed
    return await ctx.db.istInvitation.create({
      data: input,
    });
  });
```

### SQL Injection Prevention

- **Prisma ORM**: Automatically prevents SQL injection through parameterized queries
- **No Raw SQL**: Avoid raw SQL queries; use Prisma's type-safe query builder
- **Input Sanitization**: All inputs validated before database operations

```typescript
// ✅ Safe: Prisma parameterized query
const user = await db.user.findUnique({
  where: { email: userInput.email }
});

// ❌ Dangerous: Raw SQL (avoid)
const user = await db.$queryRaw`
  SELECT * FROM User WHERE email = ${userInput.email}
`;

// ✅ Safe: If raw SQL needed, use proper parameterization
const user = await db.$queryRaw`
  SELECT * FROM User WHERE email = ${userInput.email}
`;
```

### XSS Prevention

#### Content Security Policy (CSP)
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
];
```

#### Output Encoding
```typescript
// React automatically escapes content
const SafeComponent = ({ userContent }: { userContent: string }) => {
  return (
    <div>
      {/* Automatically escaped */}
      <p>{userContent}</p>
      
      {/* For HTML content, use DOMPurify */}
      <div 
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(userContent)
        }}
      />
    </div>
  );
};
```

## Data Protection

### Encryption

#### Data at Rest
- **Database Encryption**: PostgreSQL TDE (Transparent Data Encryption)
- **File Encryption**: Encrypted file storage for uploaded content
- **Backup Encryption**: Encrypted database backups

```sql
-- Enable encryption at rest (PostgreSQL)
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET ssl_cert_file = 'server.crt';
ALTER SYSTEM SET ssl_key_file = 'server.key';
```

#### Data in Transit
- **HTTPS/TLS 1.3**: All communication encrypted
- **HSTS**: HTTP Strict Transport Security enabled
- **Certificate Pinning**: For mobile applications

```typescript
// HSTS header configuration
{
  key: 'Strict-Transport-Security',
  value: 'max-age=31536000; includeSubDomains; preload'
}
```

### Sensitive Data Handling

#### Personal Information
```typescript
// Data classification
interface SensitiveData {
  // PII - Personally Identifiable Information
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: Date;
  
  // Test Data - Confidential
  testAnswers: TestAnswer[];
  testResults: TestResult[];
  psychologicalProfile: Profile;
}

// Data access logging
export const logDataAccess = async (
  userId: string,
  dataType: string,
  action: string,
  resourceId: string
) => {
  await db.auditLog.create({
    data: {
      userId,
      action: `${action}_${dataType}`,
      resourceId,
      timestamp: new Date(),
      ipAddress: getClientIP(),
      userAgent: getUserAgent(),
    },
  });
};
```

#### Data Retention
```typescript
// Data retention policies
export const dataRetentionPolicies = {
  testResults: {
    retentionPeriod: 7 * 365 * 24 * 60 * 60 * 1000, // 7 years
    anonymizationPeriod: 2 * 365 * 24 * 60 * 60 * 1000, // 2 years
  },
  sessionLogs: {
    retentionPeriod: 90 * 24 * 60 * 60 * 1000, // 90 days
  },
  auditLogs: {
    retentionPeriod: 365 * 24 * 60 * 60 * 1000, // 1 year
  },
};

// Automated cleanup job
export const cleanupExpiredData = async () => {
  const cutoffDate = new Date(Date.now() - dataRetentionPolicies.sessionLogs.retentionPeriod);
  
  await db.session.deleteMany({
    where: {
      expires: {
        lt: cutoffDate,
      },
    },
  });
};
```

## API Security

### Rate Limiting

```typescript
// Rate limiting configuration
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit login attempts
  skipSuccessfulRequests: true,
  message: 'Too many login attempts',
});

// Usage in API routes
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return apiLimiter(req, res, () => {
    // Handle request
  });
}
```

### CORS Configuration

```typescript
// CORS settings
export const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://app.yourdomain.com']
    : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
```

### API Authentication

```typescript
// API key authentication for external integrations
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  const hashedKey = await hash(apiKey);
  
  const validKey = await db.apiKey.findFirst({
    where: {
      keyHash: hashedKey,
      isActive: true,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
  
  return !!validKey;
};

// JWT token validation
export const validateJWT = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
  } catch (error) {
    return null;
  }
};
```

## Infrastructure Security

### Environment Variables

```bash
# Secure environment variable management
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
NEXTAUTH_SECRET=<cryptographically-strong-secret>
NEXTAUTH_URL=https://yourdomain.com

# Encryption keys
ENCRYPTION_KEY=<32-byte-hex-key>
JWT_SECRET=<jwt-signing-secret>

# Third-party API keys (encrypted)
SMTP_PASSWORD=<encrypted-password>
STORAGE_ACCESS_KEY=<encrypted-key>
```

### Secure Headers

```typescript
// Security headers middleware
export const securityHeaders = {
  'X-DNS-Prefetch-Control': 'off',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "font-src 'self'",
    "object-src 'none'",
    "media-src 'self'",
    "frame-src 'none'",
  ].join('; '),
};
```

### Database Security

```sql
-- Database security configuration
-- Enable SSL connections
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET ssl_ciphers = 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256';

-- Restrict connections
ALTER SYSTEM SET listen_addresses = 'localhost';
ALTER SYSTEM SET max_connections = 100;

-- Enable logging
ALTER SYSTEM SET log_statement = 'mod';
ALTER SYSTEM SET log_min_duration_statement = 1000;

-- Create restricted user for application
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE psikotest TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
```

## Monitoring & Logging

### Security Monitoring

```typescript
// Security event logging
export interface SecurityEvent {
  type: 'AUTH_FAILURE' | 'SUSPICIOUS_ACTIVITY' | 'DATA_ACCESS' | 'PRIVILEGE_ESCALATION';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  details: Record<string, any>;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export const logSecurityEvent = async (event: SecurityEvent) => {
  // Log to database
  await db.securityLog.create({
    data: event,
  });
  
  // Alert on high severity events
  if (event.severity === 'HIGH' || event.severity === 'CRITICAL') {
    await sendSecurityAlert(event);
  }
};

// Usage examples
await logSecurityEvent({
  type: 'AUTH_FAILURE',
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  timestamp: new Date(),
  details: { email: attemptedEmail, reason: 'invalid_password' },
  severity: 'MEDIUM',
});
```

### Audit Logging

```typescript
// Comprehensive audit trail
export const auditAction = async (
  action: string,
  userId: string,
  resourceType: string,
  resourceId: string,
  changes?: Record<string, any>
) => {
  await db.auditLog.create({
    data: {
      action,
      userId,
      resourceType,
      resourceId,
      changes: changes ? JSON.stringify(changes) : null,
      timestamp: new Date(),
      ipAddress: getClientIP(),
      userAgent: getUserAgent(),
    },
  });
};

// Usage in mutations
export const updateInvitation = protectedProcedure
  .input(updateInvitationSchema)
  .mutation(async ({ ctx, input }) => {
    const oldInvitation = await ctx.db.istInvitation.findUnique({
      where: { id: input.id },
    });
    
    const updatedInvitation = await ctx.db.istInvitation.update({
      where: { id: input.id },
      data: input,
    });
    
    await auditAction(
      'UPDATE_INVITATION',
      ctx.session.user.id,
      'IstInvitation',
      input.id,
      { old: oldInvitation, new: updatedInvitation }
    );
    
    return updatedInvitation;
  });
```

## Compliance & Privacy

### GDPR Compliance

#### Data Subject Rights
```typescript
// Right to access
export const exportUserData = async (userId: string) => {
  const userData = await db.user.findUnique({
    where: { id: userId },
    include: {
      istInvitations: {
        include: {
          testerProfile: true,
          results: true,
        },
      },
      auditLogs: true,
    },
  });
  
  return {
    personalData: userData,
    exportDate: new Date(),
    format: 'JSON',
  };
};

// Right to deletion
export const deleteUserData = async (userId: string) => {
  await db.$transaction(async (tx) => {
    // Anonymize test results (retain for research)
    await tx.istResult.updateMany({
      where: { invitation: { testerProfileId: userId } },
      data: { anonymized: true },
    });
    
    // Delete personal information
    await tx.istTesterProfile.delete({
      where: { id: userId },
    });
    
    // Log deletion
    await tx.auditLog.create({
      data: {
        action: 'DELETE_USER_DATA',
        userId,
        resourceType: 'User',
        resourceId: userId,
        timestamp: new Date(),
      },
    });
  });
};

// Right to rectification
export const updateUserData = async (userId: string, updates: Partial<UserData>) => {
  const updatedUser = await db.user.update({
    where: { id: userId },
    data: updates,
  });
  
  await auditAction('RECTIFY_USER_DATA', userId, 'User', userId, updates);
  return updatedUser;
};
```

#### Consent Management
```typescript
// Consent tracking
export interface ConsentRecord {
  userId: string;
  consentType: 'DATA_PROCESSING' | 'MARKETING' | 'ANALYTICS';
  granted: boolean;
  timestamp: Date;
  ipAddress: string;
  version: string; // Privacy policy version
}

export const recordConsent = async (consent: ConsentRecord) => {
  await db.consent.create({
    data: consent,
  });
};

export const checkConsent = async (userId: string, consentType: string): Promise<boolean> => {
  const latestConsent = await db.consent.findFirst({
    where: { userId, consentType },
    orderBy: { timestamp: 'desc' },
  });
  
  return latestConsent?.granted ?? false;
};
```

### Data Classification

```typescript
// Data sensitivity levels
export enum DataSensitivity {
  PUBLIC = 'PUBLIC',           // No restrictions
  INTERNAL = 'INTERNAL',       // Internal use only
  CONFIDENTIAL = 'CONFIDENTIAL', // Restricted access
  RESTRICTED = 'RESTRICTED',   // Highly sensitive
}

// Data classification mapping
export const dataClassification = {
  'User.email': DataSensitivity.CONFIDENTIAL,
  'User.name': DataSensitivity.CONFIDENTIAL,
  'IstTesterProfile.*': DataSensitivity.RESTRICTED,
  'IstResult.*': DataSensitivity.RESTRICTED,
  'AuditLog.*': DataSensitivity.CONFIDENTIAL,
  'SecurityLog.*': DataSensitivity.RESTRICTED,
};
```

## Security Testing

### Automated Security Testing

```typescript
// Security test suite
describe('Security Tests', () => {
  describe('Authentication', () => {
    it('should reject weak passwords', async () => {
      const weakPasswords = ['123456', 'password', 'qwerty'];
      
      for (const password of weakPasswords) {
        const result = await createUser({
          email: 'test@example.com',
          password,
        });
        
        expect(result.error).toContain('Password too weak');
      }
    });
    
    it('should rate limit login attempts', async () => {
      const attempts = Array(10).fill(null).map(() => 
        login('test@example.com', 'wrongpassword')
      );
      
      const results = await Promise.all(attempts);
      const rateLimited = results.filter(r => r.error === 'Rate limited');
      
      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });
  
  describe('Authorization', () => {
    it('should prevent unauthorized access to admin routes', async () => {
      const userToken = await getUserToken('user@example.com');
      
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });
  
  describe('Input Validation', () => {
    it('should sanitize XSS attempts', async () => {
      const xssPayload = '<script>alert("xss")</script>';
      
      const result = await createInvitation({
        name: xssPayload,
      });
      
      expect(result.name).not.toContain('<script>');
    });
  });
});
```

### Penetration Testing

```bash
# Security scanning tools
# OWASP ZAP
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3000

# SQLMap (for SQL injection testing)
sqlmap -u "http://localhost:3000/api/test" --data="param=value" --dbs

# Nmap (for port scanning)
nmap -sV -sC localhost

# SSL Labs test (for production)
curl -s "https://api.ssllabs.com/api/v3/analyze?host=yourdomain.com"
```

## Incident Response

### Security Incident Handling

```typescript
// Incident response workflow
export interface SecurityIncident {
  id: string;
  type: 'DATA_BREACH' | 'UNAUTHORIZED_ACCESS' | 'MALWARE' | 'DDOS';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  detectedAt: Date;
  reportedBy: string;
  status: 'OPEN' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED';
  affectedUsers?: string[];
  affectedData?: string[];
  responseActions: string[];
}

export const handleSecurityIncident = async (incident: SecurityIncident) => {
  // Log incident
  await db.securityIncident.create({
    data: incident,
  });
  
  // Immediate response based on severity
  if (incident.severity === 'CRITICAL') {
    await emergencyResponse(incident);
  }
  
  // Notify security team
  await notifySecurityTeam(incident);
  
  // Start investigation
  await startInvestigation(incident);
};

const emergencyResponse = async (incident: SecurityIncident) => {
  // Disable affected accounts
  if (incident.affectedUsers) {
    await db.user.updateMany({
      where: { id: { in: incident.affectedUsers } },
      data: { isActive: false },
    });
  }
  
  // Revoke sessions
  await db.session.deleteMany({
    where: { userId: { in: incident.affectedUsers } },
  });
  
  // Alert administrators
  await sendEmergencyAlert(incident);
};
```

### Breach Notification

```typescript
// GDPR breach notification (72-hour rule)
export const assessBreachNotification = async (incident: SecurityIncident) => {
  const riskAssessment = await assessDataBreachRisk(incident);
  
  if (riskAssessment.requiresNotification) {
    // Notify supervisory authority
    await notifyDataProtectionAuthority({
      incidentId: incident.id,
      nature: incident.type,
      categories: riskAssessment.dataCategories,
      approximateNumbers: riskAssessment.affectedCount,
      consequences: riskAssessment.likelyConsequences,
      measures: riskAssessment.mitigationMeasures,
    });
    
    // Notify affected individuals if high risk
    if (riskAssessment.highRisk) {
      await notifyAffectedUsers(incident.affectedUsers);
    }
  }
};
```

## Security Checklist

### Pre-Deployment Security Checklist

- [ ] **Authentication**
  - [ ] Strong password policy implemented
  - [ ] Password hashing with Argon2
  - [ ] Session management secure
  - [ ] Rate limiting on auth endpoints

- [ ] **Authorization**
  - [ ] Role-based access control implemented
  - [ ] Resource-level permissions checked
  - [ ] Principle of least privilege applied

- [ ] **Input Validation**
  - [ ] All inputs validated with Zod schemas
  - [ ] XSS prevention measures in place
  - [ ] SQL injection prevention verified

- [ ] **Data Protection**
  - [ ] Encryption at rest configured
  - [ ] HTTPS/TLS enforced
  - [ ] Sensitive data properly classified
  - [ ] Data retention policies implemented

- [ ] **Infrastructure**
  - [ ] Security headers configured
  - [ ] CORS properly configured
  - [ ] Environment variables secured
  - [ ] Database access restricted

- [ ] **Monitoring**
  - [ ] Security logging implemented
  - [ ] Audit trail comprehensive
  - [ ] Alerting configured
  - [ ] Incident response plan ready

- [ ] **Compliance**
  - [ ] GDPR compliance verified
  - [ ] Privacy policy updated
  - [ ] Consent management implemented
  - [ ] Data subject rights supported

### Regular Security Maintenance

#### Monthly Tasks
- [ ] Review security logs
- [ ] Update dependencies
- [ ] Rotate API keys
- [ ] Review user permissions

#### Quarterly Tasks
- [ ] Security assessment
- [ ] Penetration testing
- [ ] Policy review
- [ ] Training updates

#### Annual Tasks
- [ ] Full security audit
- [ ] Compliance review
- [ ] Incident response testing
- [ ] Security architecture review

This comprehensive security documentation ensures that the Psikotest App v2 maintains the highest standards of security and privacy protection for all users and their sensitive psychological assessment data.