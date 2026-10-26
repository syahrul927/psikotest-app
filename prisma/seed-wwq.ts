// Seeds WwqQuestion from docs/wwq-data/wwq-questions.json (extracted from docs/WWQ.xlsx).
// Idempotent: upserts by `order` in one transaction. Run from repo root:
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
