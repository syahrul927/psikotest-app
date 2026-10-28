# WWQ Question Settings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Admin menu (`/wwq-settings`) to edit the **text only** of the 75 existing WWQ questions, mirroring the `ist-settings` pattern; seed becomes skip-if-exists so re-runs never overwrite admin edits.

**Architecture:** New protected tRPC router `wwqSettings` (`getAllQuestions`, `updateQuestion` — id + description only), a dashboard route + secondary sidebar item, a `wwq-settings` feature (data table + edit dialog), a read-only `getWwqQuestionMeta(order)` helper derived from `WWQ_KEY`, and a seed change from upsert to create-if-missing.

**Tech Stack:** Next.js 15 App Router, tRPC v11 + superjson, Prisma, TanStack Table (`@/components/table/data-table`), React Hook Form + zod, shadcn/ui, sonner. Package manager: **yarn**.

**Spec:** `docs/superpowers/specs/2026-10-27-wwq-question-settings-design.md`

**Branch:** create and work on `feat/wwq-question-settings` from `main`. Never stage the user's pre-existing dirty files (`src/features/kraepelin-*`, `src/hooks/api/kraepelin-test/*`, `src/server/api/routers/kraepelin-test-router/*`, `.claude/settings.local.json`, untracked `.agents/`, `.claude/skills/`, `docs/WWQ.xlsx`, `docs/psikotest-invitation-flow.excalidraw`, `skills-lock.json`) — `git add` only the paths named per task.

