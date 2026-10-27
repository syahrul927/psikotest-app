"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type ColumnDef } from "@tanstack/react-table";
import { EditIcon } from "lucide-react";
import { localDate } from "@/lib/date-utils";
import { getWwqQuestionMeta } from "@/lib/wwq-utils";

export type WwqQuestionRow = {
  id: string;
  order: number;
  description: string;
  updatedAt: Date;
};

export const columns: ColumnDef<WwqQuestionRow>[] = [
  {
    accessorKey: "order",
    header: "No",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono text-xs">
        {Number(row.getValue("order"))}
      </Badge>
    ),
  },
  {
    accessorKey: "description",
    header: "Soal",
    cell: ({ row }) => {
      const description = String(row.getValue("description"));
      const truncated =
        description.length > 60
          ? `${description.substring(0, 60)}...`
          : description;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">{truncated}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "aspects",
    header: "Aspek",
    cell: ({ row }) => {
      const meta = getWwqQuestionMeta(row.original.order);
      return (
        <span className="text-muted-foreground text-sm">
          {meta.map((m) => m.aspectName).join(" + ")}
        </span>
      );
    },
  },
  {
    id: "scoring",
    header: "Skor pada",
    cell: ({ row }) => {
      const meta = getWwqQuestionMeta(row.original.order);
      return (
        <div className="flex gap-1">
          {meta.map((m) => (
            <Badge
              key={m.aspectNo}
              variant="outline"
              className="font-mono text-xs"
            >
              {m.inverted ? "TIDAK" : "YA"}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Diubah",
    cell: ({ row }) => (
      <span className="text-sm">{localDate(row.original.updatedAt)}</span>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row, table }) => {
      const question = row.original;

      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const meta = table.options.meta as {
              onEdit?: (question: WwqQuestionRow) => void;
            };
            meta?.onEdit?.(question);
          }}
        >
          <EditIcon className="mr-1 h-4 w-4" />
          Edit
        </Button>
      );
    },
  },
];
