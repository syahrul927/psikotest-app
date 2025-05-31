import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircledIcon,
  CircleIcon,
  InfoCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { KraepelinInvitationSummarySkeleton } from "./summary-skeleton";

interface KraepelinInvitationSummaryProps {
  pending?: number;
  done?: number;
  onprogress?: number;
  total?: number;
  isLoading?: boolean;
}
export const KraepelinInvitationSummary = ({
  pending = 0,
  done = 0,
  onprogress = 0,
  total = 0,
  isLoading = false,
}: KraepelinInvitationSummaryProps) => {
  if (isLoading) {
    return <KraepelinInvitationSummarySkeleton />;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="">
        <CardHeader className="relative">
          <CardDescription>Pending</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pending}
          </CardTitle>
          <CircleIcon className="text-muted-foreground absolute top-1.5 right-6" />
        </CardHeader>
        <CardFooter className="text-muted-foreground text-sm">
          Menunggu dikerjakan
        </CardFooter>
      </Card>

      <Card className="">
        <CardHeader className="relative">
          <CardDescription>On Progress</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {onprogress}
          </CardTitle>
          <StopwatchIcon className="text-muted-foreground absolute top-1.5 right-6" />
        </CardHeader>
        <CardFooter className="text-muted-foreground text-sm">
          Sedang dikerjakan
        </CardFooter>
      </Card>

      <Card className="">
        <CardHeader className="relative">
          <CardDescription>Done</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {done}
          </CardTitle>
          <CheckCircledIcon className="text-muted-foreground absolute top-1.5 right-6" />
        </CardHeader>
        <CardFooter className="text-muted-foreground text-sm">
          Selesai dikerjakan
        </CardFooter>
      </Card>

      <Card className="">
        <CardHeader className="relative">
          <CardDescription>Total</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {total}
          </CardTitle>
          <InfoCircledIcon className="text-muted-foreground absolute top-1.5 right-6" />
        </CardHeader>
        <CardFooter className="text-muted-foreground text-sm">
          Total keseluruhan
        </CardFooter>
      </Card>
    </div>
  );
};
