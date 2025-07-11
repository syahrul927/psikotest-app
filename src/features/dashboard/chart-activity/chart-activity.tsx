"use client";

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import { useGetCompletionTrends } from "@/hooks/api/dashboard/use-get-completion-trends";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  ist: {
    label: "IST",
    color: "hsl(var(--chart-1))",
  },
  kraepelin: {
    label: "Kraepelin",
    color: "hsl(var(--chart-2))",
  },
  total: {
    label: "Total",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function ChartActivity() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  const { data: trendsData, isLoading } = useGetCompletionTrends(days);

  if (isLoading) {
    return <ChartActivitySkeleton />;
  }

  if (!trendsData) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Tren Penyelesaian Tes</CardTitle>
          <CardDescription>
            Menampilkan penyelesaian tes IST dan Kraepelin dalam {days} hari terakhir
          </CardDescription>
        </div>
        {isMobile ? (
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select a value"
            >
              <SelectValue placeholder="30 hari terakhir" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                90 hari terakhir
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 hari terakhir
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 hari terakhir
              </SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => {
              if (value) setTimeRange(value);
            }}
            className="ml-auto"
          >
            <ToggleGroupItem value="90d" className="text-xs">
              90d
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="text-xs">
              30d
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="text-xs">
              7d
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={trendsData}>
            <defs>
              <linearGradient id="fillIst" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ist)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ist)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillKraepelin" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-kraepelin)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-kraepelin)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("id-ID", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("id-ID", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="kraepelin"
              type="natural"
              fill="url(#fillKraepelin)"
              stroke="var(--color-kraepelin)"
              stackId="a"
            />
            <Area
              dataKey="ist"
              type="natural"
              fill="url(#fillIst)"
              stroke="var(--color-ist)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function ChartActivitySkeleton() {
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <Skeleton className="h-[250px] w-full" />
      </CardContent>
    </Card>
  );
}