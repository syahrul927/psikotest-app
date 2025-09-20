# IST Subtest Reset Backend Implementation Plan

## Overview
This document outlines the backend implementation plan for the IST subtest reset feature, allowing administrators to reset individual subtests within an IST invitation when status is "ONPROGRESS" or "AWAITING_REVIEW".

## Files to Update

### Backend Files
1. `src/server/api/routers/ist-invitation-router/protected/type.ts`
   - Add Zod schema for reset subtest input validation and subtest status response types

2. `src/server/api/routers/ist-invitation-router/protected/index.ts`
   - Add `getSubtestStatus` procedure to check which subtests can be reset
   - Add `resetSubtest` procedure to existing router

3. `src/hooks/api/ist-invitation/use-reset-ist-subtest.ts` (Create new)
   - Create React hook following existing patterns for reset mutation

4. `src/hooks/api/ist-invitation/use-get-subtest-status.ts` (Create new)
   - Create React hook to get subtest status for UI validation

### Frontend Files
5. `src/features/ist-invitation/reset-subtest-dialog/subtest-list.tsx`
   - Replace placeholder alert with actual tRPC mutation call
   - Integrate status checking hook for real-time validation

## Database Schema Analysis

### Current Relevant Tables
- `IstInvitation` - Main invitation record with status
- `IstSubtestSession` - Individual subtest sessions linked to invitation
- `IstResult` - Results for each subtest (created automatically when test starts)
- `TesterProfile` - Participant profile with timestamps

### Key Relationships
```
IstInvitation (1) -> (many) IstSubtestSession
IstSubtestSession (1) -> (1) IstResult
IstSubtestSession (1) -> (1) TesterProfile
```

### Important Field Notes
- `IstSubtestSession.startedAt` - When subtest was started (null = not started)
- `IstSubtestSession.submittedAt` - When subtest was completed
- `IstResult` records are automatically created when user starts a subtest

## Reset Scenarios Explained

### ONPROGRESS Status Reset:
- User is actively taking the test
- Admin can reset individual subtests if there are technical issues or user needs to retake specific subtests
- After reset: Status remains "ONPROGRESS" (since user is still in progress)

### AWAITING_REVIEW Status Reset:
- User completed all subtests, waiting for review
- Admin can reset specific subtests for user to retake
- After reset: Status changes to "ONPROGRESS" (since at least one subtest is now incomplete)

### Why Both Statuses Make Sense:
- **ONPROGRESS**: Allows fixing issues during active test sessions
- **AWAITING_REVIEW**: Allows targeted retakes without full test restart
- Both scenarios benefit from granular subtest reset capability

## Backend Implementation Details

### 1. Type Schema (`type.ts`)

```typescript
export const ResetIstSubtestRouterSchema = z.object({
  invitationId: z.string({
    required_error: "ID undangan diperlukan",
    invalid_type_error: "ID undangan harus berupa string",
  }),
  subtestId: z.number({
    required_error: "ID subtest diperlukan", 
    invalid_type_error: "ID subtest harus berupa angka",
  }),
});

export type ResetIstSubtestRouterInput = z.infer<typeof ResetIstSubtestRouterSchema>;

export const ResetIstSubtestRouterResponse = z.object({
  success: z.boolean(),
  message: z.string(),
  resetSubtestName: z.string().optional(),
});

// Add new types for subtest status
export const SubtestStatusResponse = z.object({
  status: z.string(),
  subtests: z.array(z.object({
    id: z.number(),
    name: z.string(),
    canReset: z.boolean(),
  })),
});

export type SubtestStatusResponseType = z.infer<typeof SubtestStatusResponse>;
```

### 2. Router Procedures (`index.ts`)

