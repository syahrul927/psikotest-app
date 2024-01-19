"use client";

import { type Table } from "@tanstack/react-table";
import { XIcon } from "lucide-react";
import { Button } from "~/app/_components/ui/button";
import { Input } from "../../../../_components/ui/input";
import { statuses } from "../../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import Link from "next/link";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	return (
		<div className="flex sm:items-center sm:justify-between space-y-2 sm:space-y-0 flex-col sm:flex-row">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Filter tasks..."
					value={
						(table.getColumn("name")?.getFilterValue() as string) ??
						""
					}
					onChange={(event) =>
						table
							.getColumn("name")
							?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				{table.getColumn("status") && (
					<DataTableFacetedFilter
						column={table.getColumn("status")}
						title="Status"
						options={statuses}
					/>
				)}
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3"
					>
						Reset
						<XIcon className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>
			<DataTableViewOptions table={table} />
			<Link href="/products/add">
				<Button className="h-8 sm:ml-3">Add New</Button>
			</Link>
		</div>
	);
}
