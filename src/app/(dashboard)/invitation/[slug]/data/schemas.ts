import { z } from "zod";

export const InvitationResultTableSchema = z.object({
	row: z.number(),
	answered: z.number(),
	correct: z.number(),
	wrong: z.number(),
});
export type InvitationResultTableProps = z.infer<
	typeof InvitationResultTableSchema
>;
