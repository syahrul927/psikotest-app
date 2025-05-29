"use client";

import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter";
import { type DataTableToolbarProps } from "@/components/table/data-type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MailPlusIcon, XIcon } from "lucide-react";
import { useKraeplinInvFormDialogController } from "../kraeplin-invitation-form/kraeplin-invitation-dialog-controller";
import { KraeplinInvitationStatus } from "./schema";

export function DataTableToolbarKraeplinInvitation<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { setOpen } = useKraeplinInvFormDialogController();
  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={KraeplinInvitationStatus}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <Button onClick={() => setOpen(true)}>
        Buat Invitation
        <MailPlusIcon />
      </Button>
    </div>
  );
}
