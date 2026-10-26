import { calculateWWQScores, wwqCategory } from "../src/lib/wwq-utils";
import assert from "node:assert";
import fs from "node:fs";

// Fixture = column C (sample answers) of docs/WWQ.xlsx rows 14-88,
// extracted by the Step 3 command so there is no transcription risk.
const rawFixture = JSON.parse(
  fs.readFileSync("docs/wwq-data/wwq-answers-sample.json", "utf-8"),
) as boolean[];
assert.strictEqual(rawFixture.length, 75);

const answers = new Map<number, boolean>();
rawFixture.forEach((a, i) => answers.set(i + 1, a));

const r = calculateWWQScores(answers);
assert.deepStrictEqual(
  r.aspects.map((a) => a.rawScore),
  [1, 3, 3, 2, 2, 2, 1, 0],
  "raw scores",
);
assert.deepStrictEqual(
  r.aspects.map((a) => a.weighted),
  [28, 72, 90, 40, 52, 72, 52, 0],
  "weighted scores",
);
assert.strictEqual(r.totalWeighted, 406);
assert.strictEqual(r.overallValue, 50.75);
assert.ok(r.aspects.every((a) => a.category === "Normal"));
assert.strictEqual(r.category, "Normal");

// percents sum to 100
const pctSum = r.aspects.reduce((s, a) => s + a.percent, 0);
assert.ok(Math.abs(pctSum - 100) < 1e-9, `percents sum ${pctSum}`);

// zero-ish edge case: all TIDAK answers must not crash and stay finite
const zero = new Map<number, boolean>();
for (let i = 1; i <= 75; i++) zero.set(i, false);
const z = calculateWWQScores(zero);
assert.ok(Number.isFinite(z.overallValue));
assert.ok(
  z.aspects.every(
    (a) => a.category === "Normal" || a.category === "Kecendrungan Pathologis",
  ),
);

// category thresholds
assert.strictEqual(wwqCategory(119), "Normal");
assert.strictEqual(wwqCategory(120), "Kecendrungan Pathologis");
assert.strictEqual(wwqCategory(180), "Kecendrungan Pathologis");
assert.strictEqual(wwqCategory(181), "Gangguan Pathologis");

console.log("WWQ scoring verification OK");
console.log(
  r.aspects
    .map((a) => `${a.aspectNo}:${a.rawScore}/${a.percent.toFixed(2)}%`)
    .join(" "),
);
