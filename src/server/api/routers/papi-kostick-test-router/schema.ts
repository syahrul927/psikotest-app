import { AnswerDetailsTable } from "@/features/ist-result";
import { z } from "zod";

export const AnswersPapiKostickRequest = z.array(
  z.object({
    questionId: z.string(),
    answer: z.string(),
  }),
);
export const SubmitAnswerPapiKostickRequest = z.object({
  data: AnswersPapiKostickRequest,
  invitationId: z.string(),
});
