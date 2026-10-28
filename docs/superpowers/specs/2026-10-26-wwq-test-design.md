# WWQ (Woodworth's Questionnaire) — Design Spec

Date: 2026-10-26
Status: Approved
Source data: `docs/WWQ.xlsx`, extracted to `docs/wwq-data/wwq-questions.json`

## Overview

Add a fourth test type — **WWQ (Woodworth's Personal Data Sheet / questionnaire psikoneurotik)** — following the exact administration flow of the existing tests:

1. Admin creates an invitation (name + secret key) on the dashboard.
2. Tester opens the guest link, confirms the secret key, fills a profile, answers the test.
3. Answers auto-score server-side on submit; invitation becomes `DONE`.
4. Admin reviews the result on the dashboard (radar chart + per-aspect table).

WWQ is fully auto-scored (binary YA/TIDAK), so unlike IST it needs no `AWAITING_REVIEW` state or manual review router. The closest existing analogue is **PAPI-Kostick**, whose structure this feature mirrors file-for-file.

## Instrument (from WWQ.xlsx, verified)

- **75 questions**, each answered **YA (1) / TIDAK (0)**.
- **8 aspects (skala)**:

  | # | Aspect | Items |
  |---|--------|-------|
  | 1 | Ekspresi Emosi | 13 |
  | 2 | Obsesi | 15 |
  | 3 | Tendensi Schizophrenia | 12 |
  | 4 | Tendensi Paranoid | 17 |
  | 5 | Hypochondria / Somatoform | 13 |
  | 6 | Impulsif | 11 |
  | 7 | Ketidakstabilan Emosi | 6 |
  | 8 | Antisosial | 7 |

- One question can contribute to several aspects → **94 question–aspect entries**, stored in `docs/wwq-data/wwq-questions.json` as `{no, text, items: [{scale, inverted}]}`.
- **17 entries are inverted**: score 1 when the answer is TIDAK (e.g. Q14 "Dapatkah sdr. lama duduk dengan tenang?" — calm = healthy).
- Extraction was validated: recomputing aspect scores from the sample answers in the xlsx reproduces its cached totals exactly (`1,3,3,2,2,2,1,0`).

### Scoring rules (reverse-engineered from xlsx formulas, exact)

Per aspect `a`:

- `rawScore[a]` = count of entries in aspect `a` whose answer matches its key (YA for normal entries, TIDAK for inverted).
- `acuan[a]` = fixed weight per aspect: `[28, 24, 30, 20, 26, 36, 52, 52]` for aspects 1–8 (hardcoded constants from the sheet's "Acuan" column).
- `weighted[a]` = `rawScore[a] * acuan[a]`.
- `totalWeighted` = sum of `weighted` over all 8 aspects.
- `percent[a]` = `weighted[a] * 100 / totalWeighted` (0 when totalWeighted is 0).
- `overallValue` = `totalWeighted / 8` (the "Total Keseluruhan" cell, formula `$G$107/8`).

Category thresholds (identical rule applied **both** to each `weighted[a]` and to `overallValue`, per xlsx formulas in columns K and C96):

| Range | Category |
|-------|----------|
| `<= 119` | Normal |
| `120 – 180` | Kecendrungan Pathologis |
| `>= 181` | Gangguan Pathologis |

Verified against the sheet: sample answers `1,3,3,2,2,2,1,0` raw → weighted `28,72,90,40,52,72,52,0`, total `406`, percents and categories match the cached values, overall `50.75` → Normal.

## Data model (Prisma)

New models in `prisma/schema.prisma`, mirroring the PAPI-Kostick family (no shared/polymorphic tables — this follows the existing per-test convention):

```prisma
enum StatusWwqInvitation { PENDING ONPROGRESS DONE }

model WwqTesterProfile {
  id          String   @id @default(cuid())
  name        String
  phone       String?
  dateOfBirth DateTime?
  invitations WwqInvitation[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model WwqInvitation {
  id               String   @id @default(cuid())
  name             String?
  secretKey        String   @unique
  status           StatusWwqInvitation @default(PENDING)
  testerProfileId  String?
  testerProfile    WwqTesterProfile? @relation(...)
  answers          WwqAnswer[]
  result           WwqResult?
  createdAt / updatedAt
}

model WwqQuestion {
  id          String  @id @default(cuid())
  order       Int     @unique   // 1..75
  description String
  answers     WwqAnswer[]
}

model WwqAnswer {
  id           String  @id @default(cuid())
  invitationId String
  questionId   String
  answer       Boolean          // true = YA, false = TIDAK
  @@unique([invitationId, questionId])
}

model WwqResult {
  id            String  @id @default(cuid())
  invitationId  String  @unique
  totalWeighted Int               // sum of aspect weighted scores
  overallValue  Float             // totalWeighted / 8 ("Total Keseluruhan")
  category      String            // Normal / Kecendrungan Pathologis / Gangguan Pathologis
  completedAt   DateTime @default(now())
  details       WwqResultDetail[]
}

model WwqResultDetail {
  id        String @id @default(cuid())
  resultId  String
  aspect    String            // "Ekspresi Emosi", ...
  aspectNo  Int               // 1..8
  rawScore  Int               // matched entries count
  acuan     Int               // weight constant
  weighted  Int               // rawScore * acuan
  percent   Float             // weighted * 100 / totalWeighted
  category  String            // thresholds on weighted
  @@unique([resultId, aspectNo])
}
```

Migration: model changes only; **`yarn db:generate` to create the migration file; the human applies it** (repo rule: never `db:push`/`db:migrate` from the agent).

### Question seeding

Questions live in DB (like PAPI). A one-off seed script `prisma/seed-wwq.ts` reads `docs/wwq-data/wwq-questions.json` and upserts `WwqQuestion` rows by `order` (safe to re-run). Run manually by the human (`prisma db seed` or direct `ts-node` invocation, consistent with repo conventions).

## Scoring library

`src/lib/wwq-utils.ts` (mirrors `src/lib/papi-kostick-utils.ts`), pure functions, no DB access:

- `WWQ_ASPECTS: { no: 1..8, name, acuan }` metadata (names + weight constants in display order).
- `WWQ_KEY: { questionOrder, aspectNo, inverted }[]` — the 94 entries, hardcoded from the verified extraction (key = scoring logic, kept in code like PAPI's `PAPI_KEY`; only question text lives in DB).
- `calculateWWQScores(answers: Map<number, boolean>)`: completeness validation is the caller's job; returns per-aspect rawScore/weighted/percent/category, totalWeighted, overallValue, overall category — exactly the xlsx formulas.
- `WWQ_CATEGORY_RULES`: the threshold table above (single shared function used for both aspect and overall classification).

Unit-testable by construction (pure input → output), verified against the xlsx sample row.

## tRPC layer

Registered in `src/server/api/root.ts`:

- **`wwqInvitation`** = `wwq-invitation-router/` with `public/` + `protected/` + `schema.ts`, following PAPI:
  - public: `findWwqInvitation`, `confirmationSecretKey` (returns step 0 = need profile / step 1 = go to test), `startInvitation` (PENDING → ONPROGRESS), `getProfile`, `updateProfile` (upsert profile + link)
  - protected: `save` (create/update; block edit when ONPROGRESS), `getAll`, `getById`, `deleteById` (block when ONPROGRESS), `getResult`, `getDetailAnswers`
- **`wwqTest`** = `wwq-test-router/public/`:
  - `findAllQuestions` (ordered by `order`)
  - `submitAnswers` (mutation): validate exactly 75 answers present and invitation is ONPROGRESS → `createMany` answers → `calculateWWQScores` → create `WwqResult` + 8 `WwqResultDetail` rows → status `DONE`. One transaction.

Zod schemas in `schema.ts` (`save`, `secretKey`, `profile`, `submitAnswers` — answers as `{questionId, answer: boolean}[]`).

## Guest flow (`src/app/guest/wwq/`)

Routes added to `PAGE_URLS` in `src/lib/page-url.ts`; sidebar entry in `src/components/sidebar/navigation-menu.ts`.

- `guest/wwq/layout.tsx` — wraps in `AccessTestInvitationProvider` (reuse existing hook, same as PAPI).
- `guest/wwq/[slug]/confirmation/page.tsx` — server component, `findWwqInvitation(slug)`, `notFound()` on miss → `WwqInvitationFormConfirmation`.
- `guest/wwq/[slug]/profile/page.tsx` → `WwqProfileForm` (name, phone, dateOfBirth).
- `guest/wwq/[slug]/test/page.tsx` → `WwqTestForm`.
- `guest/wwq/thanks/page.tsx` — static thank-you.

Feature module `src/features/wwq-test/`:

- `wwq-wrapper/wrapper.tsx` — access gate (no access → toast + redirect to confirmation).
- `test-form/test-form.tsx` — loads questions + profile, **10 questions/page**, answers in `Map<number, boolean>`, **localStorage autosave** (key `wwq-responses`), progress bar, submit-all → thanks page.
- `test-form/question-card.tsx` — binary **YA / TIDAK** radio card (visual variant of PAPI's forced-choice A/B card).
- `test-form/test-header.tsx`, `test-navigation.tsx`, `schema.ts`.
- `invitation-confirmation/form-confirmation.tsx`, `profile-form/profile-form.tsx`.

Hooks: one per procedure under `src/hooks/api/wwq-test/` and `src/hooks/api/wwq-invitation/` (wrapping `useQuery`/`useMutation` with sonner toasts, per existing convention).

## Admin dashboard (`src/app/(dashboard)/wwq-invitation/`)

- `page.tsx` — `WwqInvitationSummary` (status counts) + `WwqInvitationTable` (shared DataTable, columns/schema/toolbar) + `WwqInvitationForm` dialog (name + secretKey), inside `FormDialogProvider`.
- `[slug]/page.tsx` — `WwqResultProvider` context (new `src/hooks/use-wwq-result-context.tsx`, combining `getResult` + `getDetailAnswers`) → `WwqInvitationResultWrapper`:
  - participant info card
  - **radar chart** — 8 aspect axes plotted by `percent` (recharts RadarChart via shadcn ChartContainer; same component family as PAPI's `radar-chart.tsx`)
  - aspect table — score, %, category per aspect
  - overall badge — totalWeighted / overallValue / overall category
  - detail answers card — 75 YA/TIDAK responses
- Feature module `src/features/wwq-invitation/` with the same subfolder layout as PAPI.

## Error handling

- Edit/delete invitation blocked when `ONPROGRESS` or `DONE` (matches PAPI protected router guards).
- Wrong secret key → inline error on confirmation step; no access → wrapper redirects.
- Submit validation: all 75 answered (count + unique questionIds), invitation must be `ONPROGRESS`; duplicate submit on `DONE` invitation rejected with clear tRPC error.
- `totalWeighted === 0` edge case (all answers score 0): all percents = 0, overallValue = 0 → category Normal (semantically correct — no psychoneurotic indications — not a divide-by-zero crash).

## Testing

- Pure scoring: assert `calculateWWQScores` on the xlsx sample answers → `1,3,3,2,2,2,1,0`, percents and categories match the sheet.
- Behavioral test through the routes themselves (repo convention): training/development path via a manual invitation; verify PENDING → ONPROGRESS → DONE transitions and result rows in Prisma Studio.

## Out of scope (YAGNI)

- No admin CRUD UI for WWQ questions (seed only).
- No manual review/grading flow (auto-scored instrument).
- No norms by age/gender (not present in source instrument).
- No PDF/export (existing tests don't have it either).

## File inventory

| Area | New files |
|------|-----------|
| Schema | `prisma/schema.prisma` (edit) + generated migration |
| Seed | `prisma/seed-wwq.ts` |
| Scoring | `src/lib/wwq-utils.ts` |
| API | `src/server/api/routers/wwq-invitation-router/{index,schema}.ts`, `public/index.ts`, `protected/index.ts`; `src/server/api/routers/wwq-test-router/public/index.ts`; `src/server/api/root.ts` (edit) |
| Guest pages | `src/app/guest/wwq/{layout,thanks}` + `[slug]/{confirmation,profile,test}` |
| Admin pages | `src/app/(dashboard)/wwq-invitation/{page,[slug]/page}.tsx` |
| Features | `src/features/wwq-test/*`, `src/features/wwq-invitation/*` |
| Hooks | `src/hooks/api/wwq-test/*`, `src/hooks/api/wwq-invitation/*`, `src/hooks/use-wwq-result-context.tsx` |
| Wiring | `src/lib/page-url.ts` (edit), `src/components/sidebar/navigation-menu.ts` (edit) |
