import { Skeleton } from "@/components/ui/skeleton";

export const DataTableSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex w-full justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-32" />
      </div>
      <Skeleton className="h-64 w-full" />
      <div className="flex w-full justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-64" />
      </div>
    </div>
  );
};
