"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";

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
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  percent: {
    label: "Persentase",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

interface ChartData {
  aspect: string;
  percent: number;
  score: number;
  category: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload?: ChartData;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload?.length && label) {
    const percent = payload[0]?.value;
    const entry = payload[0]?.payload;

    return (
      <div className="bg-background border-border min-w-[200px] rounded-lg border p-3 shadow-lg">
        <div className="text-foreground mb-2 font-semibold">Aspek: {label}</div>
        <div className="space-y-1">
          <div className="text-sm">
            <span className="text-muted-foreground font-medium">
              Persentase:
            </span>
            <span className="text-foreground ml-1 font-semibold">
              {percent?.toFixed(2)}%
            </span>
          </div>
          {entry && (
            <>
              <div className="text-sm">
                <span className="text-muted-foreground font-medium">Skor:</span>
                <span className="text-foreground ml-1 font-semibold">
                  {entry.score}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground font-medium">
                  Kategori:
                </span>
                <span className="text-foreground ml-1">{entry.category}</span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
  return null;
}

interface Props {
  chartData: ChartData[];
  isLoading?: boolean;
}

export function WwqRadarChart({ chartData, isLoading }: Props) {
  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  // Percentages are share-of-total values, scale the radius axis to the biggest one
  const maxPercent = chartData.reduce(
    (max, item) => Math.max(max, item.percent),
    0,
  );
  const radiusDomainMax = Math.max(10, Math.ceil(maxPercent / 10) * 10);

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Skor Penilaian</CardTitle>
        <CardDescription>
          Persentase skor dihitung berdasarkan hasil jawaban peserta
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-96"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<CustomTooltip />} />
            <PolarAngleAxis dataKey="aspect" />
            <PolarGrid />
            <PolarRadiusAxis
              angle={90}
              domain={[0, radiusDomainMax]}
              tickCount={5}
              tick={false}
            />
            <Radar
              dataKey="percent"
              fill="var(--color-percent)"
              stroke="var(--color-percent)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
