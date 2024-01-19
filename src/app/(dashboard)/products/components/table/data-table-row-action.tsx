"use client";

import { type Row } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "../../../../_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "../../../../_components/ui/dropdown-menu";
import { ProductTableSchema } from "../../data/schemas";

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
}

export function DataTableRowActions<TData>({
	row,
}: DataTableRowActionsProps<TData>) {
	const task = ProductTableSchema.parse(row.original);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
				>
					<MoreHorizontalIcon className="h-4 w-4" />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[160px]">
				<DropdownMenuItem>Edit</DropdownMenuItem>
				<DropdownMenuItem>Make a copy</DropdownMenuItem>
				<DropdownMenuItem>Favorite</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					Delete {task.id}
					<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
