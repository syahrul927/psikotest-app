// Seeds WwqQuestion from docs/wwq-data/wwq-questions.json (extracted from docs/WWQ.xlsx).
// Install-only: creates orders that are missing and NEVER overwrites existing
// rows — admin edits made in WWQ Settings live in the DB. To restore JSON text
// for an order, edit that row's description (WWQ Settings or SQL UPDATE).
// Do NOT delete answered rows: WwqAnswer.questionId is ON DELETE RESTRICT, so
// the delete fails, and removing its answers first would destroy real test data.
// Run from repo root:
//   ./node_modules/.bin/tsc --strict --target es2022 --module commonjs \
//     --moduleResolution node --esModuleInterop --skipLibCheck \
//     --outDir /tmp/wwqseed prisma/seed-wwq.ts \
//   && NODE_PATH="$PWD/node_modules" node /tmp/wwqseed/seed-wwq.js
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

interface WwqQuestionJson {
  no: number;
  text: string;
}

async function main() {
  const file = path.join(
    process.cwd(),
    "docs",
    "wwq-data",
    "wwq-questions.json",
  );
  const questions = JSON.parse(
    fs.readFileSync(file, "utf-8"),
  ) as WwqQuestionJson[];
  if (questions.length !== 75) {
    throw new Error(`Expected 75 questions, got ${questions.length}`);
  }
  if (new Set(questions.map((q) => q.no)).size !== 75) {
    throw new Error("Fixture has duplicate question numbers");
  }

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
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
