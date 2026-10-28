import { z } from "zod";

// WWQ question ids are real DB cuids (unlike PAPI, whose ids are numeric
// strings). The server maps id -> order before scoring.
export const AnswersWwqRequest = z.array(
  z.object({
    questionId: z.string().min(1),
    answer: z.boolean(),
  }),
);

export const SubmitAnswerWwqRequest = z.object({
  data: AnswersWwqRequest,
  invitationId: z.string(),
});
