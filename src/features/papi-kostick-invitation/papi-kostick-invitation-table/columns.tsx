import { useDeleteConfirmation } from "@/components/alert/dialog-delete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFormDialog } from "@/hooks/use-dialog-form";
import { PAGE_URLS } from "@/lib/page-url";
import { type ColumnDef, type Row } from "@tanstack/react-table";
import { CheckCheck, Copy, Edit3, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  PapiKostickInvitationStatus,
  type PapiKostickInvitationTableProps,
} from "./schema";
import { localDate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const ColumnsPapiKostickInvitation: ColumnDef<PapiKostickInvitationTableProps>[] =
  [
    {
      accessorKey: "name",
      header: "Nama",
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        return name || "-";
      },
    },

    {
      accessorKey: "startAt",
      header: "Waktu mulai",
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
        const status = PapiKostickInvitationStatus.find(
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
      accessorKey: "secretKey",
      header: "Secret Key",
    },
    {
      id: "actions",
      cell: ({ row }) => <CellAction row={row} />,
    },
  ];

const CellAction = ({ row }: { row: Row<PapiKostickInvitationTableProps> }) => {
  const { id, onDelete, name, status } = row.original;
  const isPending = status === "PENDING";
  const [open, setOpen] = useState<boolean>(false);
  const { confirmationDelete } = useDeleteConfirmation();
  const { handleOpenDialog } = useFormDialog();

  const copyToClipboard = () => {
    const base = process.env.NEXT_PUBLIC_BASE_URL;
    const text = `Undangan Psikotest:\n${base}${PAGE_URLS.PAPI_KOSTICK_TEST_CONFIRMATION(id)}\n\nSecret Key:\n${row.original.secretKey}`;
    toast.success("Berhasil Copy Link ke Clipboard");
    return navigator.clipboard.writeText(text);
  };
  const handleEdit = () => {
    setOpen(false);
    handleOpenDialog(id);
  };
  const handleDelete = () => {
    setOpen(false);
    confirmationDelete(() => onDelete(id));
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Aksi</DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => copyToClipboard()}
          className="cursor-pointer"
        >
          <Copy className="mr-2 h-4 w-4" />
          Salin Link
        </DropdownMenuItem>
        {status === "DONE" && (
          <DropdownMenuItem asChild>
            <Link
              href={PAGE_URLS.PAPI_KOSTICK_INVITATION_RESULT(row.original.id)}
            >
              <CheckCheck size={16} className="mr-2" />
              <span>Hasil Test</span>
            </Link>
          </DropdownMenuItem>
        )}

        {isPending && (
          <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
            <Edit3 className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {isPending && (
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive bg-destructive/5"
          >
            <Trash2 className="mr-2 text-current hover:text-current" />
            <span>Hapus</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
