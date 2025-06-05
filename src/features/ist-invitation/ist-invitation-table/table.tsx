import { DataTable } from "@/components/table/data-table";
import { columnsIstInvitation } from "./columns";
import type { IstInvitationTableProps } from "./schema";
import { DataTableToolbarIstInvitation } from "./toolbar";

export const IstInvitationTable = ({
  isLoading = false,
  data = [],
}: {
  isLoading: boolean;
  data?: IstInvitationTableProps[];
}) => {
  return (
    <DataTable
      columns={columnsIstInvitation}
      data={data}
      isLoading={isLoading}
      toolbar={DataTableToolbarIstInvitation}
    />
  );
};