**Conventions (house, verified in this repo):**
- Run checks with `yarn run check` (NOT `yarn check` — that is yarn v1's built-in integrity check).
- `npx`/bare tool binaries are intercepted by an RTK hook; use `./node_modules/.bin/...`.
- Commits: conventional style, message ends with a blank line then `Co-Authored-By: Claude Code <noreply@anthropic.com>`.
- No unit-test framework exists; pure logic is verified with standalone `scripts/verify-*.ts` compiled via tsc (see `scripts/verify-wwq-scoring.ts`), UI is verified behaviorally against the dev server (port **3100**: `./node_modules/.bin/next dev -p 3100`; port 3000 is occupied by another project).

---

### Task 1: `getWwqQuestionMeta` helper + verifier

**Files:**
- Create: `scripts/verify-wwq-question-meta.ts`
- Modify: `src/lib/wwq-utils.ts` (append after `WWQ_TOTAL_QUESTIONS`/`WWQ_KEY` block, before the scoring functions)

- [ ] **Step 1: Write the failing verifier**

Create `scripts/verify-wwq-question-meta.ts`:

```ts
// Verifies getWwqQuestionMeta against WWQ_KEY (the single source of truth). Run:
//   ./node_modules/.bin/tsc --strict --noUncheckedIndexedAccess --target es2022 --module commonjs \
//     --moduleResolution node --esModuleInterop --skipLibCheck \
//     --outDir /tmp/wwqmetabuild scripts/verify-wwq-question-meta.ts \
//   && node /tmp/wwqmetabuild/scripts/verify-wwq-question-meta.js
import {
  WWQ_ASPECTS,
  WWQ_KEY,
  WWQ_TOTAL_QUESTIONS,
  getWwqQuestionMeta,
} from "../src/lib/wwq-utils";

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(`FAIL: ${msg}`);
}

// 1. every question order 1..75 resolves to at least one key entry
for (let order = 1; order <= WWQ_TOTAL_QUESTIONS; order++) {
  assert(
    getWwqQuestionMeta(order).length >= 1,
    `order ${order} has no meta entries`,
  );
}

// 2. meta entries total exactly the WWQ_KEY entries (no loss/duplication)
let total = 0;
for (let order = 1; order <= WWQ_TOTAL_QUESTIONS; order++) {
  total += getWwqQuestionMeta(order).length;
}
assert(WWQ_KEY.length === 94, `WWQ_KEY length ${WWQ_KEY.length}, expected 94`);
assert(total === WWQ_KEY.length, `meta entries ${total} !== WWQ_KEY ${WWQ_KEY.length}`);

// 3. per-order deep comparison: aspect numbers, inverted flags, resolved names
const nameByNo = new Map(WWQ_ASPECTS.map((a) => [a.no, a.name] as const));
for (let order = 1; order <= WWQ_TOTAL_QUESTIONS; order++) {
  const expected = WWQ_KEY.filter(([q]) => q === order);
  const got = getWwqQuestionMeta(order);
  assert(got.length === expected.length, `order ${order}: entry count`);
  expected.forEach(([, aspectNo, inverted], i) => {
    const g = got[i];
    assert(!!g, `order ${order}: entry ${i} missing`);
    assert(
      g!.aspectNo === aspectNo && g!.inverted === inverted,
      `order ${order} entry ${i}: aspectNo/inverted mismatch`,
    );
    assert(
      g!.aspectName === nameByNo.get(aspectNo),
      `order ${order} entry ${i}: aspect name mismatch`,
    );
  });
}

// 4. known specifics (spot-checks against docs/WWQ.xlsx)
const o1 = getWwqQuestionMeta(1);
assert(
  o1.length === 2 &&
    o1[0]!.aspectName === "Ekspresi Emosi" &&
    o1[1]!.aspectName === "Tendensi Paranoid" &&
    !o1[0]!.inverted &&
    !o1[1]!.inverted,
  "order 1 should feed Ekspresi Emosi + Tendensi Paranoid, scored on YA",
);
const o14 = getWwqQuestionMeta(14);
assert(
  o14.length === 1 && o14[0]!.inverted === true && o14[0]!.aspectName === "Ketidakstabilan Emosi",
  "order 14 should be single-aspect Ketidakstabilan Emosi scored on TIDAK",
);

console.log("verify-wwq-question-meta: all assertions passed");
```

- [ ] **Step 2: Run it, expect failure**

Run:
```bash
./node_modules/.bin/tsc --strict --noUncheckedIndexedAccess --target es2022 --module commonjs \
  --moduleResolution node --esModuleInterop --skipLibCheck \
  --outDir /tmp/wwqmetabuild scripts/verify-wwq-question-meta.ts \
  && node /tmp/wwqmetabuild/scripts/verify-wwq-question-meta.js
```
Expected: FAIL — `TS2305: Module '"../src/lib/wwq-utils"' has no exported member 'getWwqQuestionMeta'`.

- [ ] **Step 3: Implement the helper**

Append to `src/lib/wwq-utils.ts` (after the `WWQ_KEY` array, before the scoring section):

```ts
export interface WwqQuestionMetaEntry {
  aspectNo: WwqAspectNo;
  aspectName: string;
  inverted: boolean; // true = the scoring answer is TIDAK
}

// Read-only view of which aspects a question order feeds and which answer
// scores it, derived purely from WWQ_KEY. Used by the WWQ Settings table so
// admins see what a question does before editing its text. Never write to
// this — scoring uses WWQ_KEY directly.
export function getWwqQuestionMeta(order: number): WwqQuestionMetaEntry[] {
  return WWQ_KEY.filter(([questionOrder]) => questionOrder === order).map(
    ([, aspectNo, inverted]) => ({
      aspectNo,
      aspectName:
        WWQ_ASPECTS.find((a) => a.no === aspectNo)?.name ?? `Aspek ${aspectNo}`,
      inverted,
    }),
  );
}
```

- [ ] **Step 4: Run verifier again, expect pass**

Same command as Step 2. Expected: `verify-wwq-question-meta: all assertions passed`.

- [ ] **Step 5: Confirm the scoring verifier still passes**

```bash
./node_modules/.bin/tsc --strict --noUncheckedIndexedAccess --target es2022 --module commonjs \
  --moduleResolution node --esModuleInterop --skipLibCheck \
  --outDir /tmp/wwqbuild scripts/verify-wwq-scoring.ts \
  && node /tmp/wwqbuild/scripts/verify-wwq-scoring.js
```
Expected: existing "all assertions passed" output (unchanged behavior).

- [ ] **Step 6: Typecheck + commit**

```bash
yarn run check
git add scripts/verify-wwq-question-meta.ts src/lib/wwq-utils.ts
git commit -m "$(cat <<'EOF'
feat(wwq): add getWwqQuestionMeta read-only helper with verifier

Co-Authored-By: Claude Code <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: `wwqSettings` tRPC router

**Files:**
- Create: `src/server/api/routers/wwq-settings-router/protected/index.ts`
- Create: `src/server/api/routers/wwq-settings-router/index.ts`
- Modify: `src/server/api/root.ts` (imports + `appRouter` block)

- [ ] **Step 1: Create the protected router**

Create `src/server/api/routers/wwq-settings-router/protected/index.ts`:

```ts
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

// WWQ Settings: admins may only reword existing question text. Order,
// count, aspect mapping and scoring keys are fixed — there are deliberately
// no create/delete procedures and `order` is not an input.
export const wwqSettingsRouter = createTRPCRouter({
  getAllQuestions: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.wwqQuestion.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        order: true,
        description: true,
        updatedAt: true,
      },
    });
  }),

  updateQuestion: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        description: z
          .string()
          .trim()
          .min(1, "Teks soal harus diisi")
          .max(500, "Teks soal maksimal 500 karakter"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.wwqQuestion.findUnique({
        where: { id: input.id },
        select: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Soal tidak ditemukan.",
        });
      }

      return ctx.db.wwqQuestion.update({
        where: { id: input.id },
        data: { description: input.description },
        select: {
          id: true,
          order: true,
          description: true,
          updatedAt: true,
        },
      });
    }),
});
```

- [ ] **Step 2: Create the router index** (same pattern as `ist-settings-router/index.ts`)

Create `src/server/api/routers/wwq-settings-router/index.ts`:

```ts
import { wwqSettingsRouter } from "./protected";

