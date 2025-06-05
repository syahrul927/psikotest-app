import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const LoaderSpinner = ({
  className,
  ...props
}: React.ComponentProps<"svg">) => {
  return <Loader2 className={cn("animate-spin", className)} {...props} />;
};
