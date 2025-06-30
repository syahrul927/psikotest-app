"use client";
import { useInitIstResultCalculation } from "@/hooks/api/ist-result/use-init-result-calculation";
import {
  CriteriaInfoCard,
  ParticipantInfoCard,
  SummaryScoreCard,
} from "../ist-result-info";
import { AnswerDetailsTable } from "../ist-result-table";
import { LoaderSpinner } from "@/components/ui/loading-spinner";

const radarData = [
  { subtest: "SE", score: 12, fullName: "Melengkapi Kalimat" },
  { subtest: "WA", score: 14, fullName: "Pemilihan Kata" },
  { subtest: "AN", score: 11, fullName: "Analogi" },
  { subtest: "GE", score: 13, fullName: "Kesamaan" },
  { subtest: "RA", score: 15, fullName: "Soal Hitungan" },
  { subtest: "ZR", score: 12, fullName: "Deret Angka" },
  { subtest: "FA", score: 10, fullName: "Pemilihan Bentuk" },
  { subtest: "WU", score: 11, fullName: "Soal Kubus" },
  { subtest: "ME", score: 13, fullName: "Tugas Mengingat" },
];

const iqScore = 160;

const criteriaData = [
  {
    name: "Fleksibilitas Berfikir",
    totalIQ: 120.75,
    classification: "Superior",
  },
  {
    name: "Fleksibilitas Perhatian",
    totalIQ: 123.5,
    classification: "Superior",
  },
  { name: "Daya Nalar/Logika", totalIQ: 117, classification: "High Average" },
  {
    name: "Daya ingat &Konsentrasi",
    totalIQ: 77,
    classification: "Low Average",
  },
  { name: "Analisa Sintesa", totalIQ: 120.8, classification: "Superior" },
  { name: "Numerik", totalIQ: 120, classification: "Superior" },
  { name: "Total IQ", totalIQ: 160, classification: "Very Superior" },
];

const subtestAnswerDetails = [
  {
    id: "SE",
    name: "SE",
    fullName: "Melengkapi Kalimat",
    rawScore: 12,
    totalAnswered: 20,
    correctAnswers: 12,
    incorrectAnswers: 8,
  },
  {
    id: "WA",
    name: "WA",
    fullName: "Pemilihan Kata",
    rawScore: 14,
    totalAnswered: 20,
    correctAnswers: 14,
    incorrectAnswers: 6,
  },
  {
    id: "AN",
    name: "AN",
    fullName: "Analogi",
    rawScore: 11,
    totalAnswered: 20,
    correctAnswers: 11,
    incorrectAnswers: 9,
  },
  {
    id: "GE",
    name: "GE",
    fullName: "Kesamaan",
    rawScore: 13,
    totalAnswered: 20,
    correctAnswers: 13,
    incorrectAnswers: 7,
  },
  {
    id: "RA",
    name: "RA",
    fullName: "Soal Hitungan",
    rawScore: 15,
    totalAnswered: 20,
    correctAnswers: 15,
    incorrectAnswers: 5,
  },
  {
    id: "ZR",
    name: "ZR",
    fullName: "Deret Angka",
    rawScore: 12,
    totalAnswered: 20,
    correctAnswers: 12,
    incorrectAnswers: 8,
  },
  {
    id: "FA",
    name: "FA",
    fullName: "Pemilihan Bentuk",
    rawScore: 10,
    totalAnswered: 20,
    correctAnswers: 10,
    incorrectAnswers: 10,
  },
  {
    id: "WU",
    name: "WU",
    fullName: "Soal Kubus",
    rawScore: 11,
    totalAnswered: 20,
    correctAnswers: 11,
    incorrectAnswers: 9,
  },
  {
    id: "ME",
    name: "ME",
    fullName: "Tugas Mengingat",
    rawScore: 13,
    totalAnswered: 20,
    correctAnswers: 13,
    incorrectAnswers: 7,
  },
];
export const IstResultWrapper = ({ slug }: { slug: string }) => {
  const { isLoading } = useInitIstResultCalculation(slug);
  if (isLoading) {
    return (
      <div className="flex min-h-[100vh] w-full items-center justify-center gap-x-4 text-xl">
        <LoaderSpinner />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4">
      <ParticipantInfoCard slug={slug} />
      <SummaryScoreCard iqScore={iqScore} radarData={radarData} />{" "}
      {/* From ISTResult */}
      <CriteriaInfoCard criteria={criteriaData} />
      {/* From ISTResultClassification */}
      <AnswerDetailsTable slug={slug} subtests={subtestAnswerDetails} />{" "}
      {/* From ISTResult */}
    </div>
  );
};
