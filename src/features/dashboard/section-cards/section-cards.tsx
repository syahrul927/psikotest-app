import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardMetrics } from "@/hooks/api/dashboard/use-get-dashboard-metrics";
import { ArrowBottomRightIcon, ArrowTopRightIcon, ClockIcon, CheckIcon, ExclamationTriangleIcon, BarChartIcon } from "@radix-ui/react-icons";

export function SectionCards() {
  const { data: metrics, isLoading } = useGetDashboardMetrics();

  if (isLoading) {
    return <SectionCardsSkeleton />;
  }

  if (!metrics) {
    return null;
  }

  const completionRate = metrics.completionRate || 0;
  const isCompletionRateGood = completionRate >= 70;

  const TestTypeBadge = ({ type, count, colorVariant }: { 
    type: string; 
    count: number; 
    colorVariant: "violet" | "blue" | "emerald" 
  }) => {
    const colorClasses = {
      violet: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
      blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100", 
      emerald: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
    };

    const grayClasses = "bg-gray-50 text-gray-400 border-gray-200 opacity-60";

    return (
      <Badge 
        variant="outline" 
        className={`select-none px-2.5 py-0.5 text-xs font-medium ${
          count > 0 ? colorClasses[colorVariant] : grayClasses
        }`}
        title={count === 0 ? `Tidak ada tes ${type}` : undefined}
      >
        <span className="mr-1 font-semibold">{type}</span>
        <span className="font-bold">{count}</span>
      </Badge>
    );
  };

  const activeCounts = {
    ist: metrics.breakdown.ist.pending + metrics.breakdown.ist.onProgress,
    papiKostick: metrics.breakdown.papiKostick.pending + metrics.breakdown.papiKostick.onProgress,
    kraepelin: metrics.breakdown.kraepelin.active
  };

  const reviewCounts = {
    ist: metrics.breakdown.ist.awaitingReview,
    papiKostick: metrics.breakdown.papiKostick.awaitingReview,
    kraepelin: metrics.breakdown.kraepelin.awaitingReview
  };

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Tes Aktif</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {metrics.totalActiveTests}
            </CardTitle>
            <CardAction>
              <Badge variant="positiveBlue">
                <ClockIcon />
                Aktif
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex flex-wrap items-center gap-1.5 font-medium">
              <TestTypeBadge type="IST" count={activeCounts.ist} colorVariant="violet" />
              <TestTypeBadge type="PapiKostick" count={activeCounts.papiKostick} colorVariant="blue" />
              <TestTypeBadge type="Kraepelin" count={activeCounts.kraepelin} colorVariant="emerald" />
            </div>
            <div className="text-muted-foreground">
              Tes yang sedang berjalan atau menunggu
            </div>
          </CardFooter>
        </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Menunggu Review</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.testsAwaitingReview}
          </CardTitle>
          <CardAction>
            <Badge variant={metrics.testsAwaitingReview > 0 ? "destructive" : "positive"}>
              <ExclamationTriangleIcon />
              {metrics.testsAwaitingReview > 0 ? "Perlu Aksi" : "Clear"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex flex-wrap items-center gap-1.5 font-medium">
            <TestTypeBadge type="IST" count={reviewCounts.ist} colorVariant="violet" />
            <TestTypeBadge type="PapiKostick" count={reviewCounts.papiKostick} colorVariant="blue" />
            <TestTypeBadge type="Kraepelin" count={reviewCounts.kraepelin} colorVariant="emerald" />
          </div>
          <div className="text-muted-foreground">
            Tes yang memerlukan review admin
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Selesai Bulan Ini</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.completedThisMonth}
          </CardTitle>
          <CardAction>
            <Badge variant="positive">
              <CheckIcon />
              Selesai
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Produktivitas bulan ini <BarChartIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total tes yang diselesaikan
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tingkat Penyelesaian</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {completionRate.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge variant={isCompletionRateGood ? "positive" : "destructive"}>
              {isCompletionRateGood ? <ArrowTopRightIcon /> : <ArrowBottomRightIcon />}
              {isCompletionRateGood ? "Baik" : "Perlu Perhatian"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isCompletionRateGood ? "Performa sistem baik" : "Banyak tes belum selesai"}
          </div>
          <div className="text-muted-foreground">
            Efisiensi penyelesaian tes
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function SectionCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="@container/card">
          <CardHeader>
            <CardDescription>
              <Skeleton className="h-4 w-24" />
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <Skeleton className="h-8 w-16" />
            </CardTitle>
            <CardAction>
              <Skeleton className="h-6 w-16" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
