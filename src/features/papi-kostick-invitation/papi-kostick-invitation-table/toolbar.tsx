import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter";
import type { DataTableToolbarProps } from "@/components/table/data-type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormDialog } from "@/hooks/use-dialog-form";
import { PlusIcon } from "lucide-react";

export const papiKostickInvitationStatus = [
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "ONPROGRESS",
    label: "Dalam Proses",
  },
  {
    value: "DONE",
    label: "Selesai",
  },
];

export function DataTableToolbarPapiKostickInvitation<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { handleOpenDialog } = useFormDialog();
  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Cari nama atau kunci rahasia..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[250px] lg:w-[300px]"
        />

        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={papiKostickInvitationStatus}
          />
        )}
      </div>

      <Button onClick={() => handleOpenDialog()} size="sm" variant="default">
        <PlusIcon className="mr-2 h-4 w-4" />
        Buat Undangan Baru
      </Button>
    </div>
  );
}
export { DataTableToolbarPapiKostickInvitation as toolbar };
