"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllPapiKostickInvitation } from "@/hooks/api/papi-kostick-invitation/use-get-all-papi-kostick-invitation";
import { Skeleton } from "@/components/ui/skeleton";

export function PapiKostickInvitationSummary() {
  const { data, isLoading } = useGetAllPapiKostickInvitation();

  if (isLoading) {
    return <PapiKostickInvitationSummarySkeleton />;
  }

  const invitations = data?.items || [];
  const totalInvitations = invitations.length;
  const pendingInvitations = invitations.filter(
    (inv) => inv.status === "PENDING",
  ).length;
  const inProgressInvitations = invitations.filter(
    (inv) => inv.status === "ONPROGRESS",
  ).length;
  const completedInvitations = invitations.filter(
    (inv) => inv.status === "DONE",
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Invitations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInvitations}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingInvitations}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressInvitations}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedInvitations}</div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PapiKostickInvitationSummarySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[100px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[40px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
