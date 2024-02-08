import { DataTable } from "~/app/_components/table/data-table";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "~/app/_components/ui/card";
import { type InvitationResultTableProps } from "../data/schemas";
import { columnsSummaryInvitationResult } from "./table/column-summary-result";
import { DataTableToolbarSummary } from "./table/data-table-toolbar";
import Spinner from "~/app/_components/ui/spinner";

interface TableSummaryRowProps {
	data: InvitationResultTableProps[];
	isLoading?: boolean;
}
export default function TableSummaryRow({
	data,
	isLoading,
}: TableSummaryRowProps) {
	return (
		<Card className="col-span-2">
			<CardHeader>
				<CardTitle className="leading-tight">
					Ringkasan Per Baris
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col space-y-6">
				{isLoading ? (
					<Spinner />
				) : (
					<DataTable
						columns={columnsSummaryInvitationResult}
						data={Array.from({ length: 40 }).map((_, idx) => {
							const index = idx + 1;
							const val = data.find((item) => item.row === index);
							if (val) {
								return val;
							}
							return {
								row: index,
								answered: 0,
								correct: 0,
								wrong: 0,
							};
						})}
						toolbar={DataTableToolbarSummary}
					/>
				)}
			</CardContent>
		</Card>
	);
}
