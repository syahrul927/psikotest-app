"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localDate } from "@/lib/date-utils";
import { PAGE_URLS } from "@/lib/page-url";
import { type ColumnDef, type Row } from "@tanstack/react-table";
import {
  CopyIcon,
  EyeIcon,
  MoreHorizontalIcon,
  Settings2,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useKraepelinInvFormDialogController } from "../kraepelin-invitation-form";
import {
  KraepelinInvitationStatus,
  type KraepelinInvitationTableProps,
} from "./schema";
import { cn } from "@/lib/utils";
import { useDeleteDialog } from "./delete-dialog-context";

export const columnsInvitation: ColumnDef<KraepelinInvitationTableProps>[] = [
  {
    accessorKey: "name",
    header: "Nama Klien",
    cell: ({ row }) => {
      return <span className="font-semibold">{row.getValue("name")}</span>;
    },
  },
  {
    accessorKey: "startAt",
    header: "Waktu Mulai",
    cell: ({ row }) => {
      const date: Date = row.getValue("startAt");
      return <span>{date ? localDate(date) : "Belum dimulai"}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const status = KraepelinInvitationStatus.find(
        (status) => status.value === row.getValue("status"),
      );
      if (!status) {
        return null;
      }
      return (
        <div
          className={cn(
            "flex w-fit items-center rounded-sm px-2 py-0.5",
            status.style,
          )}
        >
          {status.icon && <status.icon className="mr-2 h-4 w-4" />}
          <span className="font-medium">{status.label}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "profileName",
    header: "Nama Peserta",
    cell: ({ row }) => {
      return <span>{row.getValue("profileName") ?? "-"}</span>;
    },
  },
  {
    accessorKey: "secretKey",
    header: "Secret Key",
  },
  {
    header: "",
    accessorKey: "action",
    cell: ({ row }) => <CellAction row={row} />,
  },
];
const CellAction = ({ row }: { row: Row<KraepelinInvitationTableProps> }) => {
  const { openDialog } = useKraepelinInvFormDialogController();
  const { openDeleteDialog } = useDeleteDialog();
  const { name, id, onDelete, status } = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"}>
          <MoreHorizontalIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Informasi</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {status === "DONE" ? (
          <DropdownMenuGroup>
            <Link href={PAGE_URLS.KRAEPELIN_INVITATION_RESULT(id)}>
              <DropdownMenuItem>
                <EyeIcon size={16} className="mr-2" />
                <span>Hasil Test</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        ) : null}
        <DropdownMenuItem
          onClick={async () => {
            const base = process.env.NEXT_PUBLIC_BASE_URL;
            const text = `Undangan Psikotest:\n${base}${PAGE_URLS.KRAEPELIN_TEST_CONFIRMATION(id)}\n\nSecret Key:\n${row.original.secretKey}`;
            toast.success("Berhasil Copy Link ke Clipboard");
            return navigator.clipboard.writeText(text);
          }}
        >
          <CopyIcon size={16} className="mr-2" />
          <span>Share</span>
        </DropdownMenuItem>
        <DropdownMenuGroup>
          {status === "PENDING" ? (
            <DropdownMenuItem onClick={() => openDialog(row.original.id)}>
              <Settings2 size={16} className="mr-2" />
              <span>Ubah Undangan</span>
            </DropdownMenuItem>
          ) : null}
          {status !== "DONE" ? (
            <DropdownMenuItem
              className="text-destructive"
              onClick={() =>
                openDeleteDialog({ id, name: name ?? "", onDelete })
              }
            >
              <TrashIcon size={16} className="text-destructive mr-2" />
              <span>Hapus</span>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
