"use client";
import {
  WwqInvitationForm,
  WwqInvitationSummary,
  WwqInvitationTable,
} from "@/features/wwq-invitation";
import { useDeleteWwqInvitation } from "@/hooks/api/wwq-invitation/use-delete-wwq-invitation";
import { useGetAllWwqInvitation } from "@/hooks/api/wwq-invitation/use-get-all-wwq-invitation";
import { FormDialogProvider } from "@/hooks/use-dialog-form";

export default function WwqInvitationPage() {
  const { data, isLoading, refetch } = useGetAllWwqInvitation();
  const onSuccessCallback = () => {
    void refetch();
  };
  const deleteMutation = useDeleteWwqInvitation({ onSuccessCallback });

  const invitations = data?.items ?? [];
  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  };
  return (
    <FormDialogProvider>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Psikotest WWQ</h1>
        </div>

        <div className="flex flex-col gap-6">
          <WwqInvitationSummary />
          <WwqInvitationTable
            data={invitations.map(
              ({ id, name, status, secretKey, testerProfile }) => ({
                id,
                name,
                status,
                startAt: testerProfile?.createdAt,
                secretKey,
                profileName: testerProfile?.name,
                onDelete: handleDelete,
              }),
            )}
            isLoading={isLoading}
          />
          <WwqInvitationForm onSuccessCallback={refetch} />
        </div>
      </div>
    </FormDialogProvider>
  );
}
