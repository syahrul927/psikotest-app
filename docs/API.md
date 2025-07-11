# API Documentation

## Overview

The Psikotest App v2 uses tRPC for type-safe API communication between the client and server. All API endpoints are automatically typed and validated using Zod schemas.

## Base Configuration

### tRPC Setup
- **Base URL**: `/api/trpc`
- **Serialization**: SuperJSON for complex data types
- **Error Handling**: Structured error responses with codes
- **Authentication**: Session-based with NextAuth.js

### Response Format
All API responses follow a consistent structure:
```typescript
{
  data?: T;           // Response data (on success)
  error?: {           // Error information (on failure)
    code: string;
    message: string;
    data?: any;
  }
}
```

## Authentication

### Session Management
- **Provider**: NextAuth.js with Prisma adapter
- **Session Duration**: 30 days (configurable)
- **Refresh**: Automatic session refresh
- **Security**: HTTP-only cookies with CSRF protection

### Protected Routes
Protected procedures require valid authentication:
```typescript
// Example protected procedure
export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.session?.user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
```

## API Routers

### 1. IST Invitation Router (`/api/trpc/istInvitation`)

#### Protected Endpoints

##### `getAll`
Get all IST invitations with summary statistics.

**Input**: None
**Output**:
```typescript
{
  total: number;
  pending: number;
  onprogress: number;
  done: number;
  invitations: Array<{
    id: string;
    name: string | null;
    status: StatusIstInvitation;
    secretKey: string;
    testerProfile: {
      name: string;
    } | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
}
```

##### `save`
Create a new IST invitation.

**Input**:
```typescript
{
  name?: string;
}
```
**Output**:
```typescript
{
  id: string;
  secretKey: string;
}
```

##### `delete`
Delete an IST invitation by ID.

**Input**:
```typescript
{
  id: string;
}
```
**Output**: `void`

#### Public Endpoints

##### `find`
Find an IST invitation by secret key.

**Input**:
```typescript
{
  secretKey: string;
}
```
**Output**:
```typescript
{
  invitationName: string | null;
  status: StatusIstInvitation;
}
```

##### `confirmation`
Confirm access to an IST invitation.

**Input**:
```typescript
{
  id: string;
  secretKey: string;
}
```
**Output**:
```typescript
{
  step: number; // 0 = profile, 1 = test
}
```

##### `updateProfile`
Update tester profile for an IST invitation.

**Input**:
```typescript
{
  invitationId: string;
  name: string;
  phone: string;
  address: string;
  educationId: string;
  educationName: string;
  educationDescription?: string;
  placeOfBirth: string;
  dateOfBirth: Date;
}
```
**Output**: `void`

##### `startInvitation`
Start an IST test session.

**Input**:
```typescript
{
  invitationId: string;
}
```
**Output**: `void`

### 2. IST Test Router (`/api/trpc/istTest`)

#### Public Endpoints

##### `getAllSubtest`
Get all available IST subtests.

**Input**: None
**Output**:
```typescript
Array<{
  id: string;
  name: string;
  description: string;
  timeLimit: number;
}>
```

##### `getSubtestSession`
Get current subtest session information.

**Input**:
```typescript
{
  invitationId: string;
  subtestId: string;
}
```
**Output**:
```typescript
{
  id: string;
  startedAt: Date | null;
  submittedAt: Date | null;
  questionOrder: string[];
  questions: Array<{
    id: string;
    text: string | null;
    imageUrl: string | null;
    options: Array<{
      label: string;
      text: string | null;
      imageUrl: string | null;
    }>;
  }>;
}
```

##### `updateSession`
Update session with test answers.

**Input**:
```typescript
{
  sessionId: string;
  answers: Array<{
    questionId: string;
    answer: string;
  }>;
  isSubmitted: boolean;
}
```
**Output**: `void`

### 3. IST Review Router (`/api/trpc/istReview`)

#### Protected Endpoints

##### `getProfile`
Get tester profile for review.

**Input**:
```typescript
{
  invitationId: string;
}
```
**Output**:
```typescript
{
  name: string;
  phone: string;
  address: string;
  educationName: string;
  educationDescription: string | null;
  placeOfBirth: string;
  dateOfBirth: Date;
}
```

##### `getAnswerReview`
Get test answers for review.

**Input**:
```typescript
{
  invitationId: string;
}
```
**Output**:
```typescript
Array<{
  subtestName: string;
  questions: Array<{
    id: string;
    text: string | null;
    imageUrl: string | null;
    answer: string;
    isCorrect: boolean | null;
    options: Array<{
      label: string;
      text: string | null;
      imageUrl: string | null;
    }>;
  }>;
}>
```

### 4. Kraepelin Invitation Router (`/api/trpc/kraepelinInvitation`)

#### Protected Endpoints

##### `getAll`
Get all Kraepelin invitations with summary.

**Input**: None
**Output**:
```typescript
{
  total: number;
  pending: number;
  onprogress: number;
  done: number;
  invitations: Array<{
    id: string;
    name: string | null;
    status: string;
    secretKey: string;
    startAt: Date | null;
    testerProfile: {
      name: string;
    } | null;
  }>;
}
```

##### `save`
Create a new Kraepelin invitation.

**Input**:
```typescript
{
  name?: string;
  startAt?: Date;
}
```
**Output**:
```typescript
{
  id: string;
  secretKey: string;
}
```

##### `delete`
Delete a Kraepelin invitation.

**Input**:
```typescript
{
  id: string;
}
```
**Output**: `void`

##### `getDetail`
Get detailed Kraepelin invitation information.

