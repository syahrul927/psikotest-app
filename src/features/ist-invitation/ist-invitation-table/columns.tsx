"use client";

import AlertConfirm from "@/components/ui/alert-confirm";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
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
  CheckCheck,
  CopyIcon,
  EyeIcon,
  ListCheck,
  MoreHorizontalIcon,
  Settings2,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { IstInvitationStatus, type IstInvitationTableProps } from "./schema";
import { useIstInvFormDialogController } from "../ist-invitation-form";
import { cn } from "@/lib/utils";

export const columnsIstInvitation: ColumnDef<IstInvitationTableProps>[] = [
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
      const status = IstInvitationStatus.find(
        (status) => status.value === row.getValue("status"),
      );
      if (!status) {
        return null;
      }
      return (
        <div
          className={cn(
            "flex w-fit items-center rounded-sm border px-2 py-0.5",
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

const CellAction = ({ row }: { row: Row<IstInvitationTableProps> }) => {
  const { openDialog } = useIstInvFormDialogController();
  const { name, id, onDelete, status } = row.original;
  return (
    <DropdownMenu>
      <AlertDialog>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"}>
            <MoreHorizontalIcon size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Information</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {status === "DONE" ? (
            <DropdownMenuGroup>
              <Link href={PAGE_URLS.IST_INVITATION_RESULT(id)}>
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
              const text = `Undangan Psikotest:\n${base}${PAGE_URLS.IST_TEST_CONFIRMATION(id)}\n\nSecret Key:\n${row.original.secretKey}`;
              toast.success("Berhasil Copy Link ke Clipboard");
              return navigator.clipboard.writeText(text);
            }}
          >
            <CopyIcon size={16} className="mr-2" />
            <span>Share</span>
          </DropdownMenuItem>
          {(status === "AWAITING_REVIEW" || status === "DONE") && (
            <DropdownMenuLabel>Action</DropdownMenuLabel>
          )}
          {status === "AWAITING_REVIEW" && (
            <>
              <DropdownMenuItem asChild>
                <Link href={PAGE_URLS.IST_INVITATION_REVIEW(row.original.id)}>
                  <ListCheck size={16} className="mr-2" />
                  <span>Review</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
          {status === "DONE" && (
            <DropdownMenuItem asChild>
              <Link href={PAGE_URLS.IST_INVITATION_RESULT(row.original.id)}>
                <CheckCheck size={16} className="mr-2" />
                <span>Hasil Test</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuGroup>
            {status === "PENDING" ? (
              <DropdownMenuItem onClick={() => openDialog(row.original.id)}>
                <Settings2 size={16} className="mr-2" />
                <span>Update Invitation</span>
              </DropdownMenuItem>
            ) : null}
            {status !== "DONE" ? (
              <AlertDialogTrigger asChild className="flex w-full justify-start">
                <DropdownMenuItem className="text-destructive">
                  <TrashIcon
                    size={16}
                    className="mr-2 text-current hover:text-current"
                  />
                  <span>Delete</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            ) : null}
          </DropdownMenuGroup>
        </DropdownMenuContent>
        <AlertConfirm
          title={`Apakah kamu yakin ingin menghapus ${name} ?`}
          description="Ini akan menghapus permanen"
          onAction={() => onDelete(id)}
          variant="destructive"
        >
          Delete
        </AlertConfirm>
      </AlertDialog>
    </DropdownMenu>
  );
};
