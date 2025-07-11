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
import { EditIcon, ClockIcon } from "lucide-react";

export type SubtestTemplate = {
  id: string;
  name: string;
  description: string;
  instruction: string | null;
  timeLimit: number;
  updatedAt: Date;
};

export const columns: ColumnDef<SubtestTemplate>[] = [
  {
    accessorKey: "name",
    header: "Nama Subtest",
    cell: ({ row }) => {
      const name = String(row.getValue("name"));
      return (
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="font-mono text-xs">
            {name}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => {
      const description = String(row.getValue("description"));
      const truncated =
        description.length > 50
          ? `${description.substring(0, 50)}...`
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
    accessorKey: "instruction",
    header: "Instruksi",
    cell: ({ row }) => {
      const instruction = String(row.getValue("instruction"));
      const truncated =
        instruction.length > 40
          ? `${instruction.substring(0, 40)}...`
          : instruction;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-muted-foreground cursor-help">
                {truncated}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-md">
                <div className="text-sm whitespace-pre-wrap">{instruction}</div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "timeLimit",
    header: "Batas Waktu",
    cell: ({ row }) => {
      const timeLimit = Number(row.getValue("timeLimit"));

      return (
        <div className="flex items-center space-x-1">
          <ClockIcon className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-sm">
            {timeLimit} menit
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row, table }) => {
      const template = row.original;

      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // This will be handled by the table component
            const meta = table.options.meta as {
              onEdit?: (template: SubtestTemplate) => void;
            };
            meta?.onEdit?.(template);
          }}
        >
          <EditIcon className="mr-1 h-4 w-4" />
          Edit
        </Button>
      );
    },
  },
];
