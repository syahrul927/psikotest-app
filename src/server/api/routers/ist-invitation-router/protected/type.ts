import type { IstInvitation, TesterProfile } from "@prisma/client";
import { z } from "zod";

export const SaveIstInvitationRouterSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  secretKey: z.string(),
});

export type ResponseIstInvitationRouterSchema = IstInvitation & {
  testerProfile: TesterProfile | null;
} & { status: string };
