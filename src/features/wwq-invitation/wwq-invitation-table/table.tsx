"use client";
import { DataTable } from "@/components/table/data-table";
import { ColumnsWwqInvitation } from "./columns";
import { DataTableToolbarWwqInvitation } from "./toolbar";
import type { WwqInvitationTableProps } from "./schema";

interface Props {
  isLoading: boolean;
  data: WwqInvitationTableProps[];
}
export const WwqInvitationTable = ({ isLoading, data }: Props) => {
  return (
    <DataTable
      columns={ColumnsWwqInvitation}
      data={data}
      isLoading={isLoading}
      toolbar={DataTableToolbarWwqInvitation}
    />
  );
};