```typescript
// Add new procedure to get subtest status
getSubtestStatus: protectedProcedure
  .input(z.string())
  .query(async ({ ctx, input: invitationId }) => {
    const invitation = await ctx.db.istInvitation.findUnique({
      where: { id: invitationId },
      include: {
        IstSubtestSession: {
          include: {
            subtestTemplate: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (!invitation) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Undangan tidak ditemukan",
      });
    }

    return {
      status: invitation.status,
      subtests: invitation.IstSubtestSession.map(session => ({
        id: session.subtestTemplateId,
        name: session.subtestTemplate.name,
        canReset: session.startedAt !== null && // Only started subtests can be reset
          ["ONPROGRESS", "AWAITING_REVIEW"].includes(invitation.status),
      })),
    };
  }),

// Updated reset subtest procedure
resetSubtest: protectedProcedure
  .input(ResetIstSubtestRouterSchema)
  .mutation(async ({ ctx, input }) => {
    const { invitationId, subtestId } = input;
    
    // Step 1: Validate invitation exists and has correct status
    const invitation = await ctx.db.istInvitation.findUnique({
      where: { id: invitationId },
      include: {
        IstSubtestSession: {
          where: { subtestTemplateId: subtestId },
        },
      },
    });

    if (!invitation || !["ONPROGRESS", "AWAITING_REVIEW"].includes(invitation.status)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Hanya undangan dengan status ONPROGRESS atau AWAITING_REVIEW yang dapat direset",
      });
    }

    // Step 2: Check if subtest was started (startedAt not null)
    const subtestSession = invitation.IstSubtestSession[0];
    if (!subtestSession?.startedAt) {
      throw new TRPCError({
        code: "BAD_REQUEST", 
        message: "Subtest belum dimulai, tidak perlu direset",
      });
    }

    // Step 3: Get subtest template info
    const subtestTemplate = await ctx.db.istSubtestTemplate.findUnique({
      where: { id: subtestId },
    });

    // Step 4: Reset subtest: set startedAt and submittedAt to null
    await ctx.db.istSubtestSession.update({
      where: { id: subtestSession.id },
      data: {
        startedAt: null,
        submittedAt: null,
      },
    });

    // Step 5: Delete IstResult records (hard delete)
    await ctx.db.istResult.deleteMany({
      where: {
        istInvitationId: invitationId,
        subtestTemplateId: subtestId,
      },
    });

    // Step 6: Update invitation status
    // If invitation was AWAITING_REVIEW, change to ONPROGRESS since subtest is now incomplete
    // If invitation was already ONPROGRESS, keep it as ONPROGRESS
    if (invitation.status === "AWAITING_REVIEW") {
      await ctx.db.istInvitation.update({
        where: { id: invitationId },
        data: { status: "ONPROGRESS" },
      });
    }

    // Step 7: Audit logging
    await ctx.db.auditLog.create({
      data: {
        action: "RESET_IST_SUBTEST",
        entityType: "IstSubtestSession",
        entityId: subtestSession.id,
        userId: ctx.session.user.id,
        details: {
          invitationId,
          subtestId,
          subtestName: subtestTemplate?.name,
          previousStatus: invitation.status,
          newStatus: "ONPROGRESS",
        },
      },
    });

    return {
      success: true,
      message: `Subtest ${subtestTemplate?.name} berhasil direset`,
      resetSubtestName: subtestTemplate?.name,
    };
  }),
```

### 3. React Hooks Implementation

**Get Subtest Status Hook:**
```typescript
// src/hooks/api/ist-invitation/use-get-subtest-status.ts
import { trpc } from "@/trpc";

export const useGetSubtestStatus = (invitationId: string) => {
  return trpc.istInvitation.getSubtestStatus.useQuery(invitationId, {
    enabled: !!invitationId,
  });
};
```

**Reset Subtest Hook:**
```typescript
// src/hooks/api/ist-invitation/use-reset-ist-subtest.ts
import { trpc } from "@/trpc";
import { toast } from "sonner";

export const useResetIstSubtest = (successCallback?: () => void) => {
  return trpc.istInvitation.resetSubtest.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      successCallback?.();
    },
    onError: (error) => {
      toast.error(error.message || "Gagal mereset subtest");
    },
  });
};
```

### 4. Frontend Component Integration

