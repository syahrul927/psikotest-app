"use client";

import { cn } from "@/lib/utils";
import { type ColumnDef } from "@tanstack/react-table";
import type { KraepelinInvitationResultTableProps } from "./schema";

const filter = [6, 7, 8, 9, 10, 21, 22, 23, 24, 25, 36, 37, 38, 39, 40];
export const kraepelinResultSummaryColumns: ColumnDef<KraepelinInvitationResultTableProps>[] =
  [
    {
      accessorKey: "row",
      header() {
        return <p className={cn("text-center")}>{"Baris"}</p>;
      },
      cell({ row }) {
        const val = row.original.row;
        return (
          <p className={cn("text-center", filter.includes(val) ? "" : "")}>
            {row.getValue("row")}
          </p>
        );
      },
      filterFn: (row, _, value: string) => {
        if (!value) {
          return true;
        }
        return filter.includes(row.getValue("row"));
      },
    },
    {
      accessorKey: "answered",
      header() {
        return <p className={cn("text-center")}>{"Terjawab"}</p>;
      },
      cell({ row }) {
        const val = row.original.row;
        return (
          <p className={cn("text-center", filter.includes(val) ? "" : "")}>
            {row.getValue("answered")}
          </p>
        );
      },
    },
    {
      accessorKey: "correct",
      header() {
        return <p className={cn("text-center")}>{"Jawaban Benar"}</p>;
      },
      cell({ row }) {
        const val = row.original.row;
        return (
          <p className={cn("text-center", filter.includes(val) ? "" : "")}>
            {row.getValue("correct")}
          </p>
        );
      },
    },
    {
      accessorKey: "wrong",
      header() {
        return <p className={cn("text-center")}>{"Jawaban Salah"}</p>;
      },
      cell({ row }) {
        const val = row.original.row;
        return (
          <p className={cn("text-center", filter.includes(val) ? "" : "")}>
            {row.getValue("wrong")}
          </p>
        );
      },
    },
  ];
