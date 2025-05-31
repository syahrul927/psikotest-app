import { HelpCircleIcon, EqualIcon, CheckCheckIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Fragment } from "react";

export interface KraepelinResultDetailAnswerItemProps {
  x: string | number;
  detail: {
    a: number;
    b: number;
    value: number;
    correct: number;
  }[];
}

interface KraepelinResultAnswerProps {
  data: KraepelinResultDetailAnswerItemProps[];
}
export function KraepelinResultDetailAnswer({
  data,
}: KraepelinResultAnswerProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Detail Jawaban</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-5 gap-6">
        {data.map((item, index) => (
          <Table
            key={`${item.x} - index ${index}`}
            className="border text-center"
          >
            <TableHeader>
              <TableRow>
                <TableHead colSpan={3}>
                  <p className="text-muted-foreground">Baris {item.x}</p>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableHeader className="text-xs">
              <TableRow>
                <TableHead className="text-left">
                  <HelpCircleIcon size={20} />
                </TableHead>
                <TableHead className="text-right">
                  <EqualIcon size={20} />
                </TableHead>
                <TableHead className="text-right">
                  <CheckCheckIcon size={20} />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {item.detail.map((detail, idx) => (
                <Fragment key={idx}>
                  {idx === 0 && (
                    <TableRow>
                      <TableHead className="text-left" colSpan={3}>
                        {detail.a}
                      </TableHead>
                    </TableRow>
                  )}

                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className={cn(
                        "text-right",
                        detail.value !== detail.correct
                          ? "bg-destructive/70 text-destructive-foreground"
                          : "text-secondary-foreground bg-secondary",
                      )}
                    >
                      {detail.value}
                    </TableCell>
                    <TableCell className="text-right">
                      {detail.correct}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableHead colSpan={3} className="text-left">
                      {detail.b}
                    </TableHead>
                  </TableRow>
                </Fragment>
              ))}
            </TableBody>
          </Table>
        ))}
      </CardContent>
    </Card>
  );
}
