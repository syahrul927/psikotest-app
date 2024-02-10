import { z } from "zod";

export const UserTableSchema = z.object({
	id: z.string(),
	name: z.string().nullish(),
	email: z.string().nullish(),
	role: z.string(),
	phone: z.string().nullish(),
	image: z.string().nullish(),
	referenceCode: z.string().nullish(),
});
export type UserTableProps = z.infer<typeof UserTableSchema> & {
	onDelete: (id: string) => void;
};
