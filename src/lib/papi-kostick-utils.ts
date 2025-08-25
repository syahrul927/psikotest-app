// constanta of category
type Scale =
  | "N"
  | "G"
  | "A"
  | "L"
  | "P"
  | "I"
  | "T"
  | "V"
  | "O"
  | "B"
  | "S"
  | "X"
  | "C"
  | "D"
  | "R"
  | "Z"
  | "E"
  | "K"
  | "F"
  | "W";

type DataSchema = {
  index: number;
  A: Scale | null;
  B: Scale | null;
};

// answer key
const PAPI_KEY: DataSchema[] = [
  {
    index: 1,
    A: "G",
    B: "E",
  },
  {
    index: 2,
    B: "N",
    A: "A",
  },
  {
    index: 3,
    B: "A",
    A: "P",
  },
  {
    index: 4,
    B: "P",
    A: "X",
  },
  {
    index: 5,
    B: "X",
    A: "B",
  },
  {
    index: 6,
    B: "B",
    A: "O",
  },
  {
    index: 7,
    B: "O",
    A: "Z",
  },
  {
    index: 8,
    B: "Z",
    A: "K",
  },
  {
    index: 9,
    B: "K",
    A: "F",
  },
  {
    index: 10,
    B: "F",
    A: "W",
  },
  {
    index: 11,
    A: "G",
    B: "C",
  },
  {
    index: 12,
    A: "L",
    B: "E",
  },
  {
    index: 13,
    B: "N",
    A: "P",
  },
  {
    index: 14,
    B: "A",
    A: "X",
  },
  {
    index: 15,
    B: "P",
    A: "B",
  },
  {
    index: 16,
    B: "X",
    A: "O",
  },
  {
    index: 17,
    B: "B",
    A: "Z",
  },
  {
    index: 18,
    B: "O",
    A: "K",
  },
  {
    index: 19,
    B: "Z",
    A: "F",
  },
  {
    index: 20,
    B: "K",
    A: "W",
  },
  {
    index: 21,
    A: "G",
    B: "D",
  },
  {
    index: 22,
    A: "L",
    B: "C",
  },
  {
    index: 23,
    A: "I",
    B: "E",
  },
  {
    index: 24,
    B: "N",
    A: "X",
  },
  {
    index: 25,
    B: "A",
    A: "B",
  },
  {
    index: 26,
    B: "P",
    A: "O",
  },
  {
    index: 27,
    B: "X",
    A: "Z",
  },
  {
    index: 28,
    B: "B",
    A: "K",
  },
  {
    index: 29,
    B: "O",
    A: "F",
  },
  {
    index: 30,
    B: "Z",
    A: "W",
  },
  {
    index: 31,
    A: "G",
    B: "R",
  },
  {
    index: 32,
    A: "L",
    B: "D",
  },
  {
    index: 33,
    A: "I",
    B: "C",
  },
  {
    index: 34,
    A: "T",
    B: "E",
  },
  {
    index: 35,
    B: "N",
    A: "B",
  },
  {
    index: 36,
    B: "A",
    A: "O",
  },
  {
    index: 37,
    B: "P",
    A: "Z",
  },
  {
    index: 38,
    B: "X",
    A: "K",
  },
  {
    index: 39,
    B: "B",
    A: "F",
  },
  {
    index: 40,
    B: "O",
    A: "W",
  },
  {
    index: 41,
    A: "G",
    B: "S",
  },
  {
    index: 42,
    A: "L",
    B: "R",
  },
  {
    index: 43,
    A: "I",
    B: "D",
  },
  {
    index: 44,
    A: "T",
    B: "C",
  },
  {
    index: 45,
    A: "V",
    B: "E",
  },
  {
    index: 46,
    B: "N",
    A: "O",
  },
  {
    index: 47,
    B: "A",
    A: "Z",
  },
  {
    index: 48,
    B: "P",
    A: "K",
  },
  {
    index: 49,
    B: "X",
    A: "F",
  },
  {
    index: 50,
    B: "B",
    A: "W",
  },
  {
    index: 51,
    A: "G",
    B: "V",
  },
  {
    index: 52,
    A: "L",
    B: "S",
  },
  {
    index: 53,
    A: "I",
    B: "R",
  },
  {
    index: 54,
    A: "T",
    B: "D",
  },
  {
    index: 55,
    A: "V",
    B: "C",
  },
  {
    index: 56,
    A: "S",
    B: "E",
  },
  {
    index: 57,
    B: "N",
    A: "Z",
  },
  {
    index: 58,
    B: "A",
    A: "K",
  },
  {
    index: 59,
    B: "P",
    A: "F",
  },
  {
    index: 60,
    B: "X",
    A: "W",
  },
  {
    index: 61,
    A: "G",
    B: "T",
  },
  {
    index: 62,
    A: "L",
    B: "V",
  },
  {
    index: 63,
    A: "I",
    B: "S",
  },
  {
    index: 64,
    A: "T",
    B: "R",
  },
  {
    index: 65,
    A: "V",
    B: "D",
  },
  {
    index: 66,
    A: "S",
    B: "C",
  },
  {
    index: 67,
    A: "R",
    B: "E",
  },
  {
    index: 68,
    B: "N",
    A: "K",
  },
  {
    index: 69,
    B: "A",
    A: "F",
  },
  {
    index: 70,
    B: "P",
    A: "W",
  },
  {
    index: 71,
    A: "G",
    B: "I",
  },
  {
    index: 72,
    A: "L",
    B: "T",
  },
  {
    index: 73,
    A: "I",
    B: "V",
  },
  {
    index: 74,
    A: "T",
    B: "S",
  },
  {
    index: 75,
    A: "V",
    B: "R",
  },
  {
    index: 76,
    A: "S",
    B: "D",
  },
  {
    index: 77,
    A: "R",
    B: "C",
  },
  {
    index: 78,
    A: "D",
    B: "E",
  },
  {
    index: 79,
    B: "N",
    A: "F",
  },
  {
    index: 80,
    B: "A",
    A: "W",
  },
  {
    index: 81,
    A: "G",
    B: "L",
  },
  {
    index: 82,
    A: "L",
    B: "I",
  },
  {
    index: 83,
    A: "I",
    B: "T",
  },
  {
    index: 84,
    A: "T",
    B: "V",
  },
  {
    index: 85,
    A: "V",
    B: "S",
  },
  {
    index: 86,
    A: "S",
    B: "R",
  },
  {
    index: 87,
    A: "R",
    B: "D",
  },
  {
    index: 88,
    A: "D",
    B: "C",
  },
  {
    index: 89,
    A: "C",
    B: "E",
  },
  {
    index: 90,
    B: "N",
    A: "W",
  },
];

