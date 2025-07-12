import { DataTable } from "@/components/table/data-table";
import { columnsIstInvitation } from "./columns";
import type { IstInvitationTableProps } from "./schema";
import { DataTableToolbarIstInvitation } from "./toolbar";
import { DeleteDialogProvider } from "./delete-dialog-context";
import { DeleteDialog } from "./delete-dialog";

export const IstInvitationTable = ({
  isLoading = false,
  data = [],
}: {
  isLoading: boolean;
  data?: IstInvitationTableProps[];
}) => {
  return (
    <DeleteDialogProvider>
      <DataTable
        columns={columnsIstInvitation}
        data={data}
        isLoading={isLoading}
        toolbar={DataTableToolbarIstInvitation}
      />
      <DeleteDialog />
    </DeleteDialogProvider>
  );
};
