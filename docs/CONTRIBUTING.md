# Contributing Guide

## Welcome Contributors! 🎉

Thank you for your interest in contributing to the Psikotest App v2! This guide will help you get started with contributing to our psychological testing platform.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Process](#contributing-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Issue Guidelines](#issue-guidelines)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone, regardless of:
- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, nationality, personal appearance, race, religion
- Sexual identity and orientation

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or discriminatory comments
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

Before contributing, ensure you have:
- **Node.js** (v18.17 or later)
- **PostgreSQL** (v12 or later)
- **Yarn** (v1.22 or later)
- **Git** for version control
- A **GitHub account**

### Areas for Contribution

We welcome contributions in these areas:

#### 🐛 Bug Fixes
- Fix reported issues
- Improve error handling
- Resolve performance problems

#### ✨ Features
- New test types or assessment methods
- UI/UX improvements
- Accessibility enhancements
- Mobile optimizations

#### 📚 Documentation
- API documentation
- User guides
- Code comments
- Architecture documentation

#### 🧪 Testing
- Unit tests
- Integration tests
- E2E tests
- Performance tests

#### 🎨 Design
- UI components
- User experience improvements
- Accessibility features
- Mobile responsiveness

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/psikotest-app-v2.git
cd psikotest-app-v2

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/psikotest-app-v2.git
```

### 2. Install Dependencies

```bash
# Install project dependencies
yarn install

# Install development tools (optional)
yarn global add @prisma/cli
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Configure your local environment
# Edit .env with your local database credentials
```

### 4. Database Setup

```bash
# Start PostgreSQL (if using Docker)
docker run --name psikotest-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=psikotest -p 5432:5432 -d postgres:15

# Generate Prisma client
yarn db:generate

# Run database migrations
yarn db:migrate

# (Optional) Seed database with test data
yarn db:seed
```

### 5. Start Development Server

```bash
# Start the development server
yarn dev

# Open http://localhost:3000 in your browser
```

### 6. Verify Setup

```bash
# Run all checks
yarn check

# Run tests
yarn test

# Check code formatting
yarn format:check
```

## Contributing Process

### 1. Choose an Issue

- Browse [open issues](https://github.com/OWNER/psikotest-app-v2/issues)
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to express interest
- Wait for maintainer assignment before starting work

### 2. Create a Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

### 3. Make Changes

- Follow our [coding standards](#coding-standards)
- Write tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 4. Commit Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add new IST subtest template feature"

# Push to your fork
git push origin feature/your-feature-name
```

### 5. Create Pull Request

- Open a pull request from your fork to the main repository
- Fill out the pull request template
- Link any related issues
- Request review from maintainers

## Coding Standards

### TypeScript Guidelines

#### Type Safety
```typescript
// ✅ Good: Explicit types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ❌ Avoid: Any types
const user: any = getUserData();

// ✅ Good: Proper type inference
const users = await db.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});
```

#### Naming Conventions
```typescript
// ✅ Good: Descriptive names
const calculateIstScore = (answers: IstAnswer[]) => { ... };
const IstTestComponent = () => { ... };
const IST_SUBTEST_TYPES = { ... };

// ❌ Avoid: Unclear names
const calc = (data: any[]) => { ... };
const Comp = () => { ... };
const TYPES = { ... };
```

### React Guidelines

#### Component Structure
```typescript
// ✅ Good: Proper component structure
interface IstQuestionProps {
  question: IstQuestion;
  onAnswer: (answer: string) => void;
  isDisabled?: boolean;
}

export const IstQuestion: React.FC<IstQuestionProps> = ({
  question,
  onAnswer,
  isDisabled = false,
}) => {
  // Component logic here
  return (
    <div className="ist-question">
      {/* Component JSX */}
    </div>
  );
};
```

#### Hooks Usage
```typescript
// ✅ Good: Custom hooks for reusable logic
const useIstTimer = (duration: number) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Timer logic
  }, [isActive, timeLeft]);

  return { timeLeft, isActive, start: () => setIsActive(true) };
};
```

### API Guidelines

#### tRPC Procedures
```typescript
// ✅ Good: Proper input validation
export const istRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        subtestIds: z.array(z.string().uuid()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Implementation
    }),
});
```

#### Error Handling
```typescript
// ✅ Good: Structured error handling
try {
  const result = await db.istInvitation.create({ data: input });
  return result;
} catch (error) {
  if (error instanceof PrismaClientKnownRequestError) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Invitation already exists",
    });
  }
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Failed to create invitation",
  });
}
```

### Database Guidelines

#### Prisma Schema
```prisma
// ✅ Good: Descriptive model names and fields
model IstInvitation {
  id              String   @id @default(cuid())
  name            String?
  secretKey       String   @unique
  status          IstInvitationStatus @default(PENDING)
  createdAt       DateTime @default(now()) @db.Timestamptz(3)
  updatedAt       DateTime @updatedAt @db.Timestamptz(3)
  
  // Relations
  testerProfile   IstTesterProfile? @relation(fields: [testerProfileId], references: [id])
  testerProfileId String?
  
  @@index([secretKey])
  @@index([status])
}
```

#### Query Optimization
```typescript
// ✅ Good: Efficient queries with proper selection
const invitations = await db.istInvitation.findMany({
  select: {
    id: true,
    name: true,
    status: true,
    testerProfile: {
      select: {
        name: true,
      },
    },
  },
  where: {
    status: "PENDING",
  },
  orderBy: {
    createdAt: "desc",
  },
});
```

### CSS/Styling Guidelines

#### Tailwind CSS
```typescript
// ✅ Good: Semantic class organization
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">
    Test Title
  </h2>
  <p className="text-sm text-gray-600">
    Test description
  </p>
</div>

// ✅ Good: Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

#### Component Variants
```typescript
// ✅ Good: Using class-variance-authority
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

## Testing Guidelines

### Unit Tests

```typescript
// src/lib/__tests__/ist-utils.test.ts
import { calculateIstScore } from "../ist-utils";

describe("calculateIstScore", () => {
  it("should calculate correct score for all correct answers", () => {
    const answers = [
      { questionId: "1", answer: "A", isCorrect: true },
      { questionId: "2", answer: "B", isCorrect: true },
    ];
    
    const score = calculateIstScore(answers);
    expect(score).toBe(2);
  });

  it("should handle empty answers array", () => {
    const score = calculateIstScore([]);
    expect(score).toBe(0);
  });
});
```

### Component Tests

```typescript
// src/components/__tests__/IstQuestion.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { IstQuestion } from "../IstQuestion";

describe("IstQuestion", () => {
  const mockQuestion = {
    id: "1",
    text: "What is 2 + 2?",
    options: [
      { label: "A", text: "3" },
      { label: "B", text: "4" },
    ],
  };

  it("renders question text", () => {
    render(<IstQuestion question={mockQuestion} onAnswer={jest.fn()} />);
    expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
  });

  it("calls onAnswer when option is selected", () => {
    const onAnswer = jest.fn();
    render(<IstQuestion question={mockQuestion} onAnswer={onAnswer} />);
    
    fireEvent.click(screen.getByText("4"));
    expect(onAnswer).toHaveBeenCalledWith("B");
  });
});
```

### API Tests

```typescript
// src/server/api/routers/__tests__/ist-invitation.test.ts
import { createTRPCMsw } from "msw-trpc";
import { type AppRouter } from "../root";

const trpcMsw = createTRPCMsw<AppRouter>();

describe("istInvitation router", () => {
  it("should create invitation with valid input", async () => {
    const input = { name: "Test Invitation" };
    const result = await caller.istInvitation.create(input);
    
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("secretKey");
  });
});
```

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage

# Run specific test file
yarn test src/lib/__tests__/ist-utils.test.ts
```

## Documentation

### Code Documentation

#### Function Documentation
```typescript
/**
 * Calculates the standardized score for an IST subtest
 * @param rawScore - The raw score from the test
 * @param age - The test taker's age in years
 * @param subtestType - The type of subtest
 * @returns The standardized score (0-100)
 * @throws {Error} When age is outside valid range (16-65)
 * 
 * @example
 * ```typescript
 * const standardScore = calculateStandardizedScore(25, 30, "verbal");
 * console.log(standardScore); // 75
 * ```
 */
export function calculateStandardizedScore(
  rawScore: number,
  age: number,
  subtestType: IstSubtestType
): number {
  // Implementation
}
```

#### Component Documentation
```typescript
/**
 * IST Question component for displaying test questions with multiple choice options
 * 
 * @component
 * @example
 * ```tsx
 * <IstQuestion
 *   question={questionData}
 *   onAnswer={(answer) => handleAnswer(answer)}
 *   isDisabled={false}
 * />
 * ```
 */
interface IstQuestionProps {
  /** The question data including text and options */
  question: IstQuestion;
  /** Callback function called when an answer is selected */
  onAnswer: (answer: string) => void;
  /** Whether the question is disabled for interaction */
  isDisabled?: boolean;
}
```

### README Updates

When adding new features, update relevant documentation:

- **README.md**: Main project documentation
- **API.md**: API endpoint documentation
- **ARCHITECTURE.md**: System architecture changes
- **DEPLOYMENT.md**: Deployment-related changes

## Issue Guidelines

### Reporting Bugs

Use the bug report template and include:

```markdown
**Bug Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]

