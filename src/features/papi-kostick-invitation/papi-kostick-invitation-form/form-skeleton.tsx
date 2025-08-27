import { Skeleton } from "@/components/ui/skeleton";

export function PapiKostickInvitationFormSkeleton() {
  return (
    <form className="space-y-4">
      <div className="grid gap-2">
        <Skeleton className="h-4 w-[104px] max-w-full" />
        <Skeleton className="h-10 w-[264px] max-w-full" />
      </div>
      <div className="grid gap-2">
        <Skeleton className="h-4 w-[104px] max-w-full" />
        <Skeleton className="h-10 w-[264px] max-w-full" />
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <div className="[&amp;_svg:not([className*='size-'])]:size-4 [&amp;_svg]:shrink-0 focus-visible:border-ring aria-invalid:border-destructive dark:border-input has-[&gt;svg]:px-3 inline-flex h-9 shrink-0 items-center justify-center gap-2 border px-4 py-2 shadow-xs">
          <Skeleton className="w-[40px] max-w-full" />
        </div>
        <div className="[&amp;_svg:not([className*='size-'])]:size-4 [&amp;_svg]:shrink-0 focus-visible:border-ring aria-invalid:border-destructive has-[&gt;svg]:px-3 inline-flex h-9 shrink-0 items-center justify-center gap-2 px-4 py-2 shadow-xs">
          <Skeleton className="w-[64px] max-w-full" />
        </div>
      </div>
    </form>
  );
}
