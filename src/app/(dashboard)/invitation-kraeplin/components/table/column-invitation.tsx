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
import { localDate } from "~/lib/utils";
import { env } from "~/env";
import getUrl from "../get-url";
import { useToast } from "~/app/_components/ui/use-toast";

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
		accessorKey: "startAt",
		header: "Start Time",
		cell: ({ row }) => {
			const date: Date = row.getValue("startAt");
			return <span>{date ? localDate(date) : "Not yet started"}</span>;
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
					<span className="font-medium">{status.label}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "profileName",
		header: "Profile Name",
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
		cell({ row }) {
			const { name, id, onDelete, status } = row.original;
			const { toast } = useToast();
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
									<Link href={`/${row.original.id}`}>
										<DropdownMenuItem>
											<EyeIcon
												size={16}
												className="mr-2 "
											/>
											<span>Hasil Test</span>
										</DropdownMenuItem>
									</Link>
								</DropdownMenuGroup>
							) : null}
							<DropdownMenuItem
								onClick={async () => {
									const base = await getUrl();
									const text = `Undangan Psikotest:\n${base}/p/invitation/${row.original.id}/confirmation\n\nSecret Key:\n${row.original.secretKey}`;
									toast({
										title: "Berhasil Copy Link ke Clipboard",
										description: (
											<pre className="mt-2 rounded-md bg-slate-950 text-white p-4">
												<code>{text}</code>
											</pre>
										),
									});
									return navigator.clipboard.writeText(text);
								}}
							>
								<CopyIcon size={16} className="mr-2 " />
								<span>Share</span>
							</DropdownMenuItem>
							<DropdownMenuLabel>Action</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<Link
									className="w-auto"
									href={`/update/?id=${row.original.id}`}
								>
									<DropdownMenuItem>
										<Settings2
											size={16}
											className="mr-2 "
										/>
										<span>Update Invitation</span>
									</DropdownMenuItem>
								</Link>

								{status !== "DONE" ? (
									<DropdownMenuItem className="text-red-600">
										<AlertDialogTrigger className="flex w-full justify-start">
											<TrashIcon
												size={16}
												className="mr-2 "
											/>
											<span>Delete</span>
										</AlertDialogTrigger>
									</DropdownMenuItem>
								) : null}
							</DropdownMenuGroup>
						</DropdownMenuContent>
						<AlertConfirm
							title={`Apakah kamu yakin ingin menghapus ${name} ?`}
							description="Ini akan menghapus permanen"
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
