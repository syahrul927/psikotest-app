"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProfileIstReview } from "@/hooks/api/ist-review/use-get-profile-ist-review";
import { localDate } from "@/lib/date-utils";
import { Calendar, OctagonAlert, Smartphone, User } from "lucide-react";

interface IstReviewInfoCardProps {
  invitationId: string;
}
export const IstReviewInfoCard = (props: IstReviewInfoCardProps) => {
  const { data, isLoading } = useGetProfileIstReview(props.invitationId);
  if (isLoading) {
    return <Skeleton className="h-24 w-full" />;
  }
  if (!data) {
    return (
      <Card className="bg-destructive border-destructive text-destructive-foreground">
        <CardContent className="p-4">
          <OctagonAlert className="h-4 w-4" />
          <span>Something went wrong</span>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="text-muted-foreground h-4 w-4" />
              <span className="font-medium">{data.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground text-sm">
                {data.phone}
              </span>
            </div>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Calendar className="text-muted-foreground h-4 w-4" />
            {localDate(data.startAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
