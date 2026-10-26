import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type {
  WwqAspectResultType,
  WwqOverallResultType,
} from "@/hooks/use-wwq-result-context";
import { Skeleton } from "@/components/ui/skeleton";

// Kategori badge style per WWQ category (Normal / Kecendrungan / Gangguan)
const categoryBadgeStyles: Record<
  string,
  { variant: "positive" | "secondary" | "destructive"; className: string }
> = {
  Normal: { variant: "positive", className: "" },
  "Kecendrungan Pathologis": {
    variant: "secondary",
    className:
      "border-2 border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  "Gangguan Pathologis": { variant: "destructive", className: "" },
};

export function WwqCategoryBadge({ category }: { category: string }) {
  const style = categoryBadgeStyles[category];
  if (!style) {
    return <Badge variant="outline">{category}</Badge>;
  }
  return (
    <Badge variant={style.variant} className={style.className}>
      {category}
    </Badge>
  );
}

interface Props {
  isLoading?: boolean;
  data: WwqAspectResultType[];
  overall: WwqOverallResultType | null;
}

export function WwqResultTable({ data, overall, isLoading }: Props) {
  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const totalRawScore = data.reduce((sum, item) => sum + item.rawScore, 0);
  const totalWeighted = data.reduce((sum, item) => sum + item.weighted, 0);
  const totalPercent = data.reduce((sum, item) => sum + item.percent, 0);

  return (
    <Card className="border-0">
      <CardContent className="p-0">
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-800">
                <TableHead className="w-14 text-center font-semibold text-gray-900 dark:text-gray-100">
                  No
                </TableHead>
                <TableHead className="text-left font-semibold text-gray-900 dark:text-gray-100">
                  Aspek
                </TableHead>
                <TableHead className="w-20 text-center font-semibold text-gray-900 dark:text-gray-100">
                  Skor
                </TableHead>
                <TableHead className="w-20 text-center font-semibold text-gray-900 dark:text-gray-100">
                  Acuan
                </TableHead>
                <TableHead className="w-28 text-center font-semibold text-gray-900 dark:text-gray-100">
                  Tertimbang
                </TableHead>
                <TableHead className="w-24 text-center font-semibold text-gray-900 dark:text-gray-100">
                  %
                </TableHead>
                <TableHead className="w-52 text-left font-semibold text-gray-900 dark:text-gray-100">
                  Kategori
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow
                  key={item.aspectNo}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <TableCell className="px-4 py-4 text-center">
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 font-mono text-sm font-bold text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                      {item.aspectNo}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-4 font-medium text-gray-900 dark:text-gray-100">
                    {item.aspect}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                      {item.rawScore}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <span className="font-mono text-gray-700 dark:text-gray-300">
                      {item.acuan}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                      {item.weighted}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <span className="font-mono text-gray-700 dark:text-gray-300">
                      {`${item.percent.toFixed(2)}%`}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-left">
                    <WwqCategoryBadge category={item.category} />
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    Hasil tes belum tersedia
                  </TableCell>
                </TableRow>
              )}

              {/* Rekap nilai keseluruhan */}
              {overall && (
                <TableRow className="bg-gray-50 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-800">
                  <TableCell className="px-4 py-4 text-center" />
                  <TableCell className="px-4 py-4 font-semibold text-gray-900 dark:text-gray-100">
                    Total
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                      {totalRawScore}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                    -
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                      {overall.totalWeighted || totalWeighted}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                      {`${totalPercent.toFixed(2)}%`}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-left">
                    <WwqCategoryBadge category={overall.category} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
