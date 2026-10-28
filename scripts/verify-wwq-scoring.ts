import {
  calculateWWQScores,
  wwqCategory,
  WWQ_ASPECTS,
  WWQ_KEY,
} from "../src/lib/wwq-utils";
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

// all-TIDAK: not near-zero — 17 inverted key entries score on TIDAK.
// Aspect 4 (Tendensi Paranoid) lands exactly on the 120 boundary.
const tidak = new Map<number, boolean>();
for (let i = 1; i <= 75; i++) tidak.set(i, false);
const z = calculateWWQScores(tidak);
assert.strictEqual(z.totalWeighted, 504);
assert.strictEqual(z.category, "Normal");
assert.strictEqual(
  z.aspects.find((a) => a.aspectNo === 4)?.category,
  "Kecendrungan Pathologis",
);

// true-zero scores: answer every question so no key entry matches
// (YA for inverted entries, TIDAK for normal ones) -> percent guard branch.
const zero = new Map<number, boolean>();
for (let i = 1; i <= 75; i++) zero.set(i, false);
for (const [questionOrder, , inverted] of WWQ_KEY)
  if (inverted) zero.set(questionOrder, true);
const t = calculateWWQScores(zero);
assert.strictEqual(t.totalWeighted, 0);
assert.strictEqual(t.overallValue, 0);
assert.ok(t.aspects.every((a) => a.percent === 0 && a.category === "Normal"));

// key-entry transcription cross-check: per-aspect entry counts === maxItems
const perAspect = new Map<number, number>();
for (const [, aspectNo] of WWQ_KEY)
  perAspect.set(aspectNo, (perAspect.get(aspectNo) ?? 0) + 1);
for (const a of WWQ_ASPECTS)
  assert.strictEqual(
    perAspect.get(a.no) ?? 0,
    a.maxItems,
    `aspect ${a.no} (${a.name}) key count`,
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
