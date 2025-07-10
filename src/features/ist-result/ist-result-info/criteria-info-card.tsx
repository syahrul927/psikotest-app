"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetSummaryScore } from "@/hooks/api/ist-result/use-get-summary-score";
import { Skeleton } from "@/components/ui/skeleton";
import {
  categorizeIq,
  classificationCriteriaByIQ,
  getBadgeVariant,
} from "@/lib/ist-utils";
import { useIstResultDetailInfo } from "@/hooks/use-ist-result-detail";

interface CriteriaItem {
  name: string;
  totalIQ: number;
  classification: string;
}

interface CriteriaInfoProps {
  criteria: CriteriaItem[];
}

export function CriteriaInfoCard({ slug }: { slug: string }) {
  const { summary: data, isLoading } = useIstResultDetailInfo();
  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Hasil Kriteria</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left font-medium">Kriteria</th>
              <th className="py-2 text-center font-medium">Total IQ</th>
              <th className="py-2 text-center font-medium">Klasifikasi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-muted-foreground py-2 font-medium">
                Fleksibilitas Berfikir
              </td>
              <td className="py-2 text-center font-medium">
                {data?.thinkingFlexibility}
              </td>
              <td className="py-2 text-center">
                <Badge
                  variant={getBadgeVariant(
                    classificationCriteriaByIQ(data?.thinkingFlexibility),
                  )}
                >
                  {classificationCriteriaByIQ(data?.thinkingFlexibility)}
                </Badge>
              </td>
            </tr>
            <tr>
              <td className="text-muted-foreground py-2 font-medium">
                Fleksibilitas Perhatian
              </td>
              <td className="py-2 text-center font-medium">
                {data?.attentionFlexibility}
              </td>
              <td className="py-2 text-center">
                <Badge
                  variant={getBadgeVariant(
                    classificationCriteriaByIQ(data?.attentionFlexibility),
                  )}
                >
                  {classificationCriteriaByIQ(data?.attentionFlexibility)}
                </Badge>
              </td>
            </tr>
            <tr>
              <td className="text-muted-foreground py-2 font-medium">
                Daya Nalar/Logika
              </td>
              <td className="py-2 text-center font-medium">
                {data?.reasoningLogic}
              </td>
              <td className="py-2 text-center">
                <Badge
                  variant={getBadgeVariant(
                    classificationCriteriaByIQ(data?.reasoningLogic),
                  )}
                >
                  {classificationCriteriaByIQ(data?.reasoningLogic)}
                </Badge>
              </td>
            </tr>
            <tr>
              <td className="text-muted-foreground py-2 font-medium">
                Daya ingat & Konsentrasi
              </td>
              <td className="py-2 text-center font-medium">
                {data?.memoryAndConcentration}
              </td>
              <td className="py-2 text-center">
                <Badge
                  variant={getBadgeVariant(
                    classificationCriteriaByIQ(data?.memoryAndConcentration),
                  )}
                >
                  {classificationCriteriaByIQ(data?.memoryAndConcentration)}
                </Badge>
              </td>
            </tr>
            <tr>
              <td className="text-muted-foreground py-2 font-medium">
                Analisa Sintesa
              </td>
              <td className="py-2 text-center font-medium">
                {data?.analyticalSynthesis}
              </td>
              <td className="py-2 text-center">
                <Badge
                  variant={getBadgeVariant(
                    classificationCriteriaByIQ(data?.analyticalSynthesis),
                  )}
                >
                  {classificationCriteriaByIQ(data?.analyticalSynthesis)}
                </Badge>
              </td>
            </tr>
            <tr>
              <td className="text-muted-foreground py-2 font-medium">
                Numerik
              </td>
              <td className="py-2 text-center font-medium">
                {data?.numericalAbility}
              </td>
              <td className="py-2 text-center">
                <Badge
                  variant={getBadgeVariant(
                    classificationCriteriaByIQ(data?.numericalAbility),
                  )}
                >
                  {classificationCriteriaByIQ(data?.numericalAbility)}
                </Badge>
              </td>
            </tr>
            <tr>
              <td className="text-muted-foreground py-2 font-medium">
                Total IQ
              </td>
              <td className="py-2 text-center font-medium">{data?.totalIQ}</td>
              <td className="py-2 text-center">
                <Badge variant={getBadgeVariant(categorizeIq(data?.totalIQ))}>
                  {categorizeIq(data?.totalIQ)}
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