**Input**:
```typescript
{
  id: string;
}
```
**Output**:
```typescript
{
  id: string;
  name: string | null;
  secretKey: string;
  startAt: Date | null;
  testerProfile: {
    name: string;
    phone: string;
    address: string;
    educationName: string;
  } | null;
}
```

##### `getResult`
Get Kraepelin test results.

**Input**:
```typescript
{
  invitationId: string;
}
```
**Output**:
```typescript
{
  panker: number | null;
  highestJanker: number | null;
  lowestJanker: number | null;
  janker: number | null;
  tianker: number | null;
  hanker: number | null;
  totalAnswered: number | null;
  totalIncorrect: number | null;
  totalNotAnswered: number | null;
  summary: Array<{
    x: number;
    answered: number;
    correct: number | null;
    wrong: number | null;
  }>;
}
```

#### Public Endpoints

##### `find`
Find Kraepelin invitation by secret key.

**Input**:
```typescript
{
  secretKey: string;
}
```
**Output**:
```typescript
{
  invitationName: string | null;
  startAt: Date | null;
}
```

##### `confirmation`
Confirm access to Kraepelin invitation.

**Input**:
```typescript
{
  id: string;
  secretKey: string;
}
```
**Output**:
```typescript
{
  step: number; // 0 = profile, 1 = test
}
```

##### `updateProfile`
Update tester profile for Kraepelin invitation.

**Input**:
```typescript
{
  invitationId: string;
  name: string;
  phone: string;
  address: string;
  educationId: string;
  educationName: string;
  educationDescription?: string;
}
```
**Output**: `void`

##### `startInvitation`
Start Kraepelin test session.

**Input**:
```typescript
{
  invitationId: string;
}
```
**Output**: `void`

### 5. Kraepelin Test Router (`/api/trpc/kraepelinTest`)

#### Public Endpoints

##### `getLatest`
Get latest Kraepelin test session.

**Input**:
```typescript
{
  invitationId: string;
}
```
**Output**:
```typescript
{
  id: string;
  startAt: Date | null;
  isCompleted: boolean;
}
```

##### `getTemplate`
Get Kraepelin test template (number grid).

**Input**:
```typescript
{
  version?: string;
}
```
**Output**:
```typescript
Array<{
  x: number;
  y: number;
  value: number;
}>
```

##### `submitAnswer`
Submit Kraepelin test answer.

**Input**:
```typescript
{
  invitationId: string;
  xA: number;
  yA: number;
  xB: number;
  yB: number;
  a: number;
  b: number;
  value: number;
}
```
**Output**: `void`

### 6. User Access Router (`/api/trpc/userAccess`)

#### Protected Endpoints

##### `getAll`
Get all user accounts.

**Input**: None
**Output**:
```typescript
Array<{
  id: string;
  name: string | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
}>
```

##### `save`
Create a new user account.

**Input**:
```typescript
{
  name: string;
  email: string;
  password: string;
}
```
**Output**:
```typescript
{
  id: string;
}
```

##### `delete`
Delete a user account.

**Input**:
```typescript
{
  id: string;
}
```
**Output**: `void`

##### `getDetail`
Get detailed user information.

**Input**:
```typescript
{
  id: string;
}
```
**Output**:
```typescript
{
  id: string;
  name: string | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Handling

### Error Codes
- `UNAUTHORIZED`: User not authenticated
- `FORBIDDEN`: User lacks required permissions
- `NOT_FOUND`: Requested resource not found
- `BAD_REQUEST`: Invalid input data
- `INTERNAL_SERVER_ERROR`: Server-side error
- `CONFLICT`: Resource conflict (e.g., duplicate email)

### Error Response Format
```typescript
{
  error: {
    code: "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "CONFLICT";
    message: string;
    data?: {
      zodError?: ZodError; // For validation errors
      path?: string;       // API path where error occurred
    };
  }
}
```

## Rate Limiting

### Default Limits
- **Authenticated requests**: 1000 requests per hour
- **Public endpoints**: 100 requests per hour
- **Test submission**: 10 requests per minute

### Headers
Rate limit information is included in response headers:
- `X-RateLimit-Limit`: Request limit per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the rate limit resets

## Usage Examples

### Client-Side Usage with React

```typescript
import { api } from "@/trpc/react";

// Get all IST invitations
const { data, isLoading, error } = api.istInvitation.getAll.useQuery();

// Create new invitation
const createInvitation = api.istInvitation.save.useMutation({
  onSuccess: (data) => {
    console.log("Created invitation:", data.id);
  },
  onError: (error) => {
    console.error("Error:", error.message);
  },
});

// Submit test answers
const submitAnswers = api.istTest.updateSession.useMutation();
```

### Server-Side Usage

```typescript
import { api } from "@/trpc/server";

// In a server component or API route
const invitations = await api.istInvitation.getAll();
```

## Testing

### API Testing
Use the built-in tRPC testing utilities:

```typescript
import { createTRPCMsw } from "msw-trpc";
import { type AppRouter } from "@/server/api/root";

const trpcMsw = createTRPCMsw<AppRouter>();

// Mock API responses for testing
const handlers = [
  trpcMsw.istInvitation.getAll.query(() => {
    return {
      total: 5,
      pending: 2,
      onprogress: 1,
      done: 2,
      invitations: [],
    };
  }),
];
```

## Security Considerations

### Input Validation
- All inputs validated with Zod schemas
- SQL injection prevention with Prisma
- XSS protection with input sanitization

### Authentication
- Session-based authentication
- CSRF protection enabled
- Secure cookie configuration

### Authorization
- Role-based access control
- Resource-level permissions
- API endpoint protection

### Data Protection
- Sensitive data encryption
- Secure password hashing
- Environment variable protection