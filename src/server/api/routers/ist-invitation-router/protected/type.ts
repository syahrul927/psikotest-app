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

// Reset subtest schemas
export const ResetIstSubtestRouterSchema = z.object({
  invitationId: z.string({
    required_error: "ID undangan diperlukan",
    invalid_type_error: "ID undangan harus berupa string",
  }),
  subtestId: z.number({
    required_error: "ID subtest diperlukan", 
    invalid_type_error: "ID subtest harus berupa angka",
  }),
});

export type ResetIstSubtestRouterInput = z.infer<typeof ResetIstSubtestRouterSchema>;

export const ResetIstSubtestRouterResponse = z.object({
  success: z.boolean(),
  message: z.string(),
  resetSubtestName: z.string().optional(),
});

export type ResetIstSubtestRouterResponseType = z.infer<typeof ResetIstSubtestRouterResponse>;

// Subtest status schemas
export const SubtestStatusResponse = z.object({
  status: z.string(),
  subtests: z.array(z.object({
    id: z.number(),
    name: z.string(),
    canReset: z.boolean(),
  })),
});

export type SubtestStatusResponseType = z.infer<typeof SubtestStatusResponse>;
