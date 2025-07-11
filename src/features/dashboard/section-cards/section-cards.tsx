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
          <div className="line-clamp-1 flex gap-2 font-medium">
            IST: {metrics.breakdown.ist.pending + metrics.breakdown.ist.onProgress} | Kraepelin: {metrics.breakdown.kraepelin.active}
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
          <div className="line-clamp-1 flex gap-2 font-medium">
            IST: {metrics.breakdown.ist.awaitingReview} | Kraepelin: {metrics.breakdown.kraepelin.awaitingReview}
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