**Additional Context**
Any other context about the problem.
```

### Feature Requests

Use the feature request template:

```markdown
**Feature Description**
A clear description of what you want to happen.

**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
Describe the solution you'd like.

**Alternatives Considered**
Describe alternatives you've considered.

**Additional Context**
Any other context or screenshots.
```

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested

## Pull Request Process

### PR Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally with my changes
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one maintainer review required
3. **Testing**: Manual testing for UI changes
4. **Documentation**: Ensure documentation is updated
5. **Approval**: Maintainer approval before merge

### Merge Requirements

- ✅ All CI checks passing
- ✅ At least one approving review
- ✅ No merge conflicts
- ✅ Branch is up to date with main
- ✅ All conversations resolved

## Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and community discussions
- **Pull Requests**: Code review and collaboration

### Getting Help

1. **Check Documentation**: README, API docs, and architecture docs
2. **Search Issues**: Look for existing issues or discussions
3. **Ask Questions**: Create a new discussion or issue
4. **Join Community**: Participate in discussions and help others

### Recognition

Contributors will be recognized in:
- **Contributors section** in README
- **Release notes** for significant contributions
- **GitHub contributors** page

## Development Tips

### Useful Commands

```bash
# Development workflow
yarn dev                    # Start development server
yarn build                  # Build for production
yarn start                  # Start production server

