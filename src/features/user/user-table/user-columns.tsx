"use client";

import AlertConfirm from "@/components/ui/alert-confirm";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { getAvatarName } from "@/lib/avatar-utils";
import { type ColumnDef, type Row } from "@tanstack/react-table";
import { MoreHorizontalIcon, Settings2, TrashIcon } from "lucide-react";
import type { UserTableProps } from "./schema";
import { useUserFormDialogController } from "../user-form/user-form-dialog-controller";

export const columnsUser: ColumnDef<UserTableProps>[] = [
  {
    accessorKey: "name",
    header: "Nama",
    cell({ row }) {
      return (
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarFallback className="rounded-lg">
              {getAvatarName(row.original.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-center">{row.getValue("name")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: ({ row }) => <UserActionsCell row={row} />,
  },
];

const UserActionsCell: React.FC<{ row: Row<UserTableProps> }> = ({ row }) => {
  const { openDialog } = useUserFormDialogController();
  const { name, id, onDelete } = row.original;

  return (
    <DropdownMenu>
      <AlertDialog>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"}>
            <MoreHorizontalIcon size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => openDialog(id)}>
              <Settings2 size={16} className="mr-2" />
              <span>Update User</span>
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem variant="destructive">
                <TrashIcon size={16} className="mr-2" />
                <span>Delete</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuGroup>
        </DropdownMenuContent>
        <AlertConfirm
          title={`Apakah kamu yakin ingin menghapus user ${name} ?`}
          description="Ini akan menghapus user selamanya"
          onAction={() => onDelete(id)}
          variant={"destructive"}
        >
          Delete
        </AlertConfirm>
      </AlertDialog>
    </DropdownMenu>
  );
};
