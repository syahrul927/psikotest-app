"use client";
import { DataTable } from "~/app/_components/table/data-table";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "~/app/_components/ui/card";
import { useToast } from "~/app/_components/ui/use-toast";
import { api } from "~/trpc/react";
import { columnsUser } from "./components/table/column-user";
import { DataTableToolbarUser } from "./components/table/data-table-toolbar";

export default function UserPage() {
	const { data, refetch } = api.user.getAllUser.useQuery();
	const { toast } = useToast();
	const { mutate: onDelete } = api.user.deleteById.useMutation({
		onSuccess: () => {
			toast({
				title: "Success deleted user",
			});
			void refetch();
		},
	});

	return (
		<div className="flex flex-col space-y-4">
			<Card>
				<CardHeader className="flex ">
					<CardTitle>List User</CardTitle>
					<p className="text-muted-foreground text-sm">
						Here&apos;s a list all of your user!
					</p>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={columnsUser}
						toolbar={DataTableToolbarUser}
						data={
							data
								? data.map(({ id, image, name, email }) => ({
										id,
										name: name,
										email: email,
										onDelete,
										image,
									}))
								: []
						}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
