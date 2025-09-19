// constanta of category
export type Scale =
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
export function calculatePAPIScores(answers: string[]): Record<Scale, number> {
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

const factorRules: Record<string, Rule[]> = {
  N: [
    { min: 7, description: "Ketekunan, tanggung jawab terhadap tugas tinggi" },
    { min: 5, description: "Cukup bertanggung jawab terhadap pekerjaan" },
    { min: 3, description: "Berhati-hati, cenderung ragu" },
    {
      min: 0,
      description:
        "Cenderung ragu dalam situasi pengambilan keputusan, menunda atau menghindari situasi pengambilan keputusan",
    },
  ],
  G: [
    { min: 5, description: "Kemauan bekerja keras tinggi" },
    {
      min: 0,
      description:
        "Bekerja hanya untuk mengejar kesenangan saja, bukan untuk memberikan suatu hasil yang baik",
    },
  ],
  A: [
    {
      min: 6,
      description:
        "Tujuan-tujuan didefinisikan secara jelas: kebutuhan untuk sukses tinggi, ambisi pribadi tinggi",
    },
    {
      min: 0,
      description:
        "Mencerminkan ketidakpuasan tujuan… kepuasan dalam suatu pekerjaan: tidak perlu melanjutkan usaha untuk sukses",
    },
  ],
  L: [
    {
      min: 5,
      description:
        "Seseorang memproyeksikan dirinya sebagai pemimpin … demokratis atau diktator, otoriter",
    },
    {
      min: 0,
      description:
        "Cenderung tidak secara aktif menggunakan orang lain dalam bekerja",
    },
  ],
  P: [
    {
      min: 5,
      description:
        "Tingkat kebutuhan untuk menerima tanggung jawab orang lain, menjadi orang yang bertanggung jawab",
    },
    {
      min: 0,
      description:
        "Menurunnya keinginan untuk bertanggung jawab terhadap pekerjaan dan tindakan orang lain",
    },
  ],
  I: [
    { min: 8, description: "Tidak ragu-ragu dalam proses pembuatan keputusan" },
    {
      min: 5,
      description:
        "Mudah dan lancar sampai berhati-hati dalam membuat keputusan",
    },
    { min: 3, description: "Berhati-hati sampai ragu dalam membuat keputusan" },
    {
      min: 0,
      description:
        "Ragu-ragu sampai penundaan/menolak situasi pengambilan keputusan",
    },
  ],
  T: [
    { min: 4, description: "Tergolong aktif secara internal dan mental" },
    {
      min: 0,
      description: "Melakukan segala sesuatu menurut kemauannya sendiri",
    },
  ],
  V: [
    {
      min: 5,
      description:
        "Keaktifan secara fisik tergolong agak baik, cenderung tipe orang sportif",
    },
    {
      min: 0,
      description:
        "Keaktifannya tergolong rendah, cenderung pasif. Hanya duduk saja",
    },
  ],
  X: [
    { min: 8, description: "Membutuhkan perhatian yang nyata" },
    { min: 4, description: "Khusus, memiliki perilaku yang unik" },
    { min: 2, description: "Rendah hati, tulus" },
    { min: 0, description: "Cenderung pemalu, suka menyendiri" },
  ],
  S: [
    {
      min: 6,
      description:
        "Tingkat kepercayaan dalam hubungan sosial tinggi; menyukai interaksi sosial",
    },
    {
      min: 0,
      description:
        "Memiliki penilaian yang rendah terhadap hubungan sosial, cenderung kurang percaya pada orang lain",
    },
  ],
  B: [
    {
      min: 6,
      description:
        "Kebutuhan untuk disukai, diakui oleh semua orang. Mudah dipengaruhi kelompok",
    },
    {
      min: 4,
      description:
        "Ada kebutuhan untuk diterima dan diakui, tetapi tidak terlalu mudah dipengaruhi kelompok",
    },
    {
      min: 0,
      description: "Selektif, secara umum melepaskan diri dari kelompok",
    },
  ],
  O: [
    {
      min: 6,
      description:
        "Ketergantungan yang sangat besar akan pengakuan dan penerimaan diri",
    },
    {
      min: 3,
      description:
        "Sadar akan kebutuhan antarpersonal, tetapi melepaskan diri dari orang lain/tidak terlalu tergantung",
    },
    {
      min: 0,
      description:
        "Tidak menyukai hubungan antarpersonal. Tidak menyukai interaksi perseorangan",
    },
  ],
  R: [
    { min: 5, description: "Penekanan pada nilai penalaran tergolong tinggi" },
    { min: 0, description: "Kurang perhatian praktis" },
  ],
  D: [
    { min: 5, description: "Minat menangani hal-hal detail cukup tinggi" },
    {
      min: 0,
      description:
        "Menyadari kebutuhan akan kecermatan, tetapi secara pribadi tidak berminat menangani hal detail",
    },
  ],
  C: [
    {
      min: 6,
      description: "Memiliki keteraturan yang sangat tinggi, cenderung kaku",
    },
    { min: 3, description: "Tergolong teratur tetapi dengan fleksibilitas" },
    { min: 0, description: "Fleksibilitas sampai ketidakteraturan" },
  ],
  Z: [
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
        "Tidak menyukai dan menolak perubahan. Cenderung menggunakan pendekatan tradisional",
    },
  ],
  E: [
    {
      min: 7,
      description:
        "Sangat menempatkan nilai-nilai dalam setiap aktivitasnya. Kebutuhan pengendalian diri yang berlebihan, mungkin digunakan sebagai mekanisme pertahanan",
    },
    {
      min: 4,
      description:
        "Memiliki pendekatan emosional yang seimbang. Mampu mengendalikan perasaannya",
    },
    { min: 2, description: "Terbuka" },
    {
      min: 0,
      description:
        "Terbuka, cepat bereaksi, tidak memikirkan nilai-nilai dalam pengendalian diri",
    },
  ],
  K: [
    { min: 8, description: "Agresif, cenderung defensif" },
    {
      min: 6,
      description:
        "Agresi pribadi yang berkaitan dengan pekerjaan, dorongan, dan semangat bersaing",
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
  F: [
    {
      min: 6,
      description:
        "Bersikap setia dan membantu secara pribadi; ada kemungkinan bantuannya bersifat politis",
    },
    { min: 4, description: "Setia terhadap perusahaan" },
    { min: 2, description: "Mengurus kepentingan diri sendiri" },
    {
      min: 0,
      description: "Cenderung egois, kemungkinan bisa bersikap memberontak",
    },
  ],
  W: [
    {
      min: 6,
      description:
        "Meningkatnya orientasi terhadap tugas dan membutuhkan instruksi yang jelas",
    },
    {
      min: 4,
      description:
        "Kebutuhan akan pengarahan dan harapan yang dirumuskan untuknya",
    },
    { min: 0, description: "Berorientasi pada tujuan, mandiri" },
  ],
};

export function papiKostickDescription(factor: string, value: number): string {
  const rules = factorRules[factor];
  if (!rules) return "";

  for (const rule of rules) {
    if (value >= rule.min) {
      return rule.description;
    }
  }
  return "";
}

export type MasterCategoryScaleType = {
  category: string;
  aspect: string;
  scale: string;
};
export const MasterCategoryScale: Record<Scale, MasterCategoryScaleType> = {
  N: {
    category: "Arah Kerja",
    aspect: "Penyelesaian secara prestasi",
    scale: "N",
  },
  G: {
    category: "Arah Kerja",
    aspect: "Peran sebagai pekerja keras",
    scale: "G",
  },
  A: { category: "Arah Kerja", aspect: "Hasrat untuk berprestasi", scale: "A" },
  L: { category: "Kepemimpinan", aspect: "Peran sebagai pemimpin", scale: "L" },
  P: {
    category: "Kepemimpinan",
    aspect: "Pengendalian orang lain",
    scale: "P",
  },
  I: {
    category: "Kepemimpinan",
    aspect: "Mudah dalam mengambil keputusan",
    scale: "I",
  },
  T: { category: "Aktifitas", aspect: "Tipe selalu sibuk", scale: "T" },
  V: { category: "Aktifitas", aspect: "Tipe yang bersemangat", scale: "V" },
  X: {
    category: "Pergaulan",
    aspect: "Kebutuhan untuk mendapatkan perhatian",
    scale: "X",
  },
  S: { category: "Pergaulan", aspect: "Pergaulan luas", scale: "S" },
  B: { category: "Pergaulan", aspect: "Kebutuhan berkelompok", scale: "B" },
  O: {
    category: "Pergaulan",
    aspect: "Kebutuhan untuk dekat dan menyayangi",
    scale: "O",
  },
  R: { category: "Gaya Kerja", aspect: "Tipe teoritikal", scale: "R" },
  D: {
    category: "Gaya Kerja",
    aspect: "Suka pekerjaan yang terperinci",
    scale: "D",
  },
  C: { category: "Gaya Kerja", aspect: "Tipe teratur", scale: "C" },
  Z: { category: "Sifat", aspect: "Hasrat untuk berubah", scale: "Z" },
  E: { category: "Sifat", aspect: "Pengendalian emosi", scale: "E" },
  K: { category: "Sifat", aspect: "Agresi", scale: "K" },
  F: { category: "Ketaatan", aspect: "Dukungan terhadap atasan", scale: "F" },
  W: {
    category: "Ketaatan",
    aspect: "Kebutuhan taat pada aturan dan pengarahan",
    scale: "W",
  },
};
