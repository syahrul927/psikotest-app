import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

interface KraepelinResultStatisticProps {
  average: number;
  data: {
    name: string;
    answered: number;
  }[];
  isLoading?: boolean;
}

const chartConfig = {
  answered: {
    label: "Terjawab",
    color: "hsl(var(--primary))",
  },
  average: {
    label: "Rata-Rata",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;
export function KraepelinResultStatistic({
  data,
  average,
  isLoading,
}: KraepelinResultStatisticProps) {
  if (isLoading) return <Skeleton className="col-span-2 aspect-[3/1]" />;
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="leading-tight">Statistik</CardTitle>
        <CardDescription>Baris 1 - 40</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full md:h-[200px]">
          <LineChart
            data={Array.from({ length: 40 }).map((_, idx) => {
              const index: string = (idx + 1).toString();
              const exist = data.find((d) => d.name === index);
              if (exist) {
                return {
                  ...exist,
                  average,
                };
              }
              return {
                answered: 0,
                average,
                name: index,
              };
            })}
            accessibilityLayer
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <XAxis dataKey="name" tickLine={false} tickMargin={8} />
            <YAxis tickLine={false} tickMargin={8} />
            <Line
              type="monotone"
              strokeWidth={2}
              dataKey="average"
              stroke="var(--foreground)"
              strokeOpacity={0.2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="answered"
              dot={false}
              strokeWidth={2}
              stroke="var(--primary)"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
