"use client";
import {
	Layers2Icon,
	LayersIcon,
	PartyPopperIcon,
	SparkleIcon,
} from "lucide-react";
import { DataTable } from "~/app/_components/table/data-table";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "~/app/_components/ui/card";
import { api } from "~/trpc/react";
import { columnsPost } from "./components/table/column-product";
import { useToast } from "~/app/_components/ui/use-toast";

export default function ProductsPage() {
	const { data, refetch } = api.product.getAllProduct.useQuery();
	const { toast } = useToast();
	const { mutate: onDelete } = api.product.deleteById.useMutation({
		onSuccess: () => {
			toast({
				title: "Success deleted product",
			});
			void refetch();
		},
	});

	return (
		<div className="flex flex-col space-y-4">
			<div className="flex flex-col space-y-4">
				<SummaryProduct />
			</div>
			<Card>
				<CardHeader className="flex ">
					<CardTitle>List Product</CardTitle>
					<p className="text-muted-foreground text-sm">
						Here&apos;s a list all of your product!
					</p>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={columnsPost}
						data={
							data
								? data.map(({ id, name, price, status }) => ({
										id,
										name,
										price,
										status,
										onDelete,
									}))
								: []
						}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

const SummaryProduct = () => {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card className="">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Product of the week
					</CardTitle>
					<PartyPopperIcon
						size={16}
						className="text-muted-foreground"
					/>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold max-w-max text-ellipsis overflow-hidden">
						Ayam Phoenix
					</div>
					<p className="text-xs text-muted-foreground">10 sold</p>
				</CardContent>
			</Card>
			<Card className="">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Best seller product
					</CardTitle>
					<SparkleIcon size={16} className="text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">Mie Ayam Kabur</div>
					<p className="text-xs text-muted-foreground">
						Total 245 sold
					</p>
				</CardContent>
			</Card>
			<Card className="">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						All product
					</CardTitle>
					<LayersIcon size={16} className="text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">18</div>
					<p className="text-xs text-muted-foreground">
						All your products
					</p>
				</CardContent>
			</Card>
			<Card className="bg-red-200 dark:bg-red-800">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Out of stock
					</CardTitle>
					<Layers2Icon size={16} className="text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">4</div>
					<p className="text-xs text-muted-foreground">
						Less than 10
					</p>
				</CardContent>
			</Card>
		</div>
	);
};
