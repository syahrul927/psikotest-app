"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWwqResult } from "@/hooks/use-wwq-result-context";
import { cn } from "@/lib/utils";
import { type WwqCategory } from "@/lib/wwq-utils";
import { CheckCircle2 } from "lucide-react";
import { WwqCategoryBadge } from "./category-badge";

// "Gambaran Diagnosis" legend from docs/WWQ.xlsx (rows 92-94): the overall
// value (Total Keseluruhan = totalWeighted / 8) and each aspect's weighted
// score are classified by the same thresholds.
const DIAGNOSIS_BANDS: { range: string; category: WwqCategory }[] = [
  { range: "< 120", category: "Normal" },
  { range: "120 - 180", category: "Kecendrungan Pathologis" },
  { range: "> 180", category: "Gangguan Pathologis" },
];

export function WwqDiagnosisCard() {
  const { overall, isLoading } = useWwqResult();

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }
  if (!overall) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Gambaran Diagnosis</CardTitle>
        <CardDescription>
          Kriteria penilaian nilai (berlaku untuk nilai keseluruhan maupun
          tertimbang tiap aspek)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Nilai Keseluruhan
          </span>
          <WwqCategoryBadge category={overall.category} />
        </div>
        <p className="text-sm">
          Dengan nilai keseluruhan{" "}
          <span className="font-mono font-bold">
            {overall.overallValue.toFixed(2)}
          </span>
          , kondisi peserta berada pada kategori{" "}
          <span className="font-semibold">{overall.category}</span>.
        </p>
        <ul className="divide-y rounded-lg border">
          {DIAGNOSIS_BANDS.map((band) => {
            const active = band.category === overall.category;
            return (
              <li
                key={band.category}
                className={cn(
                  "flex items-center justify-between gap-2 px-4 py-3",
                  active && "bg-muted",
                )}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  {active && (
                    <CheckCircle2 className="text-primary h-4 w-4" />
                  )}
                  <span
                    className={cn(
                      "font-mono",
                      !active && "text-muted-foreground",
                    )}
                  >
                    {band.range}
                  </span>
                </span>
                <WwqCategoryBadge category={band.category} />
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
