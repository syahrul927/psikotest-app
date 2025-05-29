import { DataTable } from "@/components/table/data-table";
import { columnsInvitation } from "./kraeplin-invitation-columns";
import { DataTableToolbarKraeplinInvitation } from "./kraeplin-invitation-toolbar";
import type { KraeplinInvitationTableProps } from "./schema";

export const KraeplinInvitationTable = ({
  isLoading = false,
  data = [],
}: {
  isLoading: boolean;
  data?: KraeplinInvitationTableProps[];
}) => {
  return (
    <DataTable
      columns={columnsInvitation}
      data={data}
      isLoading={isLoading}
      toolbar={DataTableToolbarKraeplinInvitation}
    />
  );
};
