import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PapiKostickResultType } from "@/hooks/use-papi-kostick-result-context";
import { Skeleton } from "@/components/ui/skeleton";

// Group data by category and calculate rowspan
const categoryStyles = [
  "bg-gray-50 text-gray-900 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600",
  "bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-500",
  "bg-white text-gray-900 border-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700",
];

interface Props {
  isLoading?: boolean;
  data: PapiKostickResultType[];
}
export function PapiKostickResultTable({ data, isLoading }: Props) {
  const groupedData = data.reduce(
    (acc, item) => {
      if (!acc[item.category!]) {
        acc[item.category!] = [];
      }
      acc[item.category!]?.push(item);
      return acc;
    },
    {} as Record<string, typeof data>,
  );

  // Create flat array with rowspan information
  const tableData = Object.entries(groupedData).flatMap(
    ([category, items], categoryIndex) =>
      items.map((item, itemIndex) => ({
        ...item,
        isFirstInCategory: itemIndex === 0,
        categoryRowspan: items.length,
        categoryIndex,
      })),
  );
  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }
  return (
    <Card className="border-0">
      <CardContent className="p-0">
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-800">
                <TableHead
                  colSpan={2}
                  className="text-left font-semibold text-gray-900 dark:text-gray-100"
                >
                  Aspek
                </TableHead>
                <TableHead className="w-10 text-center font-semibold text-gray-900 dark:text-gray-100">
                  Faktor
                </TableHead>
                <TableHead className="w-10 text-center font-semibold text-gray-900 dark:text-gray-100">
                  Skor
                </TableHead>
                <TableHead className="w-10 text-left font-semibold text-gray-900 dark:text-gray-100">
                  Analisis
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item, index) => (
                <TableRow
                  key={index}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {item.isFirstInCategory && (
                    <TableCell
                      rowSpan={item.categoryRowspan}
                      className={`border-r border-gray-200 px-4 py-4 align-top font-medium dark:border-gray-700 ${categoryStyles[item.categoryIndex % categoryStyles.length]}`}
                    >
                      <div className="sticky top-4">
                        <span className="text-sm font-semibold">
                          {item.category}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="px-4 py-4 text-gray-700 dark:text-gray-300">
                    {item.aspect}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 font-mono text-sm font-bold text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                      {item.factor}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                      {item.score}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-4 text-left">
                    <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                      {item.interpretation}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
