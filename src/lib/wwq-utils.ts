// WWQ (Woodworth's Questionnaire) scoring — formulas reverse-engineered from docs/WWQ.xlsx
// Verified against the sheet's cached values (sample answers -> raw [1,3,3,2,2,2,1,0], total 406).

export type WwqAspectNo = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface WwqAspectMeta {
  no: WwqAspectNo;
  name: string;
  acuan: number; // weight constant from the sheet's "Acuan" column
  maxItems: number; // number of question-aspect entries in this aspect
}

export const WWQ_ASPECTS: WwqAspectMeta[] = [
  { no: 1, name: "Ekspresi Emosi", acuan: 28, maxItems: 13 },
  { no: 2, name: "Obsesi", acuan: 24, maxItems: 15 },
  { no: 3, name: "Tendensi Schizophrenia", acuan: 30, maxItems: 12 },
  { no: 4, name: "Tendensi Paranoid", acuan: 20, maxItems: 17 },
  { no: 5, name: "Hypochondria / Somatoform", acuan: 26, maxItems: 13 },
  { no: 6, name: "Impulsif", acuan: 36, maxItems: 11 },
  { no: 7, name: "Ketidakstabilan Emosi", acuan: 52, maxItems: 6 },
  { no: 8, name: "Antisosial", acuan: 52, maxItems: 7 },
];

export const WWQ_TOTAL_QUESTIONS = 75;

// [questionOrder, aspectNo, inverted]
// inverted=true means the score-1 answer is TIDAK (false).
export const WWQ_KEY: [number, WwqAspectNo, boolean][] = [
  [1, 1, false],
  [1, 4, false],
  [2, 1, false],
  [3, 2, false],
  [4, 2, false],
  [5, 2, false],
  [6, 2, false],
  [7, 2, false],
  [8, 1, false],
  [9, 1, false],
  [9, 6, false],
  [10, 1, false],
  [10, 6, false],
  [11, 1, false],
  [12, 1, false],
  [13, 1, false],
  [14, 7, true],
  [15, 7, false],
  [16, 7, false],
  [17, 7, false],
  [18, 7, true],
  [19, 1, false],
  [19, 5, false],
  [20, 1, true],
  [20, 8, true],
  [21, 1, true],
  [22, 5, false],
  [23, 5, false],
  [24, 5, true],
  [25, 2, false],
  [25, 5, false],
  [26, 2, false],
  [26, 5, false],
  [27, 3, false],
  [27, 5, false],
  [28, 5, false],
  [29, 5, false],
  [30, 5, false],
  [31, 5, true],
  [31, 6, true],
  [32, 2, true],
  [33, 2, false],
  [34, 1, false],
  [34, 2, false],
  [35, 3, false],
  [35, 4, false],
  [35, 7, false],
  [36, 6, false],
  [37, 5, false],
  [38, 2, false],
  [39, 2, false],
  [40, 1, false],
  [40, 2, false],
  [41, 2, false],
  [42, 2, false],
  [43, 3, true],
  [43, 4, true],
  [44, 3, false],
  [44, 4, false],
  [45, 4, true],
  [46, 3, false],
  [46, 6, false],
  [47, 4, false],
  [48, 3, true],
  [49, 3, false],
  [50, 3, false],
  [51, 3, false],
  [52, 3, false],
  [53, 3, false],
  [53, 4, false],
  [54, 3, false],
  [54, 5, false],
  [55, 4, true],
  [56, 4, false],
  [57, 4, true],
  [58, 4, false],
  [59, 4, false],
  [60, 4, true],
  [61, 4, true],
  [62, 4, false],
  [63, 4, false],
  [64, 4, false],
  [64, 6, false],
  [65, 6, false],
  [66, 6, false],
  [67, 6, false],
  [68, 6, false],
  [69, 6, false],
  [70, 8, false],
  [71, 8, false],
  [72, 8, false],
  [73, 8, false],
  [74, 8, false],
  [75, 8, false],
];

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

export type WwqCategory =
  | "Normal"
  | "Kecendrungan Pathologis"
  | "Gangguan Pathologis";

// Column-K rule from the sheet, applied to a weighted value.
export function wwqCategory(weighted: number): WwqCategory {
  if (weighted >= 181) return "Gangguan Pathologis";
  if (weighted >= 120) return "Kecendrungan Pathologis";
  return "Normal";
}

export interface WwqAspectScore {
  aspectNo: WwqAspectNo;
  aspect: string;
  rawScore: number;
  acuan: number;
  weighted: number;
  percent: number;
  category: WwqCategory;
}

export interface WwqScoreResult {
  aspects: WwqAspectScore[];
  totalWeighted: number;
  overallValue: number; // totalWeighted / 8 ("Total Keseluruhan")
  category: WwqCategory;
}

/**
 * @param answers 75 booleans indexed by question order (1..75). true = YA.
 */
export function calculateWWQScores(
  answers: Map<number, boolean>,
): WwqScoreResult {
  if (answers.size !== WWQ_TOTAL_QUESTIONS) {
    throw new Error(
      `Jawaban harus ${WWQ_TOTAL_QUESTIONS} soal, diterima: ${answers.size}`,
    );
  }

  const raw = new Map<WwqAspectNo, number>(WWQ_ASPECTS.map((a) => [a.no, 0]));

  for (const [questionOrder, aspectNo, inverted] of WWQ_KEY) {
    const answer = answers.get(questionOrder);
    if (answer === undefined) {
      throw new Error(`Jawaban soal ke-${questionOrder} belum tersedia`);
    }
    const scored = inverted ? answer === false : answer === true;
    if (scored) raw.set(aspectNo, (raw.get(aspectNo) ?? 0) + 1);
  }

  const aspects: WwqAspectScore[] = WWQ_ASPECTS.map((meta) => {
    const rawScore = raw.get(meta.no) ?? 0;
    const weighted = rawScore * meta.acuan;
    return {
      aspectNo: meta.no,
      aspect: meta.name,
      rawScore,
      acuan: meta.acuan,
      weighted,
      percent: 0, // filled below
      category: wwqCategory(weighted),
    };
  });

  const totalWeighted = aspects.reduce((s, a) => s + a.weighted, 0);
  for (const a of aspects) {
    // guard: all-zero answers -> 0% (sheet shows Normal, not NaN)
    a.percent = totalWeighted === 0 ? 0 : (a.weighted * 100) / totalWeighted;
  }

  const overallValue = totalWeighted / 8;

  return {
    aspects,
    totalWeighted,
    overallValue,
    category: wwqCategory(overallValue),
  };
}