export { wwqSettingsRouter };
```

- [ ] **Step 3: Register in root router**

In `src/server/api/root.ts`, add the import next to the other wwq imports:

```ts
import { wwqSettingsRouter } from "./routers/wwq-settings-router";
```

and add to the `appRouter` block after `wwqTest: wwqTestPublicRouter,`:

```ts
  wwqSettings: wwqSettingsRouter,
```

- [ ] **Step 4: Typecheck**

```bash
yarn run check
```
Expected: lint + `tsc --noEmit` pass with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/server/api/routers/wwq-settings-router src/server/api/root.ts
git commit -m "$(cat <<'EOF'
feat(wwq): add wwqSettings router for question text editing

Co-Authored-By: Claude Code <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Client hooks

**Files:**
- Create: `src/hooks/api/wwq-settings/use-get-wwq-questions.ts`
- Create: `src/hooks/api/wwq-settings/use-update-wwq-question.ts`

- [ ] **Step 1: List query hook**

```ts
import { api } from "@/trpc/react";

export const useGetWwqQuestions = () => {
  return api.wwqSettings.getAllQuestions.useQuery();
};
```

- [ ] **Step 2: Mutation hook** (toast style matches the other `wwq-invitation` hooks)

```ts
import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useUpdateWwqQuestion = () => {
  const utils = api.useUtils();

  return api.wwqSettings.updateQuestion.useMutation({
    onSuccess: () => {
      toast.success("Teks soal tersimpan");
      void utils.wwqSettings.getAllQuestions.invalidate();
    },
    onError: (e) => {
      toast.error("Oops..", { description: e.message });
    },
  });
};
```

- [ ] **Step 3: Typecheck + commit**

```bash
yarn run check
git add src/hooks/api/wwq-settings
git commit -m "$(cat <<'EOF'
feat(wwq): add wwqSettings query and mutation hooks

Co-Authored-By: Claude Code <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: `wwq-settings` feature UI (table + edit dialog)

**Files:**
- Create: `src/features/wwq-settings/index.ts`
- Create: `src/features/wwq-settings/wwq-question-table/index.ts`
- Create: `src/features/wwq-settings/wwq-question-table/columns.tsx`
- Create: `src/features/wwq-settings/wwq-question-table/table.tsx`
- Create: `src/features/wwq-settings/wwq-question-form/index.ts`
- Create: `src/features/wwq-settings/wwq-question-form/form.tsx`

Structure mirrors `src/features/ist-settings/` exactly (table owns the edit-dialog state, columns get the callback via `table.options.meta`).

- [ ] **Step 1: Columns**

