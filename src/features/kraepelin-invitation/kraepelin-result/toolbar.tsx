"use client";

import { type Table } from "@tanstack/react-table";
import { XIcon } from "lucide-react";
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter";
import { Button } from "@/components/ui/button";
import { SummaryFilter } from "@/types/kraepelin-invitation-constanta";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbarSummary<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn("row") && (
          <DataTableFacetedFilter
            column={table.getColumn("row")}
            title="Filter"
            options={SummaryFilter}
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
    </div>
  );
}
