"use client";

import {
  KraeplinInvFormDialogProvider,
  KraeplinInvitationForm,
  KraeplinInvitationSummary,
  KraeplinInvitationTable,
} from "@/features/kraeplin-invitation";
import { useDeleteKraeplinInvitation } from "@/hooks/api/kraeplin-invitation/use-delete-kraeplin-invitation";
import { useGetAllKraeplinInvitation } from "@/hooks/api/kraeplin-invitation/use-get-all-kraeplin-invitation";
import { notFound } from "next/navigation";

export default function KraeplinInvitationPage() {
  const { data, isLoading, refetch } = useGetAllKraeplinInvitation();
  const { mutateAsync: deleteKraeplin } = useDeleteKraeplinInvitation();
  const onDelete = async (id: string) => {
    await deleteKraeplin(id);
  };
  if (!data && !isLoading) {
    return notFound();
  }
  return (
    <KraeplinInvFormDialogProvider>
      <KraeplinInvitationSummary
        isLoading={isLoading}
        total={data?.total}
        done={data?.done}
        pending={data?.pending}
        onprogress={data?.onprogress}
      />
      <KraeplinInvitationTable
        isLoading={isLoading}
        data={
          data?.invitations?.map(
            ({ id, name, status, secretKey, testerProfile, startAt }) => ({
              id,
              name,
              startAt,
              status,
              profileName: testerProfile?.name,
              secretKey,
              onDelete,
            }),
          ) ?? []
        }
      />
      <KraeplinInvitationForm onSuccessCallback={refetch} />
    </KraeplinInvFormDialogProvider>
  );
}
