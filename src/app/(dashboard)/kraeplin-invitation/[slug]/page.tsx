"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  KraeplinResultDetailAnswer,
  KraeplinResultInfoTester,
  KraeplinResultPoint,
  KraeplinResultStatistic,
  KraeplinResultSummary,
  KraeplinResultTableSummary,
  type KraeplinResultDetailAnswerItemProps,
} from "@/features/kraeplin-invitation";
import { useGetResultKraeplinInvitation } from "@/hooks/api/kraeplin-invitation/use-get-result-kraeplin-invitation";
import { plusKraepelin } from "@/lib/kraeplin-utils";
import { MessageCircleWarningIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import _ from "underscore";

const ResultInvitationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [details, setDetails] = useState<KraeplinResultDetailAnswerItemProps[]>(
    [],
  );
  const { data, isLoading, error, isError } =
    useGetResultKraeplinInvitation(slug);

  useEffect(() => {
    const result = data?.kraepelinResult?.KraepelinResultDetail ?? [];
    const grouped = _.groupBy(result, "xA");
    const filtered: KraeplinResultDetailAnswerItemProps[] = Object.keys(
      grouped,
    ).map((key) => {
      const item = grouped[key];
      if (item) {
        return {
          x: key,
          detail: item.map((det) => ({
            a: det.a,
            b: det.b,
            value: det.value,
            correct: plusKraepelin(det.a, det.b),
          })),
        };
      }
      return {
        x: 0,
        detail: [],
      };
    });
    setDetails(filtered);
  }, [data?.kraepelinResult?.KraepelinResultDetail]);
  useEffect(() => {
    if (isError) {
      toast.error("Invalid Invitation", {
        description: error?.message,
      });
      void router.back();
    }
  }, [isError]);
  return (
    <div className="grid grid-cols-2 gap-6">
      <Alert className="bg-primary text-primary-foreground col-span-2">
        <MessageCircleWarningIcon className="h-4 w-4" color="white" />
        <AlertTitle>Perhatian</AlertTitle>
        <AlertDescription className="text-muted">
          Data yang disajikan merupakan data yang sudah di filter hanya beberapa
          baris yang ditampilkan. Baris yang ditampilkan diantaranya{" "}
          <span className="inline font-bold italic">6-10, 21-25, 36-40</span>
        </AlertDescription>
      </Alert>
      <KraeplinResultInfoTester
        isLoading={isLoading}
        address={data?.informationTester?.address ?? "-"}
        name={data?.informationTester?.name ?? "-"}
        educationId={data?.informationTester?.educationId ?? "-"}
        phone={data?.informationTester?.phone ?? "-"}
        educationDescription={
          data?.informationTester?.educationDescription ?? "-"
        }
      />
      <KraeplinResultSummary
        deciel={data?.kraepelinResult?.deciel ?? 0}
        highest={data?.kraepelinResult?.highestJanker ?? 0}
        lowest={data?.kraepelinResult?.lowestJanker ?? 0}
        totalAnswered={data?.kraepelinResult?.totalAnswered ?? 0}
        wrongAnswered={data?.kraepelinResult?.totalIncorrect ?? 0}
        isLoading={isLoading}
      />
      <KraeplinResultPoint
        educationId={data?.informationTester?.educationId ?? ""}
        isLoading={isLoading}
        hanker={data?.kraepelinResult?.hanker ?? 0}
        janker={data?.kraepelinResult?.janker ?? 0}
        tianker={data?.kraepelinResult?.tianker ?? 0}
        panker={data?.kraepelinResult?.panker ?? 0}
      />

      <KraeplinResultStatistic
        data={
          data?.kraepelinResult?.KraepelinResultSummary.map((item) => ({
            answered: item.answered,
            name: item.x.toString(),
          })) ?? []
        }
        avarage={data?.kraepelinResult?.panker ?? 0}
      />
      <KraeplinResultTableSummary
        isLoading={isLoading}
        data={
          data?.kraepelinResult?.KraepelinResultSummary.map((item) => ({
            answered: item.answered,
            correct: item.correct ?? 0,
            row: item.x,
            wrong: item.wrong ?? 0,
          })) ?? []
        }
      />
      <KraeplinResultDetailAnswer data={details} />
    </div>
  );
};
export default ResultInvitationPage;
