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
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";

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
    color: "var(--primary)",
  },
  average: {
    label: "Rata-Rata",
    color: "var(--muted-foreground)",
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
              left: 15,
              right: 15,
              top: 15,
              bottom: 15,
            }}
          >
            <XAxis dataKey="name" tickLine={true} tickMargin={8} />
            <YAxis tickLine={true} tickMargin={8} />
            <Legend />
            <CartesianGrid
              strokeDasharray={3}
              strokeWidth={1.5}
              stroke="var(--foreground)"
              strokeOpacity={0.1}
            />
            <Line
              type="monotone"
              name="Rata-Rata"
              strokeWidth={1}
              dataKey="average"
              stroke="var(--color-average)"
              dot={true}
            />
            <Line
              type="natural"
              name="Terjawab"
              dataKey="answered"
              dot={true}
              strokeWidth={2}
              stroke="var(--color-answered)"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
