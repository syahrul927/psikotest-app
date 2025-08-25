"use client";
import { DataTable } from "@/components/table/data-table";
import { ColumnsPapiKostickInvitation } from "./columns";
import { DataTableToolbarPapiKostickInvitation } from "./toolbar";
import type { PapiKostickInvitationTableProps } from "./schema";

interface Props {
  isLoading: boolean;
  data: PapiKostickInvitationTableProps[];
}
export const PapiKostickInvitationTable = ({ isLoading, data }: Props) => {
  return (
    <DataTable
      columns={ColumnsPapiKostickInvitation}
      data={data}
      isLoading={isLoading}
      toolbar={DataTableToolbarPapiKostickInvitation}
    />
  );
};
