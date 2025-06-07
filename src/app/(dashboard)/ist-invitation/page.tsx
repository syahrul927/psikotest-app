"use client";
import { DevelopmentFlag } from "@/components/layout/development-flag";
import {
  IstInvFormDialogProvider,
  IstInvitationForm,
  IstInvitationSummary,
  IstInvitationTable,
} from "@/features/ist-invitation";
import { useDeleteIstInvitation } from "@/hooks/api/ist-invitation/use-delete-ist-invitation";
import { useGetAllIstInvitation } from "@/hooks/api/ist-invitation/use-get-all-ist-invitation";
import { notFound } from "next/navigation";

export default function IstInvitationPage() {
  const { data, isLoading, refetch } = useGetAllIstInvitation();
  const { mutateAsync: deleteIstInvitation } = useDeleteIstInvitation();
  const onDelete = async (id: string) => {
    await deleteIstInvitation(id);
  };
  if (!data && !isLoading) {
    return notFound();
  }
  return (
    <>
      <DevelopmentFlag />
      <IstInvFormDialogProvider>
        <IstInvitationSummary
          isLoading={isLoading}
          total={data?.total}
          done={data?.done}
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
      </IstInvFormDialogProvider>
    </>
  );
}
