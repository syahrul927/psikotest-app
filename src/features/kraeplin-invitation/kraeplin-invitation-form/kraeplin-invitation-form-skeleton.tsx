import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export const KraeplinInvitationFormSkeleton = () => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Invitation Kraeplin</DialogTitle>
      </DialogHeader>
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

      <DialogFooter>
        <Skeleton className="h-4 w-[60px]" />
      </DialogFooter>
    </DialogContent>
  );
};
