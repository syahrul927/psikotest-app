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
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";

interface RadarDataItem {
  subtest: string;
  score: number;
  fullName: string;
}

interface SummaryScoreCardProps {
  iqScore: number;
  radarData: RadarDataItem[];
}

const chartConfig = {
  score: {
    label: "Score",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function SummaryScoreCard({
  iqScore,
  radarData,
}: SummaryScoreCardProps) {
  return (
    <Card className="row-span-2">
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-xl font-medium">Summary Score</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* IQ Score Summary */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">160</div>
            <div className="text-muted-foreground text-sm">IQ Score</div>
          </div>
          <div className="text-right">
            <Badge variant={"positive"}>Very Superior</Badge>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="mb-6">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-96"
          >
            <RadarChart data={radarData}>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    const data = payload[0]?.payload as RadarDataItem | undefined;
                    return (
                      <div className="bg-background rounded-lg border p-2 shadow-md">
                        <div className="grid gap-2">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-[0.70rem] uppercase">
                              {data?.subtest}
                            </span>
                            <span className="text-muted-foreground font-bold">
                              {data?.fullName}
                            </span>
                            <span className="font-bold">
                              Score: {data?.score}
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

        {/* Top Performing Areas */}
        <div>
          <h4 className="mb-2 text-sm font-medium">
            Raw Score - Standard Score
          </h4>
          <div className="grid grid-cols-3 gap-1">
            {radarData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-md border p-2"
              >
                <div>
                  <div className="font-medium">{item.subtest}</div>
                  <div className="text-muted-foreground text-xs">
                    Score: {item.score}/20
                  </div>
                </div>
                <span className="mr-3">{Math.floor((item.score * 2) / 3)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="text-muted-foreground text-sm">
          <span className="font-medium">Test Date:</span> June 10, 2025
        </div>
        <div className="text-muted-foreground text-sm">
          <span className="font-medium">Validity:</span> High
        </div>
      </CardFooter>
    </Card>
  );
}
