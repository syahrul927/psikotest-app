"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
	CopyIcon,
	EyeIcon,
	MoreHorizontalIcon,
	Settings2,
	TrashIcon,
} from "lucide-react";
import Link from "next/link";
import AlertConfirm from "~/app/_components/alert-confirm";
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
import { statuses } from "../../data/data";
import { type InvitationTableProps } from "../../data/schemas";

export const columnsPost: ColumnDef<InvitationTableProps>[] = [
	{
		accessorKey: "name",
		header: "Invitation Name",
		cell: ({ row }) => {
			return (
				<span className="font-semibold">{row.getValue("name")}</span>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		filterFn: (row, id, value: string[]) => {
			return value.includes(row.getValue(id));
		},
		cell: ({ row }) => {
			const status = statuses.find(
				(status) => status.value === row.getValue("status"),
			);
			if (!status) {
				return null;
			}
			return (
				<div className="flex w-[200px] items-center">
					{status.icon && (
						<status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
					)}
					<span>{status.label}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "profileName",
		header: "Profile Name",
		cell: ({ row }) => {
			return <span>{row.getValue("profileName")}</span>;
		},
	},
	{
		accessorKey: "secretKey",
		header: "Secret Key",
	},
	{
		header: "",
		accessorKey: "action",
		cell({ row }) {
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
							{status === "DONE" ? (
								<>
									<DropdownMenuLabel>
										Information
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<Link
											href={`/dashboard/invitation/${row.original.id}`}
										>
											<DropdownMenuItem>
												<EyeIcon
													size={16}
													className="mr-2 "
												/>
												<span>Hasil Test</span>
											</DropdownMenuItem>
										</Link>
									</DropdownMenuGroup>
								</>
							) : null}
							<DropdownMenuLabel>Action</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<Link
									className="w-auto"
									href={`/products/update/?id=${row.original.id}`}
								>
									<DropdownMenuItem>
										<Settings2
											size={16}
											className="mr-2 "
										/>
										<span>Update Product</span>
									</DropdownMenuItem>
								</Link>
								<DropdownMenuItem>
									<CopyIcon size={16} className="mr-2 " />
									<span>Copy</span>
								</DropdownMenuItem>
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
							title={`Are you sure to delete ${name} from product ?`}
							description="This will permanently delete your menu."
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
