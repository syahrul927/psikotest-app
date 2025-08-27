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
import type { PapiKostickResultType } from "@/hooks/use-papi-kostick-result-context";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--foreground))",
  },
} satisfies ChartConfig;

interface Props {
  data: PapiKostickResultType[];
  isLoading?: boolean;
}
export const PapiKostickResultBarChart = ({ data, isLoading }: Props) => {
  if (isLoading) return <Skeleton className="h-48 w-full" />;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skor per Faktor Penilaian</CardTitle>
        <CardDescription>
          Diagram batang berikut menampilkan distribusi skor berdasarkan setiap
          faktor penilaian yang telah ditentukan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="factor"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="score" fill="var(--color-score)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