// Function to calculate the score
export function calculatePAPIScores(
  answers: ("A" | "B")[],
): Record<Scale, number> {
  if (answers.length !== 90) {
    throw new Error(`Jawaban harus 90 soal, diterima: ${answers.length}`);
  }

  const scores: Record<Scale, number> = {
    N: 0,
    G: 0,
    A: 0,
    L: 0,
    P: 0,
    I: 0,
    T: 0,
    V: 0,
    O: 0,
    B: 0,
    S: 0,
    X: 0,
    C: 0,
    D: 0,
    R: 0,
    Z: 0,
    E: 0,
    K: 0,
    F: 0,
    W: 0,
  };

  answers.forEach((ans, idx) => {
    const key = PAPI_KEY[idx];
    if (!key) {
      throw new Error(`Mapping untuk soal ke-${idx + 1} belum tersedia`);
    }
    const scale = ans === "A" ? key.A : key.B;
    if (scale) {
      scores[scale]++;
    }
  });

  return scores;
}

/* EXAMPLE USAGE */
// const userAnswers: ("A" | "B")[] = [
//   "A", "A", "A", "A", "A", "A", "B", "B", "B", "B",
//   "A", "B", "A", "B", "B", "A", "A", "B", "B", "B",
//   "B", "A", "B", "A", "B", "B", "B", "B", "A", "B",
//   "A", "A", "A", "A", "A", "A", "A", "A", "A", "A",
//   "B", "B", "B", "B", "B", "B", "B", "B", "B", "B",
//   "B", "B", "B", "B", "B", "B", "B", "B", "B", "B",
//   "A", "B", "B", "B", "B", "B", "B", "B", "B", "B",
//   "B", "B", "A", "B", "B", "B", "B", "B", "B", "B",
//   "A", "B", "B", "A", "A", "A", "A", "A", "A", "B"
// ];
//
// const result = calculatePAPIScores(userAnswers);

