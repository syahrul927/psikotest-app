"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
	KeyRoundIcon,
	MoreHorizontalIcon,
	Settings2,
	TrashIcon,
} from "lucide-react";
import Link from "next/link";
import AlertConfirm from "~/app/_components/alert-confirm";
import AvatarUser from "~/app/_components/avatar-user";
import {
	AlertDialog,
	AlertDialogTrigger,
} from "~/app/_components/ui/alert-dialog";
import { Button } from "~/app/_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { type UserTableProps } from "../../data/schemas";

export const columnsUser: ColumnDef<UserTableProps>[] = [
	{
		accessorKey: "name",
		header: "Nama",
		cell({ row }) {
			const img = row.original.image;
			return (
				<div className="flex items-center space-x-2">
					<AvatarUser name={row.getValue("name")} img={img} />
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
		cell({ row }) {
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
								<Link
									className="w-auto"
									href={`/user/update/?id=${row.original.id}`}
								>
									<DropdownMenuItem>
										<Settings2
											size={16}
											className="mr-2 "
										/>
										<span>Update User</span>
									</DropdownMenuItem>
								</Link>

								<Link
									className="w-auto"
									href={`/user/passwordj/?id=${row.original.id}`}
								>
									<DropdownMenuItem>
										<KeyRoundIcon
											size={16}
											className="mr-2 "
										/>
										<span>Change Password</span>
									</DropdownMenuItem>
								</Link>
								<DropdownMenuItem className="text-red-600">
									<AlertDialogTrigger className="flex w-full justify-start">
										<TrashIcon
											size={16}
											className="mr-2 "
										/>
										<span>Delete</span>
									</AlertDialogTrigger>
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
						<AlertConfirm
							title={`Apakah kamu yakin ingin menghapus user ${name} ?`}
							description="Ini akan menghapus user selamanya"
							onAction={() => onDelete(id)}
							buttonVariant={{
								variant: "destructive",
							}}
						>
							Delete
						</AlertConfirm>
					</AlertDialog>
				</DropdownMenu>
			);
		},
	},
];