**Updated subtest-list.tsx:**
```typescript
import { useResetIstSubtest } from "@/hooks/api/ist-invitation/use-reset-ist-subtest";
import { useGetSubtestStatus } from "@/hooks/api/ist-invitation/use-get-subtest-status";

export function SubtestList({ invitationId, subtests, onResetSubtest }: SubtestListProps) {
  const { mutate: resetSubtest, isPending } = useResetIstSubtest(() => {
    // Refresh data after successful reset
    onResetSubtest?.();
  });

  const { data: statusData } = useGetSubtestStatus(invitationId);

  const handleReset = (subtestId: number) => {
    const { confirmationReset } = useResetConfirmation();
    
    confirmationReset(
      () => {
        resetSubtest({ invitationId, subtestId });
      },
      "Reset Subtest",
      `Apakah Anda yakin ingin mereset subtest ini?`
    );
  };

  // Use real-time status data for canReset determination
  const getSubtestCanReset = (subtestId: number) => {
    const subtestStatus = statusData?.subtests.find(s => s.id === subtestId);
    return subtestStatus?.canReset || false;
  };

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
      {subtests.map((subtest) => (
        <SubtestInfo
          key={subtest.id}
          subtest={subtest}
          canReset={getSubtestCanReset(subtest.id)}
          onReset={handleReset}
          isLoading={isPending}
        />
      ))}
    </div>
  );
}
```

## Detailed Backend Logic Requirements

### Validation Requirements
1. **Permission Check**: Only authenticated users can perform reset
2. **Invitation Existence**: Verify invitation exists in database
3. **Status Validation**: Only allow reset when status = "ONPROGRESS" or "AWAITING_REVIEW"
4. **Subtest Existence**: Verify subtest session exists for the given invitation
5. **Started Check**: Only allow reset if subtest has been started (startedAt not null)
6. **Template Validation**: Verify subtest template exists

### Reset Operations
1. **Clear Timestamps**: Set `startedAt` and `submittedAt` to null
2. **Delete Results**: Hard delete `IstResult` records (they'll be recreated when test restarts)
3. **Status Management**: Update invitation status based on reset scenario

### Error Handling
- **NOT_FOUND**: Invitation or subtest not found
- **BAD_REQUEST**: Invalid status, subtest not started, or validation failed
- **FORBIDDEN**: Permission denied
- **INTERNAL_ERROR**: Database operation failures

### Database Operations Flow
1. **Validation**: Check invitation status and subtest started state
2. **Reset**: Clear timestamps in `IstSubtestSession`
3. **Cleanup**: Delete corresponding `IstResult` records
4. **Update**: Set invitation status appropriately
5. **Log**: Record action in audit trail
6. **Feedback**: Return success response to frontend

## Frontend Integration

### Component Updates
1. **Loading States**: Show loading spinner during reset operation
2. **Error Handling**: Display error messages from tRPC
3. **Success Feedback**: Show toast notifications and refresh data
4. **Confirmation Dialog**: Keep existing confirmation dialog flow
5. **Real-time Status**: Use status hook for current canReset validation

### Data Refetching
After successful reset, refetch:
- Invitation list to update status
- Subtest details to show reset state
- Any related dashboard statistics

## Testing Considerations

### Backend Tests
- Test validation with various input scenarios
- Test status transitions (ONPROGRESS → ONPROGRESS, AWAITING_REVIEW → ONPROGRESS)
- Test database operations and rollbacks
- Test permission handling

### Frontend Tests
- Test loading states
- Test error scenarios
- Test success flow and data updates
- Test confirmation dialog integration
- Test real-time status updates


## My Notes
There is a requirement when subtest can be reset or not. Subtest that can be reset is only for the `status` in `IstInvitation` `ONPROGRESS` or `AWAITING_REVIEW`.
Now I want to tell you How to reset the subtest.
1. Since we want to reset subtest, we need to update first the `status` in table `IstInvitation` to `ONPROGRESS`.
2. The Subtest that can be reset of course the subtest that already started. We can find out the subtest started or not in table`IstSubtestSession` selected with `istInvitationId` with value of column `startedAt` not null. So if you want to reset subtest you need to set `startedAt` to null. 
3. You need to delete (hard delete) record from table `IstResult` with criteria by `istInvitationId` and `subtestTemplateId` . Did I already explain subtestTemplateId? if not ask me if you still confused or need to clarify something.
So by that requirement, I guess you need to create one more trpc to get the status of subtests. you can query to table `IstInvitation` and include the table `IstSubtestSession` 

If you Ask why you need to delete the record from `IstResult`. In POV user when they trying to do their subtest, it automatically create new record in that table when start the test. you can check on file @src/server/api/routers/ist-test-router/public/index.ts in function getIstQuestionTemplateById. this trpc called when get the questions of subtest