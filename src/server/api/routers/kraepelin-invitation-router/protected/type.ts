import type { Invitation, TesterProfile } from "@prisma/client";
import { z } from "zod";

export const SaveInvitationRouterSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  secretKey: z.string(),
});

export type ResponseInvitationRouterSchema = Invitation & {
  testerProfile: TesterProfile | null;
} & { status: string };