Create `src/features/wwq-settings/wwq-question-table/columns.tsx`:

```tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type ColumnDef } from "@tanstack/react-table";
import { EditIcon } from "lucide-react";
import { localDate } from "@/lib/date-utils";
import { getWwqQuestionMeta } from "@/lib/wwq-utils";

export type WwqQuestionRow = {
  id: string;
  order: number;
  description: string;
  updatedAt: Date;
};

export const columns: ColumnDef<WwqQuestionRow>[] = [
  {
    accessorKey: "order",
    header: "No",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono text-xs">
        {Number(row.getValue("order"))}
      </Badge>
    ),
  },
  {
    accessorKey: "description",
    header: "Soal",
    cell: ({ row }) => {
      const description = String(row.getValue("description"));
      const truncated =
        description.length > 60
          ? `${description.substring(0, 60)}...`
          : description;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">{truncated}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "aspects",
    header: "Aspek",
    cell: ({ row }) => {
      const meta = getWwqQuestionMeta(row.original.order);
      return (
        <span className="text-muted-foreground text-sm">
          {meta.map((m) => m.aspectName).join(" + ")}
        </span>
      );
    },
  },
  {
    id: "scoring",
    header: "Skor pada",
    cell: ({ row }) => {
      const meta = getWwqQuestionMeta(row.original.order);
      return (
        <div className="flex gap-1">
          {meta.map((m) => (
            <Badge
              key={m.aspectNo}
              variant="outline"
              className="font-mono text-xs"
            >
              {m.inverted ? "TIDAK" : "YA"}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Diubah",
    cell: ({ row }) => (
      <span className="text-sm">{localDate(row.original.updatedAt)}</span>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row, table }) => {
      const question = row.original;

      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const meta = table.options.meta as {
              onEdit?: (question: WwqQuestionRow) => void;
            };
            meta?.onEdit?.(question);
          }}
        >
          <EditIcon className="mr-1 h-4 w-4" />
          Edit
        </Button>
      );
    },
  },
];
```

- [ ] **Step 2: Table**

Create `src/features/wwq-settings/wwq-question-table/table.tsx`:

```tsx
"use client";

import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { useGetWwqQuestions } from "@/hooks/api/wwq-settings/use-get-wwq-questions";
import { useState } from "react";
import { columns, type WwqQuestionRow } from "./columns";
import { WwqQuestionForm } from "../wwq-question-form";

export function WwqQuestionTable() {
  const { data: questions, isLoading } = useGetWwqQuestions();
  const [editingQuestion, setEditingQuestion] =
    useState<WwqQuestionRow | null>(null);

  const handleEdit = (question: WwqQuestionRow) => {
    setEditingQuestion(question);
  };

  const handleCloseEdit = () => {
    setEditingQuestion(null);
  };

  if (isLoading) {
    return <DataTableSkeleton />;
  }

  if (!questions) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-muted-foreground">
          Tidak ada soal WWQ. Jalankan seed terlebih dahulu.
        </p>
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={questions}
        meta={{
          onEdit: handleEdit,
        }}
        enablePagination
      />

      {editingQuestion && (
        <WwqQuestionForm
          question={editingQuestion}
          open={!!editingQuestion}
          onClose={handleCloseEdit}
        />
      )}
    </>
  );
}
```

