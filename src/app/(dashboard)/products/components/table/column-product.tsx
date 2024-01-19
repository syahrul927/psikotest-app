"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
	CopyIcon,
	EyeIcon,
	MoreHorizontalIcon,
	Settings2,
	TrashIcon,
} from "lucide-react";
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
import { cn } from "~/lib/utils";
import { type ProductTableProps } from "../../data/schemas";
import Link from "next/link";
import {
	AlertDialog,
	AlertDialogTrigger,
} from "~/app/_components/ui/alert-dialog";
import AlertConfirm from "~/app/_components/alert-confirm";
import { api } from "~/trpc/react";

export const columnsPost: ColumnDef<ProductTableProps>[] = [
	{
		accessorKey: "name",
		header: "Product Name",
		cell: ({ row }) => {
			return (
				<div className="flex space-x-2">
					<span className="max-w-[500px] min-w-full truncate font-medium">
						{row.getValue("name")}
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: "price",
		header: () => <div className="text-right">Price</div>,
		cell: ({ row }) => {
			const price = parseFloat(row.getValue("price"));
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "IDR",
			}).format(price);

			return <div className="text-right font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: "status",
		header: () => <div className="text-center">Status</div>,
		filterFn: (row, id, value: string) => {
			return value.includes(row.getValue(id));
		},
		cell({ row }) {
			return (
				<div
					className={cn(
						"px-2 text-center py-1 rounded-sm font-medium capitalize",
						row.getValue("status") === "active"
							? "text-foreground"
							: "text-muted-foreground",
					)}
				>
					{row.getValue("status")}
				</div>
			);
		},
	},
	{
		header: "",
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
							<DropdownMenuLabel>Information</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<Link href={`/products/${row.original.id}`}>
									<DropdownMenuItem>
										<EyeIcon size={16} className="mr-2 " />
										<span>View Detail</span>
									</DropdownMenuItem>
								</Link>
							</DropdownMenuGroup>
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