# Database operations
yarn db:generate           # Generate Prisma client
yarn db:migrate            # Run migrations
yarn db:studio             # Open Prisma Studio
yarn db:seed               # Seed database

# Code quality
yarn lint                  # Run ESLint
yarn lint:fix              # Fix ESLint issues
yarn format:check          # Check formatting
yarn format:write          # Format code
yarn typecheck             # Type checking
yarn check                 # Run all checks

# Testing
yarn test                  # Run tests
yarn test:watch            # Run tests in watch mode
yarn test:coverage         # Run tests with coverage
```

### IDE Setup

#### VS Code Extensions
- **TypeScript**: Enhanced TypeScript support
- **Prisma**: Prisma schema support
- **Tailwind CSS IntelliSense**: Tailwind class completion
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting

#### VS Code Settings
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Debugging

#### Client-Side Debugging
```typescript
// Use React Developer Tools
// Add debug logs
console.log("Debug info:", { variable });

// Use debugger statement
debugger;
```

#### Server-Side Debugging
```typescript
// Add logging
import { logger } from "@/lib/logger";
logger.info("Processing request", { userId, data });

// Use Node.js debugger
node --inspect-brk yarn dev
```

### Performance Tips

- **Database queries**: Use `select` to limit returned fields
- **React components**: Use `React.memo` for expensive components
- **Bundle size**: Analyze with `yarn analyze`
- **Images**: Use Next.js Image component for optimization

Thank you for contributing to the Psikotest App v2! Your contributions help make psychological testing more accessible and effective. 🚀