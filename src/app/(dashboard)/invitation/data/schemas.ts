import { z } from "zod";

export const InvitationTableSchema = z.object({
	id: z.string(),
	name: z.string().nullish(),
	status: z.string(),
	secretKey: z.string(),
	startAt: z.date().nullish(),
	profileName: z.string().nullish(),
});
export type InvitationTableProps = z.infer<typeof InvitationTableSchema> & {
	onDelete: (id: string) => void;
};
