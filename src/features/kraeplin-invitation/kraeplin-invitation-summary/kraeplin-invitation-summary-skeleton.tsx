import { Skeleton } from "@/components/ui/skeleton";

export const KraeplinInvitationSummarySkeleton = () => {
  return (
    <div className="grid min-h-36 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
    </div>
  );
};
