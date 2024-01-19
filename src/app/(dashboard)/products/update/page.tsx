import { redirect } from "next/navigation";
import { type PageType } from "~/types/page-type";
import { ProductForm } from "../components/product-form";
import { api } from "~/trpc/server";

export default async function UpdateProductPage({ searchParams }: PageType) {
	const id = searchParams.id;
	if (!id || id instanceof Array) {
		redirect("/products");
	}
	const data = await api.product.getById.query(id);
	return (
		<div className="flex flex-col h-full max-w-xl">
			<ProductForm update={true} data={data} />
		</div>
	);
}
