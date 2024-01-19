import { z } from "zod";

export const ProductTableSchema = z.object({
	id: z.string(),
	status: z.string(),
	name: z.string(),
	price: z.number(),
});
export type ProductTableProps = z.infer<typeof ProductTableSchema> & {
	onDelete: (id: string) => void;
};