type Rule = {
  min: number;
  description: string;
};

const factorRules: Record<string, Rule[][]> = {
  N: [
    // Y5
    [
      {
        min: 7,
        description: "ketekunan, tanggung jawab, terhadap tugas tinggi",
      },
      { min: 5, description: "Cukup bertanggung jawab terhadap pekerjaan" },
      { min: 3, description: "Berhati hati, cenderung ragu" },
      {
        min: 0,
        description:
          "Cenderung ragu dalam situasi pengambilan keputusan, menunda atau menghindari situasi pengambilan keputusan",
      },
    ],
    // Y6
    [
      { min: 5, description: "kemauan bekerja keras tinggi" },
      {
        min: 0,
        description:
          "bekerja hanya untuk mengejar kesenangan saja bukan untuk memberikan suatu hasil yang baik",
      },
    ],
    // Y7
    [
      {
        min: 6,
        description:
          "tujuan-tujuan didefinisikan secara jelas: kebutuhan untuk sukses tinggi, ambisi pribadi tinggi",
      },
      {
        min: 0,
        description:
          "Mencerminkan ketidakpuasan tujuan... kepuasan dalam suatu pekerjaan: tidak perlu melanjutkan usaha untuk sukses",
      },
    ],
    // Y8
    [
      {
        min: 5,
        description:
          "seseorang memproyeksikan dirinya sebagai pemimpin. suatu tingkat ia mencoba menggunakan orang lain untuk mencapai tujuannya...",
      },
      {
        min: 0,
        description:
          "cenderung tidak secara aktif menggunakan orang lain dalam bekerja",
      },
    ],
    // Y9
    [
      {
        min: 5,
        description:
          "Tingkat kebutuhan untuk menerima tanggung jawab orang lain, menjadi orang yang bertanggung jawab",
      },
      {
        min: 0,
        description:
          "Menurunnya keinginan untuk bertanggung jawab terhadap pekerjaan dan tindakan orang lain.",
      },
    ],
    // Y10
    [
      { min: 8, description: "Tidak ragu2 dalam proses pembuatan keputusan" },
      {
        min: 5,
        description:
          "Mudah dan lancar sampai berhati-hati dalam membuat keputusan",
      },
      {
        min: 3,
        description: "Berhati-hati sampai ragu dalam membuat keputusan",
      },
      {
        min: 0,
        description:
          "ragu2 sampai penundaan/menolak situasi pengambilan keputusan",
      },
    ],
    // Y11
    [
      { min: 4, description: "Tergolong aktif secara internal dan mental" },
      {
        min: 0,
        description: "Melakukan segala sesuatu menurut kemauannya sendiri",
      },
    ],
    // Y12
    [
      {
        min: 5,
        description:
          "keaktifan secara fisik tergolong agak baik, cenderung tipe orang sportif",
      },
      {
        min: 0,
        description:
          "Keaktifannya tergolong rendah, cenderung pasif. Hanya duduk saja",
      },
    ],
    // Y13
    [
      { min: 8, description: "Membutuhkan perhatian yang nyata" },
      { min: 4, description: "khusus, memiliki perilaku yang unik" },
      { min: 2, description: "Rendah hati, tulus" },
      { min: 0, description: "Cenderung pemalu, suka menyendiri" },
    ],
    // Y14
    [
      {
        min: 6,
        description:
          "Tingkat kepercayaan dalam hubungan sosial tinggi; menyukai interaksi sosial",
      },
      {
        min: 0,
        description:
          "Memiliki penilaian yang rendah terhadap hubungan sosial cenderung kurang percaya pada orang lain",
      },
    ],
    // Y15
    [
      {
        min: 6,
        description:
          "Kebutuhan untuk disukai, diakui oleh semua orang. Mudah dipengaruhi kelompok",
      },
      {
        min: 4,
        description:
          "Ada kebutuhan untuk diterima dan diakui tetapi tidak terlalu mudah dipengaruhi kelompok",
      },
      {
        min: 0,
        description: "Selektif, secara umum melepaskan diri dari kelompok",
      },
    ],
    // Y16
    [
      {
        min: 6,
        description:
          "Ketergantungan yang sangat besar akan pengakuan dan penerimaan diri",
      },
      {
        min: 3,
        description:
          "Sadar akan kebutuhan antar pribadi tetapi melepaskan diri dari orang lain/tidak terlalu tergantung",
      },
      {
        min: 0,
        description:
          "Tidak menyukai hubungan antar pribadi. Tidak menyukai interaksi perseorangan",
      },
    ],
    // Y17
    [
      {
        min: 5,
        description: "Penekanan pada nilai penalaran tergolong tinggi",
      },
      { min: 0, description: "Kurang perhatian praktis" },
    ],
    // Y18
    [
      { min: 5, description: "Minat menangani hal2 detail cukup tinggi" },
      {
        min: 0,
        description:
          "menyadari kebutuhan akan kecermatan tetapi secara pribadi tidak berminat menangani hal detail",
      },
    ],
    // Y19
    [
      {
        min: 6,
        description: "Memiliki keteraturan yang sangat tinggi, cenderung kaku",
      },
      { min: 3, description: "Tergolong teratur tetapi dengan fleksibilitas" },
      { min: 0, description: "Fleksibilitas sampai ketidak teraturan" },
    ],
    // Y20
    [
      {
        min: 8,
        description:
          "Mudah gelisah, mudah frustrasi mungkin karena segala sesuatu bergerak tidak cukup cepat",
      },
      {
        min: 6,
        description: "Pembuat perubahan yang selektif. Berpikir jauh ke depan",
      },
      { min: 5, description: "Mudah menyesuaikan diri" },
      {
        min: 3,
        description: "Tidak suka akan perubahan jika dipaksakan padanya",
      },
      {
        min: 0,
        description:
          "tidak menyukai dan menolak perubahan. Cenderung menggunakan pendekatan tradisional.",
      },
    ],
    // Y21
    [
      {
        min: 7,
        description:
          "Sangat menempatkan nilai2 dalam setiap aktivitasnya. Kebutuhan pengendalian diri yang berlebihan, mungkin digunakan sebagai defence mechanism",
      },
      {
        min: 4,
        description:
          "memiliki pendekatan emosional yang seimbang. Mampu mengendalikan perasaannya",
      },
      { min: 2, description: "Terbuka" },
      {
        min: 0,
        description:
          "Terbuka, cepat bereaksi, tidak memikirkan nilai2 dalam pengendalian diri",
      },
    ],
    // Y22
    [
      { min: 8, description: "Agresif, cenderung defensive" },
      {
        min: 6,
        description:
          "Agresi pribadi yang berkaitan dengan pekerjaan, dorongan dan semangat bersaing",
      },
      { min: 5, description: "Keras kepala" },
      {
        min: 3,
        description:
          "Lebih menyukai tempat yang tenang. Menghindari konflik. Cenderung menunda masalah",
      },
      {
        min: 0,
        description:
          "Selalu menghindari masalah. Cenderung mengabaikan situasi atau menolak mengenali sesuatu sebagai sebuah masalah",
      },
    ],
    // Y23
    [
      {
        min: 6,
        description:
          "bersikap setia dan membantu secara pribadi; ada kemungkinan bantuannya bersifat politis",
      },
      { min: 4, description: "Setia terhadap perusahaan" },
      { min: 2, description: "Mengurus kepentingan diri sendiri" },
      {
        min: 0,
        description: "cenderung egois, kemungkinan bisa bersikap memberontak",
      },
    ],
    // Y24
    [
      {
        min: 6,
        description:
          "Meningkatnya orientasi terhadap tugas dan membutuhkan instruksi yang jelas",
      },
      {
        min: 4,
        description:
          "kebutuhan akan pengarahan dan harapan yang dirumuskan untuknya",
      },
      { min: 0, description: "berorientasi pada tujuan, mandiri" },
    ],
  ],
};

export function papiKostickDescription(
  factor: string,
  index: number,
  value: number,
): string {
  const rulesGroup = factorRules[factor];
  if (!rulesGroup) return "";

  const rules = rulesGroup[index];
  if (!rules) return "";

  for (const rule of rules) {
    if (value >= rule.min) {
      return rule.description;
    }
  }

  return "";
}
