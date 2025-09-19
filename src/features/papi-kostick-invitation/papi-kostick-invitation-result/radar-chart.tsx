"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { MasterCategoryScale, type Scale } from "@/lib/papi-kostick-utils";

const chartConfig = {
  score: {
    label: "Skor",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

interface ChartData {
  factor: string;
  score: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload?.length && label) {
    const score = payload[0]?.value;
    const factor = label as Scale;
    const factorInfo = MasterCategoryScale[factor];

    return (
      <div className="bg-background border-border min-w-[200px] rounded-lg border p-3 shadow-lg">
        <div className="text-foreground mb-2 font-semibold">
          Faktor: {factor}
        </div>
        <div className="space-y-1">
          <div className="text-sm">
            <span className="text-muted-foreground font-medium">Skor:</span>
            <span className="text-foreground ml-1 font-semibold">{score}</span>
          </div>
          {factorInfo && (
            <>
              <div className="text-sm">
                <span className="text-muted-foreground font-medium">
                  Kategori:
                </span>
                <span className="text-foreground ml-1">
                  {factorInfo.category}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground font-medium">
                  Aspek:
                </span>
                <span className="text-foreground ml-1">
                  {factorInfo.aspect}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
  return null;
}

interface ScaleInfoProps {
  factor: Scale;
  score: number;
}

function ScaleInfo({ factor, score }: ScaleInfoProps) {
  const factorInfo = MasterCategoryScale[factor];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="hover:bg-muted/50 flex cursor-help items-center justify-between rounded-md border p-2 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{factor}</span>
              <span className="text-muted-foreground text-xs">
                {factorInfo?.category}
              </span>
            </div>
            <span className="text-sm font-medium">{score}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">
              {factor} - {factorInfo?.category}
            </p>
            <p className="text-sm">{factorInfo?.aspect}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ScaleInfoGrid({ chartData }: { chartData: ChartData[] }) {
  const scaleEntries = Object.entries(MasterCategoryScale) as [
    Scale,
    (typeof MasterCategoryScale)[Scale],
  ][];

  // Create a map of scores by factor
  const scoreMap = new Map<Scale, number>();
  chartData.forEach((item) => {
    scoreMap.set(item.factor as Scale, item.score);
  });

  return (
    <div className="mt-6">
      <h4 className="mb-3 text-center text-sm font-semibold">
        Informasi Skor per Faktor
      </h4>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {scaleEntries.map(([factor, info]) => (
          <ScaleInfo
            key={factor}
            factor={factor}
            score={scoreMap.get(factor) || 0}
          />
        ))}
      </div>
    </div>
  );
}

interface Props {
  chartData: ChartData[];
  isLoading?: boolean;
}
export function PapiKostickRadarChart({ chartData, isLoading }: Props) {
  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Skor Penilaian</CardTitle>
        <CardDescription>
          Skor dihitung berdasarkan hasil jawaban peserta
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-96"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<CustomTooltip />} />
            <PolarAngleAxis dataKey="factor" />
            <PolarGrid />
            <Radar
              dataKey="score"
              fill="var(--color-score)"
              stroke="var(--color-score)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
        {/* <ScaleInfoGrid chartData={chartData} /> */}
      </CardContent>
    </Card>
  );
}
