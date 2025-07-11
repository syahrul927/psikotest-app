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
import { IstInvitationSummarySkeleton } from "./summary-skeleton";
import { CircleDashed } from "lucide-react";

interface IstInvitationSummaryProps {
  pending?: number;
  done?: number;
  awaitingReview?: number;
  onprogress?: number;
  total?: number;
  isLoading?: boolean;
}
export const IstInvitationSummary = ({
  pending = 0,
  awaitingReview = 0,
  done = 0,
  onprogress = 0,
  total = 0,
  isLoading = false,
}: IstInvitationSummaryProps) => {
  if (isLoading) {
    return <IstInvitationSummarySkeleton />;
  }
  return (
    <div className="grid gap-1 md:grid-cols-3 lg:grid-cols-5">
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
          <CardDescription>Awaiting Review</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {awaitingReview}
          </CardTitle>
          <CircleDashed className="text-muted-foreground absolute top-1.5 right-6" />
        </CardHeader>
        <CardFooter className="text-muted-foreground text-sm">
          Menunggu di Review
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
