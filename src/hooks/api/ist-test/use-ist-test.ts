import { api, type RouterOutputs } from "@/trpc/react";

export type QuestionAndOptionsResponseType =
  RouterOutputs["istSubtest"]["getIstQuestionTemplateById"];
export const useGetQuestionAndOptions = (
  invitationId: string,
  subtestId: string,
) => {
  return api.istSubtest.getIstQuestionTemplateById.useQuery({
    invitationId: invitationId,
    subtestId: subtestId,
  });
};
