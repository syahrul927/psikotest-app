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
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  score: {
    label: "Skor",
    color: "hsl(var(--foreground))",
  },
} satisfies ChartConfig;

interface ChartData {
  factor: string;
  score: number;
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="factor" />
            <PolarGrid />
            <Radar
              dataKey="score"
              fill="var(--color-score)"
              stroke="var(--color-score)"
              fillOpacity={0.5}
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
