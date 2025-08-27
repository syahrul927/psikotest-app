import { DataTable } from "@/components/table/data-table";
import { columnsInvitation } from "./columns";
import type { KraepelinInvitationTableProps } from "./schema";
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
