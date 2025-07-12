import { DataTable } from "@/components/table/data-table";
import type { KraepelinInvitationTableProps } from "./schema";
import { columnsInvitation } from "./columns";
import { DataTableToolbarKraepelinInvitation } from "./toolbar";
import { DeleteDialogProvider } from "./delete-dialog-context";
import { DeleteDialog } from "./delete-dialog";

export const KraepelinInvitationTable = ({
  isLoading = false,
  data = [],
}: {
  isLoading: boolean;
  data?: KraepelinInvitationTableProps[];
}) => {
  return (
    <DeleteDialogProvider>
      <DataTable
        columns={columnsInvitation}
        data={data}
        isLoading={isLoading}
        toolbar={DataTableToolbarKraepelinInvitation}
      />
      <DeleteDialog />
    </DeleteDialogProvider>
  );
};
