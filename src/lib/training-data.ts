// Training data for IST with 9 types of subtest questions
// Each type has 5 rational but not difficult questions

export const trainingData = {
    id: "training",
    name: "Latihan IST",
    description: "Halaman Latihan IST",
    timeLimit: 5, // 5 minutes
  };
  
  export const getTrainingQuestions = (type: string) => {
    switch (type) {
      case "1":
        // Subtest 1: Analogi Verbal (Radio Questions)
        return [
          {
            id: "train-1-1",
            text: "Pilih kata yang paling tepat untuk melengkapi analogi:",
            subtestTemplateId: "1",
            options: [
              { id: "train-1-1-a", text: "Mata", imageUrl: null },
              { id: "train-1-1-b", text: "Telinga", imageUrl: null },
              { id: "train-1-1-c", text: "Hidung", imageUrl: null },
              { id: "train-1-1-d", text: "Mulut", imageUrl: null },
              { id: "train-1-1-e", text: "Kepala", imageUrl: null },
            ],
          },
          {
            id: "train-1-2",
            text: "Pilih lawan kata yang tepat:",
            subtestTemplateId: "1",
            options: [
              { id: "train-1-2-a", text: "Besar", imageUrl: null },
              { id: "train-1-2-b", text: "Tinggi", imageUrl: null },
              { id: "train-1-2-c", text: "Kecil", imageUrl: null },
              { id: "train-1-2-d", text: "Pendek", imageUrl: null },
              { id: "train-1-2-e", text: "Lebar", imageUrl: null },
            ],
          },
          {
            id: "train-1-3",
            text: "Pilih kata yang tidak termasuk dalam kelompok:",
            subtestTemplateId: "1",
            options: [
              { id: "train-1-3-a", text: "Apel", imageUrl: null },
              { id: "train-1-3-b", text: "Jeruk", imageUrl: null },
              { id: "train-1-3-c", text: "Pisang", imageUrl: null },
              { id: "train-1-3-d", text: "Wortel", imageUrl: null },
              { id: "train-1-3-e", text: "Mangga", imageUrl: null },
            ],
          },
          {
            id: "train-1-4",
            text: "Pilih kata yang paling tepat untuk melengkapi kalimat:",
            subtestTemplateId: "1",
            options: [
              { id: "train-1-4-a", text: "Membaca", imageUrl: null },
              { id: "train-1-4-b", text: "Menulis", imageUrl: null },
              { id: "train-1-4-c", text: "Belajar", imageUrl: null },
              { id: "train-1-4-d", text: "Mengajar", imageUrl: null },
              { id: "train-1-4-e", text: "Mendengar", imageUrl: null },
            ],
          },
          {
            id: "train-1-5",
            text: "Pilih kata yang memiliki arti sama:",
            subtestTemplateId: "1",
            options: [
              { id: "train-1-5-a", text: "Cepat", imageUrl: null },
              { id: "train-1-5-b", text: "Lambat", imageUrl: null },
              { id: "train-1-5-c", text: "Gesit", imageUrl: null },
              { id: "train-1-5-d", text: "Diam", imageUrl: null },
              { id: "train-1-5-e", text: "Berhenti", imageUrl: null },
            ],
          },
        ];
  
      case "2":
        // Subtest 2: Analogi Gambar (Radio Questions)
        return [
          {
            id: "train-2-1",
            text: "",
            subtestTemplateId: "2",
            options: [
              { id: "train-2-1-a", text: "Segitiga", imageUrl: null },
              { id: "train-2-1-b", text: "Lingkaran", imageUrl: null },
              { id: "train-2-1-c", text: "Persegi", imageUrl: null },
              { id: "train-2-1-d", text: "Jajar Genjang", imageUrl: null },
              { id: "train-2-1-e", text: "Trapesium", imageUrl: null },
            ],
          },
          {
            id: "train-2-2",
            text: "",
            subtestTemplateId: "2",
            options: [
              { id: "train-2-2-a", text: "Matahari", imageUrl: null },
              { id: "train-2-2-b", text: "Bulan", imageUrl: null },
              { id: "train-2-2-c", text: "Bintang", imageUrl: null },
              { id: "train-2-2-d", text: "Awan", imageUrl: null },
              { id: "train-2-2-e", text: "Pelangi", imageUrl: null },
            ],
          },
          {
            id: "train-2-3",
            text: "",
            subtestTemplateId: "2",
            options: [
              { id: "train-2-3-a", text: "Mobil", imageUrl: null },
              { id: "train-2-3-b", text: "Motor", imageUrl: null },
              { id: "train-2-3-c", text: "Sepeda", imageUrl: null },
              { id: "train-2-3-d", text: "Bus", imageUrl: null },
              { id: "train-2-3-e", text: "Kereta", imageUrl: null },
            ],
          },
          {
            id: "train-2-4",
            text: "",
            subtestTemplateId: "2",
            options: [
              { id: "train-2-4-a", text: "Bunga", imageUrl: null },
              { id: "train-2-4-b", text: "Pohon", imageUrl: null },
              { id: "train-2-4-c", text: "Rumput", imageUrl: null },
              { id: "train-2-4-d", text: "Daun", imageUrl: null },
              { id: "train-2-4-e", text: "Akar", imageUrl: null },
            ],
          },
          {
            id: "train-2-5",
            text: "",
            subtestTemplateId: "2",
            options: [
              { id: "train-2-5-a", text: "Rumah", imageUrl: null },
              { id: "train-2-5-b", text: "Gedung", imageUrl: null },
              { id: "train-2-5-c", text: "Jembatan", imageUrl: null },
              { id: "train-2-5-d", text: "Menara", imageUrl: null },
              { id: "train-2-5-e", text: "Tembok", imageUrl: null },
            ],
          },
        ];
  
      case "3":
        // Subtest 3: Analogi Verbal Lanjutan (Radio Questions)
        return [
          {
            id: "train-3-1",
            text: "Pilih kata yang melengkapi analogi: Kaki : Berjalan = Tangan : ?",
            subtestTemplateId: "3",
            options: [
              { id: "train-3-1-a", text: "Memegang", imageUrl: null },
              { id: "train-3-1-b", text: "Melihat", imageUrl: null },
              { id: "train-3-1-c", text: "Mendengar", imageUrl: null },
              { id: "train-3-1-d", text: "Mencium", imageUrl: null },
              { id: "train-3-1-e", text: "Merasa", imageUrl: null },
            ],
          },
          {
            id: "train-3-2",
            text: "Pilih kata yang melengkapi analogi: Air : Minum = Makanan : ?",
            subtestTemplateId: "3",
            options: [
              { id: "train-3-2-a", text: "Minum", imageUrl: null },
              { id: "train-3-2-b", text: "Makan", imageUrl: null },
              { id: "train-3-2-c", text: "Memasak", imageUrl: null },
              { id: "train-3-2-d", text: "Membeli", imageUrl: null },
              { id: "train-3-2-e", text: "Menyimpan", imageUrl: null },
            ],
          },
          {
            id: "train-3-3",
            text: "Pilih kata yang melengkapi analogi: Buku : Membaca = Musik : ?",
            subtestTemplateId: "3",
            options: [
              { id: "train-3-3-a", text: "Mendengar", imageUrl: null },
              { id: "train-3-3-b", text: "Melihat", imageUrl: null },
              { id: "train-3-3-c", text: "Menyanyi", imageUrl: null },
              { id: "train-3-3-d", text: "Menari", imageUrl: null },
              { id: "train-3-3-e", text: "Memainkan", imageUrl: null },
            ],
          },
          {
            id: "train-3-4",
            text: "Pilih kata yang melengkapi analogi: Matahari : Panas = Es : ?",
            subtestTemplateId: "3",
            options: [
              { id: "train-3-4-a", text: "Dingin", imageUrl: null },
              { id: "train-3-4-b", text: "Panas", imageUrl: null },
              { id: "train-3-4-c", text: "Hangat", imageUrl: null },
              { id: "train-3-4-d", text: "Segar", imageUrl: null },
              { id: "train-3-4-e", text: "Basah", imageUrl: null },
            ],
          },
          {
            id: "train-3-5",
            text: "Pilih kata yang melengkapi analogi: Guru : Mengajar = Dokter : ?",
            subtestTemplateId: "3",
            options: [
              { id: "train-3-5-a", text: "Belajar", imageUrl: null },
              { id: "train-3-5-b", text: "Mengobati", imageUrl: null },
              { id: "train-3-5-c", text: "Membaca", imageUrl: null },
              { id: "train-3-5-d", text: "Menulis", imageUrl: null },
              { id: "train-3-5-e", text: "Mendengar", imageUrl: null },
            ],
          },
        ];
  
      case "4":
        // Subtest 4: Klasifikasi (Text Questions)
        return [
          {
            id: "train-4-1",
            question: "Tuliskan kata yang tidak termasuk dalam kelompok: Merah, Biru, Hijau, Kuning, Keras",
          },
          {
            id: "train-4-2",
            question: "Tuliskan kata yang tidak termasuk dalam kelompok: Kucing, Anjing, Burung, Ikan, Meja",
          },
          {
            id: "train-4-3",
            question: "Tuliskan kata yang tidak termasuk dalam kelompok: Senin, Selasa, Rabu, Kamis, Januari",
          },
          {
            id: "train-4-4",
            question: "Tuliskan kata yang tidak termasuk dalam kelompok: Jakarta, Bandung, Surabaya, Medan, Indonesia",
          },
          {
            id: "train-4-5",
            question: "Tuliskan kata yang tidak termasuk dalam kelompok: Mata, Telinga, Hidung, Mulut, Rambut",
          },
        ];
  
      case "5":
        // Subtest 5: Aritmatika (Number Selection)
        return [
          {
            id: "train-5-1",
            text: "Berapa hasil dari 8 + 5?",
          },
          {
            id: "train-5-2",
            text: "Berapa hasil dari 12 - 7?",
          },
          {
            id: "train-5-3",
            text: "Berapa hasil dari 4 x 6?",
          },
          {
            id: "train-5-4",
            text: "Berapa hasil dari 15 ÷ 3?",
          },
          {
            id: "train-5-5",
            text: "Berapa hasil dari 9 + 3 x 2?",
          },
        ];
  
      case "6":
        // Subtest 6: Deret Angka (Number Selection)
        return [
          {
            id: "train-6-1",
            text: "Lanjutkan pola: 2, 4, 6, 8, ?",
          },
          {
            id: "train-6-2",
            text: "Lanjutkan pola: 1, 3, 5, 7, ?",
          },
          {
            id: "train-6-3",
            text: "Lanjutkan pola: 3, 6, 9, 12, ?",
          },
          {
            id: "train-6-4",
            text: "Lanjutkan pola: 10, 8, 6, 4, ?",
          },
          {
            id: "train-6-5",
            text: "Lanjutkan pola: 1, 2, 4, 8, ?",
          },
        ];
  
      case "7":
        // Subtest 7: Analogi Gambar Lanjutan (Radio Questions with Images)
        return [
          {
            id: "train-7-1",
            text: "",
            subtestTemplateId: "7",
            options: [
              { id: "train-7-1-a", text: "A", imageUrl: null },
              { id: "train-7-1-b", text: "B", imageUrl: null },
              { id: "train-7-1-c", text: "C", imageUrl: null },
              { id: "train-7-1-d", text: "D", imageUrl: null },
              { id: "train-7-1-e", text: "E", imageUrl: null },
            ],
          },
          {
            id: "train-7-2",
            text: "",
            subtestTemplateId: "7",
            options: [
              { id: "train-7-2-a", text: "A", imageUrl: null },
              { id: "train-7-2-b", text: "B", imageUrl: null },
              { id: "train-7-2-c", text: "C", imageUrl: null },
              { id: "train-7-2-d", text: "D", imageUrl: null },
              { id: "train-7-2-e", text: "E", imageUrl: null },
            ],
          },
          {
            id: "train-7-3",
            text: "",
            subtestTemplateId: "7",
            options: [
              { id: "train-7-3-a", text: "A", imageUrl: null },
              { id: "train-7-3-b", text: "B", imageUrl: null },
              { id: "train-7-3-c", text: "C", imageUrl: null },
              { id: "train-7-3-d", text: "D", imageUrl: null },
              { id: "train-7-3-e", text: "E", imageUrl: null },
            ],
          },
          {
            id: "train-7-4",
            text: "",
            subtestTemplateId: "7",
            options: [
              { id: "train-7-4-a", text: "A", imageUrl: null },
              { id: "train-7-4-b", text: "B", imageUrl: null },
              { id: "train-7-4-c", text: "C", imageUrl: null },
              { id: "train-7-4-d", text: "D", imageUrl: null },
              { id: "train-7-4-e", text: "E", imageUrl: null },
            ],
          },
          {
            id: "train-7-5",
            text: "",
            subtestTemplateId: "7",
            options: [
              { id: "train-7-5-a", text: "A", imageUrl: null },
              { id: "train-7-5-b", text: "B", imageUrl: null },
              { id: "train-7-5-c", text: "C", imageUrl: null },
              { id: "train-7-5-d", text: "D", imageUrl: null },
              { id: "train-7-5-e", text: "E", imageUrl: null },
            ],
          },
        ];
  
      case "8":
        // Subtest 8: Analogi Gambar Kompleks (Radio Questions with Images)
        return [
          {
            id: "train-8-1",
            text: "",
            subtestTemplateId: "8",
            options: [
              { id: "train-8-1-a", text: "A", imageUrl: null },
              { id: "train-8-1-b", text: "B", imageUrl: null },
              { id: "train-8-1-c", text: "C", imageUrl: null },
              { id: "train-8-1-d", text: "D", imageUrl: null },
              { id: "train-8-1-e", text: "E", imageUrl: null },
            ],
          },
          {
            id: "train-8-2",
            text: "",
            subtestTemplateId: "8",
            options: [
              { id: "train-8-2-a", text: "A", imageUrl: null },
              { id: "train-8-2-b", text: "B", imageUrl: null },
              { id: "train-8-2-c", text: "C", imageUrl: null },
              { id: "train-8-2-d", text: "D", imageUrl: null },
              { id: "train-8-2-e", text: "E", imageUrl: null },
            ],
          },
          {
            id: "train-8-3",
            text: "",
            subtestTemplateId: "8",
            options: [
              { id: "train-8-3-a", text: "A", imageUrl: null },
              { id: "train-8-3-b", text: "B", imageUrl: null },
              { id: "train-8-3-c", text: "C", imageUrl: null },
              { id: "train-8-3-d", text: "D", imageUrl: null },
              { id: "train-8-3-e", text: "E", imageUrl: null },
            ],
          },
          {
            id: "train-8-4",
            text: "",
            subtestTemplateId: "8",
            options: [
              { id: "train-8-4-a", text: "A", imageUrl: null },
              { id: "train-8-4-b", text: "B", imageUrl: null },
              { id: "train-8-4-c", text: "C", imageUrl: null },
              { id: "train-8-4-d", text: "D", imageUrl: null },
              { id: "train-8-4-e", text: "E", imageUrl: null },
            ],
          },
          {
            id: "train-8-5",
            text: "",
            subtestTemplateId: "8",
            options: [
              { id: "train-8-5-a", text: "A", imageUrl: null },
              { id: "train-8-5-b", text: "B", imageUrl: null },
              { id: "train-8-5-c", text: "C", imageUrl: null },
              { id: "train-8-5-d", text: "D", imageUrl: null },
              { id: "train-8-5-e", text: "E", imageUrl: null },
            ],
          },
        ];
  
      case "9":
        // Subtest 9: Klasifikasi Verbal (Radio Questions)
        return [
          {
            id: "train-9-1",
            text: "Pilih kata yang dimulai dengan huruf A:",
            subtestTemplateId: "9",
            options: [
              { id: "train-9-1-a", text: "Anjing", imageUrl: null },
              { id: "train-9-1-b", text: "Buku", imageUrl: null },
              { id: "train-9-1-c", text: "Cinta", imageUrl: null },
              { id: "train-9-1-d", text: "Dunia", imageUrl: null },
              { id: "train-9-1-e", text: "Ekor", imageUrl: null },
            ],
          },
          {
            id: "train-9-2",
            text: "Pilih kata yang dimulai dengan huruf B:",
            subtestTemplateId: "9",
            options: [
              { id: "train-9-2-a", text: "Anjing", imageUrl: null },
              { id: "train-9-2-b", text: "Buku", imageUrl: null },
              { id: "train-9-2-c", text: "Cinta", imageUrl: null },
              { id: "train-9-2-d", text: "Dunia", imageUrl: null },
              { id: "train-9-2-e", text: "Ekor", imageUrl: null },
            ],
          },
          {
            id: "train-9-3",
            text: "Pilih kata yang dimulai dengan huruf C:",
            subtestTemplateId: "9",
            options: [
              { id: "train-9-3-a", text: "Anjing", imageUrl: null },
              { id: "train-9-3-b", text: "Buku", imageUrl: null },
              { id: "train-9-3-c", text: "Cinta", imageUrl: null },
              { id: "train-9-3-d", text: "Dunia", imageUrl: null },
              { id: "train-9-3-e", text: "Ekor", imageUrl: null },
            ],
          },
          {
            id: "train-9-4",
            text: "Pilih kata yang dimulai dengan huruf D:",
            subtestTemplateId: "9",
            options: [
              { id: "train-9-4-a", text: "Anjing", imageUrl: null },
              { id: "train-9-4-b", text: "Buku", imageUrl: null },
              { id: "train-9-4-c", text: "Cinta", imageUrl: null },
              { id: "train-9-4-d", text: "Dunia", imageUrl: null },
              { id: "train-9-4-e", text: "Ekor", imageUrl: null },
            ],
          },
          {
            id: "train-9-5",
            text: "Pilih kata yang dimulai dengan huruf E:",
            subtestTemplateId: "9",
            options: [
              { id: "train-9-5-a", text: "Anjing", imageUrl: null },
              { id: "train-9-5-b", text: "Buku", imageUrl: null },
              { id: "train-9-5-c", text: "Cinta", imageUrl: null },
              { id: "train-9-5-d", text: "Dunia", imageUrl: null },
              { id: "train-9-5-e", text: "Ekor", imageUrl: null },
            ],
          },
        ];
  
      default:
        return [
          {
            id: "train-default-1",
            text: "Pertanyaan latihan default",
            subtestTemplateId: "1",
            options: [
              { id: "train-default-1-a", text: "Pilihan A", imageUrl: null },
              { id: "train-default-1-b", text: "Pilihan B", imageUrl: null },
              { id: "train-default-1-c", text: "Pilihan C", imageUrl: null },
            ],
          },
        ];
    }
  };