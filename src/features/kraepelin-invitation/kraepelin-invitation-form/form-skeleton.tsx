import { Skeleton } from "@/components/ui/skeleton";
import { Fragment } from "react";

export const KraepelinInvitationFormSkeleton = () => {
  return (
    <Fragment>
      <div className="grid gap-4 py-4">
        <div className="flex flex-col space-y-8">
          <div>
            <Skeleton className="mb-2 h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div>
            <Skeleton className="mb-2 h-4 w-[60px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Skeleton className="h-4 w-[60px]" />
      </div>
    </Fragment>
  );
};
