"use client";

import {
  KraepelinInvitationForm,
  KraepelinInvitationSummary,
  KraepelinInvitationTable,
} from "@/features/kraepelin-invitation";
import { useDeleteKraepelinInvitation } from "@/hooks/api/kraepelin-invitation/use-delete-kraepelin-invitation";
import { useGetAllKraepelinInvitation } from "@/hooks/api/kraepelin-invitation/use-get-all-kraepelin-invitation";
import { FormDialogProvider } from "@/hooks/use-dialog-form";

export default function KraepelinInvitationPage() {
  const { data, isLoading, refetch } = useGetAllKraepelinInvitation();

  const { mutate: deleteKraepelin } = useDeleteKraepelinInvitation(refetch);

  const onDelete = (id: string) => {
    void deleteKraepelin(id);
  };
  return (
    <FormDialogProvider>
      <KraepelinInvitationSummary
        isLoading={isLoading}
        total={data?.total}
        done={data?.done}
        pending={data?.pending}
        onprogress={data?.onprogress}
      />
      <KraepelinInvitationTable
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
      <KraepelinInvitationForm onSuccessCallback={refetch} />
    </FormDialogProvider>
  );
}
