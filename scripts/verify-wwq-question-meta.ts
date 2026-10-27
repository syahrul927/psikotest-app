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
