import { z } from "zod";

export const KraepelinInvitationResultTableSchema = z.object({
  row: z.number(),
  answered: z.number(),
  correct: z.number(),
  wrong: z.number(),
});
export type KraepelinInvitationResultTableProps = z.infer<
  typeof KraepelinInvitationResultTableSchema
>;
