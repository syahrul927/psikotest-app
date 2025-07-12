"use client";

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
import { useDeleteDialog } from "./delete-dialog-context";

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
  const { openDeleteDialog } = useDeleteDialog();
  const { name, id, onDelete } = row.original;

  return (
    <DropdownMenu>
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
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => openDeleteDialog({ id, name: name ?? "", onDelete })}
          >
            <TrashIcon size={16} className="mr-2" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
