// Seeds WwqQuestion from docs/wwq-data/wwq-questions.json (extracted from docs/WWQ.xlsx).
// Idempotent: upserts by `order`. Run manually: node via tsc build, or tsx if available.
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

  for (const q of questions) {
    await prisma.wwqQuestion.upsert({
      where: { order: q.no },
      create: { order: q.no, description: q.text },
      update: { description: q.text },
    });
  }
  const count = await prisma.wwqQuestion.count();
  console.log(`Seeded wwq questions: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
