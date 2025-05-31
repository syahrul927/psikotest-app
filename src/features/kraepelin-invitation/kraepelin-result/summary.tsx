import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Table,
} from "@/components/ui/table";

interface KraepelinResultSummaryProps {
  isLoading?: boolean;
  totalAnswered: number;
  wrongAnswered: number;
  highest: number;
  lowest: number;
  deciel: number;
}
export function KraepelinResultSummary({
  deciel,
  highest,
  lowest,
  isLoading,
  totalAnswered,
  wrongAnswered,
}: KraepelinResultSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hasil Penilaian</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableHead>
                Jumlah Hitungan&nbsp;
                <span className="text-muted-foreground inline text-xs italic">
                  (total terjawab)
                </span>
              </TableHead>
              <TableCell className="text-right">{totalAnswered}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Jumlah Kesalahan</TableHead>
              <TableCell className="text-right">{wrongAnswered}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Puncak Tertinggi</TableHead>
              <TableCell className="text-right">{highest}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Puncak Terendah</TableHead>
              <TableCell className="text-right">{lowest}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead>
                Deciel&nbsp;
                <span className="text-muted-foreground inline text-xs italic">
                  ((Puncak Tertinggi + Puncak Terendah )/ 2)
                </span>
              </TableHead>
              <TableCell className="text-right">{deciel}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
