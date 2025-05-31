import { DataTable } from "@/components/table/data-table";
import type { KraepelinInvitationTableProps } from "./schema";
import { columnsInvitation } from "./columns";
import { DataTableToolbarKraepelinInvitation } from "./toolbar";

export const KraepelinInvitationTable = ({
  isLoading = false,
  data = [],
}: {
  isLoading: boolean;
  data?: KraepelinInvitationTableProps[];
}) => {
  return (
    <DataTable
      columns={columnsInvitation}
      data={data}
      isLoading={isLoading}
      toolbar={DataTableToolbarKraepelinInvitation}
    />
  );
};
