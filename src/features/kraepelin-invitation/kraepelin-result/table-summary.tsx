import { DataTable } from "@/components/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderSpinner } from "@/components/ui/loading-spinner";
import type { KraepelinInvitationResultTableProps } from "./schema";
import { kraepelinResultSummaryColumns } from "./summary-columns";
import { DataTableToolbarSummary } from "./toolbar";

interface KraepelinResultTableSummaryProps {
  data: KraepelinInvitationResultTableProps[];
  isLoading?: boolean;
}
export function KraepelinResultTableSummary({
  data,
  isLoading,
}: KraepelinResultTableSummaryProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="leading-tight">Ringkasan Per Baris</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-6">
        {isLoading ? (
          <LoaderSpinner />
        ) : (
          <DataTable
            columns={kraepelinResultSummaryColumns}
            data={Array.from({ length: 40 }).map((_, idx) => {
              const index = idx + 1;
              const val = data.find((item) => item.row === index);
              if (val) {
                return val;
              }
              return {
                row: index,
                answered: 0,
                correct: 0,
                wrong: 0,
              };
            })}
            toolbar={DataTableToolbarSummary}
          />
        )}
      </CardContent>
    </Card>
  );
}
