"use client";
import {
  PapiKostickInvitationForm,
  PapiKostickInvitationSummary,
  PapiKostickInvitationTable,
} from "@/features/papi-kostick-invitation";
import { useDeletePapiKostickInvitation } from "@/hooks/api/papi-kostick-invitation/use-delete-papi-kostick-invitation";
import { useGetAllPapiKostickInvitation } from "@/hooks/api/papi-kostick-invitation/use-get-all-papi-kostick-invitation";
import { FormDialogProvider } from "@/hooks/use-dialog-form";

export default function PapiKostickInvitationPage() {
  const { data, isLoading, refetch } = useGetAllPapiKostickInvitation();
  const deleteMutation = useDeletePapiKostickInvitation();

  const invitations = data?.items ?? [];
  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  };
  return (
    <FormDialogProvider>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">
            Psikotest Papi Kostik
          </h1>
        </div>

        <div className="flex flex-col gap-6">
          <PapiKostickInvitationSummary />
          <PapiKostickInvitationTable
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
          <PapiKostickInvitationForm onSuccessCallback={refetch} />
        </div>
      </div>
    </FormDialogProvider>
  );
}
