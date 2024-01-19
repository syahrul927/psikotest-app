export type LabelType = { label: string; description?: string; url: string };
const ProductsLabel: LabelType[] = [
	{
		label: "Products",
		url: "/products",
		description: "Manage your products with funny way",
	},
	{
		label: "Add New Product",
		url: "/products/add",
		description: "This is how customer see your product",
	},
	{
		label: "Update Product",
		url: "/products/update*",
		description: "This is how customer see your product",
	},
];
const PathLabel: LabelType[] = [
	{
		label: "Home",
		url: "/",
		description: "Summary of the data you have",
	},
	{
		label: "Customers",
		url: "/customers",
		description: "View all your customers here",
	},
	{
		label: "Settings",
		url: "/",
	},
	...ProductsLabel,
];
export default PathLabel;
