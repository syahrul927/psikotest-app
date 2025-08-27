"use client";
import {
  IstInvitationForm,
  IstInvitationSummary,
  IstInvitationTable,
} from "@/features/ist-invitation";
import { useDeleteIstInvitation } from "@/hooks/api/ist-invitation/use-delete-ist-invitation";
import { useGetAllIstInvitation } from "@/hooks/api/ist-invitation/use-get-all-ist-invitation";
import { FormDialogProvider } from "@/hooks/use-dialog-form";

export default function IstInvitationPage() {
  const { data, isLoading, refetch } = useGetAllIstInvitation();
  const { mutateAsync: deleteIstInvitation } = useDeleteIstInvitation();
  const onDelete = async (id: string) => {
    await deleteIstInvitation(id);
    await refetch();
  };
  return (
    <FormDialogProvider>
      <IstInvitationSummary
        isLoading={isLoading}
        total={data?.total}
        done={data?.done}
        awaitingReview={data?.awaitingreview}
        pending={data?.pending}
        onprogress={data?.onprogress}
      />
      <IstInvitationTable
        isLoading={isLoading}
        data={
          data?.invitations?.map(
            ({ id, name, status, secretKey, testerProfile }) => ({
              id,
              name,
              status,
              profileName: testerProfile?.name,
              secretKey,
              onDelete,
            }),
          ) ?? []
        }
      />
      <IstInvitationForm onSuccessCallback={refetch} />
    </FormDialogProvider>
  );
}