(`enablePagination` = `true`: 75 rows; the ist table disables it because it only has 14. If `DataTable`'s prop typing rejects the shorthand, pass `enablePagination={true}`.)

- [ ] **Step 3: Edit dialog**

Create `src/features/wwq-settings/wwq-question-form/form.tsx`:

```tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateWwqQuestion } from "@/hooks/api/wwq-settings/use-update-wwq-question";
import { getWwqQuestionMeta } from "@/lib/wwq-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { WwqQuestionRow } from "../wwq-question-table/columns";

const formSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Teks soal harus diisi")
    .max(500, "Teks soal maksimal 500 karakter"),
});

type FormValues = z.infer<typeof formSchema>;

interface WwqQuestionFormProps {
  question: WwqQuestionRow;
  open: boolean;
  onClose: () => void;
}

export function WwqQuestionForm({
  question,
  open,
  onClose,
}: WwqQuestionFormProps) {
  const updateMutation = useUpdateWwqQuestion();
  const meta = getWwqQuestionMeta(question.order);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: question.description,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await updateMutation.mutateAsync({
        id: question.id,
        description: values.description,
      });
      onClose();
      form.reset();
    } catch {
      // Error is handled by the mutation's onError callback
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] w-full overflow-y-auto md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Soal WWQ</DialogTitle>
          <DialogDescription>
            Ubah teks soal saja. Jawaban kunci, aspek, dan perhitungan skor
            tidak berubah.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Read-only identity of the question */}
            <div className="space-y-2">
              <label className="text-muted-foreground text-sm font-medium">
                Soal
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  No. {question.order}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  {meta.map((m) => m.aspectName).join(" + ")} — skor pada{" "}
                  {meta.map((m) => (m.inverted ? "TIDAK" : "YA")).join(" / ")}
                </span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teks Soal</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tulis teks soal..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={updateMutation.isPending}
              >
                Batal
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 4: Barrels**

`src/features/wwq-settings/wwq-question-table/index.ts`:
```ts
export * from "./table";
export * from "./columns";
```

`src/features/wwq-settings/wwq-question-form/index.ts`:
```ts
export * from "./form";
```

`src/features/wwq-settings/index.ts`:
```ts
export * from "./wwq-question-table";
export * from "./wwq-question-form";
```

- [ ] **Step 5: Typecheck + commit**

```bash
yarn run check
git add src/features/wwq-settings
git commit -m "$(cat <<'EOF'
feat(wwq): add WWQ settings question table and edit dialog

Co-Authored-By: Claude Code <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Route page, URL constant, sidebar entry

**Files:**
- Modify: `src/lib/page-url.ts` (WWQ section)
- Modify: `src/components/sidebar/navigation-menu.ts` (`NavigationSecondaryConstant`)
- Create: `src/app/(dashboard)/wwq-settings/page.tsx`

- [ ] **Step 1: URL constant**

In `src/lib/page-url.ts`, inside the `// WWQ` section after `WWQ_INVITATION_RESULT`:

```ts
  WWQ_SETTINGS: "/wwq-settings",
```

- [ ] **Step 2: Sidebar entry**

In `src/components/sidebar/navigation-menu.ts`, in `NavigationSecondaryConstant`, insert after the "IST Settings" item (before "User Akses"):

```ts
  {
    title: "WWQ Settings",
    url: PAGE_URLS.WWQ_SETTINGS,
    icon: Settings,
  },
```

(`Settings` is already imported in that file for "IST Settings" — no import change.)

- [ ] **Step 3: Page**

Create `src/app/(dashboard)/wwq-settings/page.tsx` (same shape as the ist-settings page):

```tsx
import { WwqQuestionTable } from "@/features/wwq-settings";

export default function WwqSettings() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">WWQ Settings</h1>
          <p className="text-muted-foreground">
            Kelola teks soal WWQ. Jumlah soal, urutan, dan perhitungan skor
            tetap.
          </p>
        </div>

        <WwqQuestionTable />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Typecheck + commit**

```bash
yarn run check
git add src/lib/page-url.ts src/components/sidebar/navigation-menu.ts "src/app/(dashboard)/wwq-settings/page.tsx"
git commit -m "$(cat <<'EOF'
feat(wwq): add WWQ Settings dashboard route and sidebar menu

Co-Authored-By: Claude Code <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Seed — skip existing rows

**Files:**
- Modify: `prisma/seed-wwq.ts` (header comment + transaction block)

- [ ] **Step 1: Rewrite seed body**

Replace the header comment lines 1–6 with:

```ts
// Seeds WwqQuestion from docs/wwq-data/wwq-questions.json (extracted from docs/WWQ.xlsx).
// Install-only: creates orders that are missing and NEVER overwrites existing
// rows — admin edits made in WWQ Settings live in the DB. To restore JSON text
// for an order, delete that row first (prisma studio), then re-run. Run from repo root:
//   ./node_modules/.bin/tsc --strict --target es2022 --module commonjs \
//     --moduleResolution node --esModuleInterop --skipLibCheck \
//     --outDir /tmp/wwqseed prisma/seed-wwq.ts \
//   && NODE_PATH="$PWD/node_modules" node /tmp/wwqseed/seed-wwq.js
```

Replace the upsert transaction + log:

```ts
  await prisma.$transaction(
    questions.map((q) =>
      prisma.wwqQuestion.upsert({
        where: { order: q.no },
        create: { order: q.no, description: q.text },
        update: { description: q.text },
      }),
    ),
  );
  console.log(`Seeded wwq questions: ${questions.length}`);
```

with:

```ts
  const existing = await prisma.wwqQuestion.findMany({
    select: { order: true },
  });
  const existingOrders = new Set(existing.map((q) => q.order));
  const missing = questions.filter((q) => !existingOrders.has(q.no));

  await prisma.$transaction(
    missing.map((q) =>
      prisma.wwqQuestion.create({
        data: { order: q.no, description: q.text },
      }),
    ),
  );
  console.log(
    `Seeded wwq questions: created ${missing.length}, skipped ${
      questions.length - missing.length
    } (existing rows keep DB text)`,
  );
```

Fixture validation (`length === 75`, unique numbers) stays untouched.

- [ ] **Step 2: Run against the populated dev DB — expect no overwrites**

```bash
./node_modules/.bin/tsc --strict --target es2022 --module commonjs \
  --moduleResolution node --esModuleInterop --skipLibCheck \
  --outDir /tmp/wwqseed prisma/seed-wwq.ts \
  && NODE_PATH="$PWD/node_modules" node /tmp/wwqseed/seed-wwq.js
```
Expected log: `Seeded wwq questions: created 0, skipped 75 (existing rows keep DB text)`.

- [ ] **Step 3: Typecheck + commit**

```bash
yarn run check
git add prisma/seed-wwq.ts
git commit -m "$(cat <<'EOF'
feat(wwq): make question seed skip existing rows

Co-Authored-By: Claude Code <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Final integration verification (whole-branch review target)

**Files:** none (verification only; fix + commit anything it uncovers).

- [ ] **Step 1: Static gates**

```bash
yarn run check
```
Expected: pass.

- [ ] **Step 2: Logic gates**

Run both verifiers (commands in Tasks 1/earlier): `scripts/verify-wwq-scoring.ts` and `scripts/verify-wwq-question-meta.ts`. Expected: both "all assertions passed".

- [ ] **Step 3: Behavioral walkthrough (dev server on :3100)**

Start (or reuse) `./node_modules/.bin/next dev -p 3100`, log in to the dashboard:

1. Sidebar secondary group shows "WWQ Settings"; clicking it renders the table with **75 rows**, columns No/Soal/Aspek/Skor pada/Diubah/Aksi; row 1 shows "Ekspresi Emosi + Tendensi Paranoid" and two YA badges.
2. Edit row 1 → append " (TEST)" to the text → Simpan. Expect toast "Teks soal tersimpan", table cell shows new text without refetch hacks.
3. Clear the textarea → submit → client validation "Teks soal harus diisi" blocks the mutation (no toast).
4. Open a PENDING WWQ invitation's guest flow to the `/test` page → question No. 1 shows the edited "(TEST)" text (guest reads DB at `findAllQuestions`); scoring notes unchanged. Reload mid-test → draft answers restored (localStorage), text now edited version.
5. Revert row 1 text (edit → remove " (TEST)" → Simpan) so the fixture question stays clean.
6. Open a completed participant's WWQ result page → detail answers table renders normally (answers are id-keyed; text edit does not break the mapping).
7. `wwqSettings.updateQuestion` with a bogus id is unreachable from the fixed UI; confirm the dialog only offers rows from the list (no free id input) — spot-check in devtools network tab that mutation input contains only `{id, description}`.

- [ ] **Step 4: Confirm nothing extra exists**

`grep -rn "wwqQuestion.create\|wwqQuestion.delete" src/server/api/routers/wwq-settings-router` → no matches (no create/delete procedures). `git diff main..HEAD --stat` shows only files named in Tasks 1–6 (plus user's pre-existing dirty files untouched and unstaged).

Report the walk-through result; then use superpowers:finishing-a-development-branch.
