"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useIstResultDetailInfo } from "@/hooks/use-ist-result-detail";
import { localDate } from "@/lib/date-utils";
import {
  categorizeIq,
  classificationCriteriaByIQ,
  getBadgeVariant,
} from "@/lib/ist-utils";
import { StandardSchemaV1Error } from "@trpc/server";
import { Fullscreen } from "lucide-react";
import { useMemo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import type { map } from "underscore";

interface RadarDataItem {
  subtest: string;
  score: number;
  fullName: string;
}

interface SummaryScoreCardProps {
  slug: string;
}

const chartConfig = {
  score: {
    label: "Score",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function SummaryScoreCard({ slug }: SummaryScoreCardProps) {
  const { data, isLoading, summary } = useIstResultDetailInfo();
  const radarData: RadarDataItem[] = useMemo(() => {
    return data.map((d) => ({
      subtest: d.name,
      score: d.rawScore ?? 0,
      fullName: d.fullName,
    }));
  }, [data]);
  if (isLoading) {
    return <Skeleton className="row-span-2 h-96 w-full" />;
  }
  return (
    <Card className="row-span-2">
      <CardHeader className="border-b">
        <CardTitle>IQ Score</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* IQ Score Summary */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{summary?.totalIQ}</div>
            <div className="text-muted-foreground text-sm">IQ Score</div>
          </div>
          <div className="text-right">
            <Badge variant={getBadgeVariant(categorizeIq(summary?.totalIQ))}>
              {categorizeIq(summary?.totalIQ)}
            </Badge>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="mb-6">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-full"
          >
            <RadarChart data={radarData}>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    const data = payload[0]?.payload as RadarDataItem;
                    return (
                      <div className="bg-background rounded-lg border p-2 shadow-md">
                        <div className="grid gap-2">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-[0.70rem] uppercase">
                              {data.subtest}
                            </span>
                            <span className="text-muted-foreground font-bold">
                              {data.fullName}
                            </span>
                            <span className="font-bold">
                              Score: {data.score}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <PolarGrid />
              <PolarAngleAxis dataKey="subtest" />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 20]}
                tick={false}
                tickCount={5}
              />
              <Radar
                dataKey="score"
                fill="var(--color-score)"
                fillOpacity={0.3}
                stroke="var(--color-score)"
                strokeWidth={2}
              />
            </RadarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
