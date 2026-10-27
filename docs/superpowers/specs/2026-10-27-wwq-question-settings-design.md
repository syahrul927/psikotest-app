# WWQ Question Settings — Design Spec

**Date:** 2026-10-27
**Status:** Design verbally approved 2026-10-27, pending written-spec review
**Follows up on:** `docs/superpowers/specs/2026-10-26-wwq-test-design.md` (which listed "Admin CRUD UI for WWQ questions (seed only)" as out of scope — this spec brings a scoped version of it back in).

## Goal

Admin can edit the **text only** of the 75 existing WWQ questions from a dashboard menu, mirroring the existing `ist-settings` pattern. Question count, order, aspect mapping, scoring key, and formulas stay untouchable from the UI.

## Constraints that shape the design

1. Scoring depends on the invariant `WwqQuestion` rows with `order ∈ 1..75` and on `WWQ_KEY` (order → aspect + inverted flag) in `src/lib/wwq-utils.ts`. Editing `description` text affects neither → safe.
2. `WwqAnswer` stores `questionId`, not text. Changing text never alters a stored or computed score.
3. Seed script `prisma/seed-wwq.ts` currently upserts by `order`, so a re-run overwrites admin edits. Decision made: **seed becomes skip-if-exists** — after first install, DB is the source of truth for text; JSON is install-only.
4. House precedent: IST settings = protected tRPC router + `(dashboard)/ist-settings` route + secondary sidebar item + table with per-row edit dialog.

## Architecture

New admin surface only; guest test flow untouched.

```
(dashboard)/wwq-settings/page.tsx     → WwqQuestionTable (feature component)
server/api/routers/wwq-settings-router/protected/index.ts  → wwqSettings router
features/wwq-settings/                → table + edit dialog
lib/wwq-utils.ts                      → + getWwqQuestionMeta(order) (read-only helper)
prisma/seed-wwq.ts                    → upsert → create-if-missing (skip existing)
```

### 1. tRPC router `wwqSettings` (protected only — no public half)

Registered in `src/server/api/root.ts` next to `istSettings`.

- **`getAllQuestions`** (query): `wwqQuestion.findMany({ orderBy: { order: "asc" }, select: { id, order, description, updatedAt } })`. No aspect data from DB — client derives meta from `WWQ_KEY` via the util.
- **`updateQuestion`** (mutation), input `z.object({ id: z.string(), description: z.string().trim().min(1, "Teks soal harus diisi").max(500, "Teks soal maksimal 500 karakter") })`:
  - `findUnique` by id → not found ⇒ `TRPCError NOT_FOUND "Soal tidak ditemukan."`.
  - `update({ where: { id }, data: { description: input.description } })`.
  - `order` is **not** an input field — it cannot be changed, added, or removed via API. No create/delete procedures exist.
  - Returns updated row.
- No guard against editing while invitations are `ONPROGRESS`: a test-taker who already loaded the test keeps old text; a reload fetches new text. Answers key on id → scoring unaffected. Accepted consequence, documented in UI.

### 2. Util addition — `src/lib/wwq-utils.ts`

```ts
export function getWwqQuestionMeta(order: number): {
  aspectNo: WwqAspectNo;
  aspectName: string;
  inverted: boolean; // true = the scoring answer is TIDAK
}[];
```

One entry per matching `WWQ_KEY` tuple (a question can feed two aspects, e.g. order 1 → two entries). Derived purely from `WWQ_KEY` + `WWQ_ASPECTS`; no DB access.

Table display: **Aspek** column joins `aspectName`s (" + "), **Scoring** column shows `YA` or `TIDAK` per entry (inverted entries show `TIDAK`). Read-only, informational — admin sees which answer scores before editing text.

### 3. Route + sidebar

- `src/lib/page-url.ts`: add `WWQ_SETTINGS: "/wwq-settings"` to `PAGE_URLS`.
- `src/app/(dashboard)/wwq-settings/page.tsx`: heading "WWQ Settings" + description line ("Kelola teks soal WWQ. Jumlah soal, urutan, dan skor tetap.") + `<WwqQuestionTable />` — same shape as ist-settings page.
- `src/components/sidebar/navigation-menu.ts`: add `{ title: "WWQ Settings", url: PAGE_URLS.WWQ_SETTINGS, icon: Settings }` to `NavigationSecondaryConstant` (after "IST Settings", before "User Akses").

### 4. Feature `src/features/wwq-settings/`

Mirrors `ist-settings/ist-subtest-template-table` structure:

- `wwq-question-table/{table.tsx,columns.tsx,index.ts}` — TanStack data table (reuse `@/components/table`), columns: **No** (order, mono), **Soal** (description, truncate long text), **Aspek** (from `getWwqQuestionMeta`), **Scoring** (YA / TIDAK marker), **Diubah** (`updatedAt` via `localDate`), actions column with Edit button (Pencil icon, same as ist template table).
- `wwq-question-form/{form.tsx,index.ts}` — dialog with React Hook Form + zod: readonly question number in the description label, `Textarea` for text, Prefill from clicked row, submit calls `updateQuestion` mutation, sonner toast on success (`"Teks soal tersimpan"`) and error (`"Oops.."` + message — same hook style as other wwq hooks).
- `index.ts` barrel.
- Hook: `src/hooks/api/wwq-settings/use-update-wwq-question.ts` (mutation, invalidates `wwqSettings.getAllQuestions`; list query hook `use-get-wwq-questions.ts` following the ist-settings hooks' pattern).

### 5. Seed change — `prisma/seed-wwq.ts`

Replace the `$transaction` of `upsert`s with:

1. `findMany({ select: { order: true } })` → set of existing orders.
2. Inside one `$transaction`, `create` only rows whose `order` is missing.
3. Log: `Seeded wwq questions: created N, skipped M (existing rows keep DB text)`.

Fixture validation (`length === 75`, unique `no`) stays. Header comment updated: re-running seed never overwrites admin edits; to restore JSON text, delete the row manually (or reset DB) then seed.

### 6. Out of scope

- Create/delete/reorder questions, edit `order`, edit `WWQ_KEY` / aspects / acuan.
- Public (guest) router changes; anything on `/guest/wwq/*`.
- Bulk inline editing, CSV import/export, edit history/audit UI.
- Writing edits back to `docs/wwq-data/wwq-questions.json` (one-way: JSON → seed once; admin edits live in DB only).

## Error handling

| Case | Behavior |
|---|---|
| Empty/whitespace description | zod rejects client + server: "Teks soal harus diisi" |
| >500 chars | zod rejects: "Teks soal maksimal 500 karakter" |
| Unknown id (race/stale row) | `NOT_FOUND "Soal tidak ditemukan."`, toast error |
| Query failure loading list | table shows error state like existing house tables (TanStack error + retry via refetch) |

## Testing

- `yarn run check` green.
- Behavioral walkthrough on dev server: open WWQ Settings → edit one question's text → confirm toast + table shows new text → open an existing WWQ result page (detail answers) → confirm stored answers still display against question rows (id-keyed, unaffected).
- Guest side sanity: change text of a question, start a fresh test session, new text visible; scoring unchanged (verify with known all-TIDAK expectation via `scripts/verify-wwq-scoring.ts` — unaffected, runs on `WWQ_KEY` only, must stay green).
- Seed: run against populated DB → log shows `created 0, skipped 75`, no text overwritten; delete one row via Prisma Studio, re-run → that order recreated from JSON.
